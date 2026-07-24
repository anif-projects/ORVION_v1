const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool = null;
let isMemoryMode = false;
const memoryStore = {};
const autoIncrementIds = {};

function formatMySQLDate(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function prepareDatabaseValue(val) {
  if (val instanceof Date) {
    return formatMySQLDate(val);
  }
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
    const parsedDate = new Date(val);
    if (!isNaN(parsedDate.getTime())) {
      return formatMySQLDate(parsedDate);
    }
  }
  if (typeof val === 'object' && val !== null) {
    return JSON.stringify(val);
  }
  return val;
}

function filterRows(rows, whereStr, params) {
  if (!whereStr || whereStr === '1=1') return rows;
  if (whereStr === '1=0') return [];

  const conds = whereStr.split(' AND ');
  let paramIdx = 0;

  return rows.filter(row => {
    let currentParamIdx = paramIdx;
    for (let cond of conds) {
      cond = cond.trim();
      if (cond === '1=1') continue;
      if (cond === '1=0') return false;

      const nullMatch = cond.match(/^`([^`]+)` IS NULL$/i);
      if (nullMatch) {
        if (row[nullMatch[1]] != null) return false;
        continue;
      }

      const eqMatch = cond.match(/^`([^`]+)` = \?$/i);
      if (eqMatch) {
        const col = eqMatch[1];
        const val = params[currentParamIdx++];
        if (row[col] != val && String(row[col]) !== String(val)) return false;
        continue;
      }

      const neMatch = cond.match(/^`([^`]+)` != \?$/i);
      if (neMatch) {
        const col = neMatch[1];
        const val = params[currentParamIdx++];
        if (row[col] == val || String(row[col]) === String(val)) return false;
        continue;
      }

      const inMatch = cond.match(/^`([^`]+)` IN \(([^)]+)\)$/i);
      if (inMatch) {
        const col = inMatch[1];
        const placeholders = inMatch[2].split(',').map(p => p.trim());
        const inVals = [];
        for (let i = 0; i < placeholders.length; i++) {
          inVals.push(params[currentParamIdx++]);
        }
        const rowVal = row[col];
        const matched = inVals.some(v => v == rowVal || String(v) === String(rowVal));
        if (!matched) return false;
        continue;
      }
    }
    return true;
  });
}

function sortRows(rows, orderStr) {
  const parts = orderStr.split(',').map(p => p.trim());
  return [...rows].sort((a, b) => {
    for (let part of parts) {
      const match = part.match(/`([^`]+)` (ASC|DESC)/i);
      if (match) {
        const col = match[1];
        const dir = match[2].toUpperCase() === 'DESC' ? -1 : 1;
        if (a[col] < b[col]) return -1 * dir;
        if (a[col] > b[col]) return 1 * dir;
      }
    }
    return 0;
  });
}

class InMemoryPool {
  async query(sql, params = []) {
    const trimmed = sql.trim();
    if (trimmed.startsWith('INSERT INTO')) {
      const match = trimmed.match(/INSERT INTO `([^`]+)` \(([^)]+)\) VALUES \(([^)]+)\)/i);
      if (match) {
        const tableName = match[1];
        const cols = match[2].split(',').map(c => c.trim().replace(/`/g, ''));
        if (!memoryStore[tableName]) memoryStore[tableName] = [];
        if (!autoIncrementIds[tableName]) autoIncrementIds[tableName] = 1;

        const newId = autoIncrementIds[tableName]++;
        const newRow = { id: newId };
        cols.forEach((col, idx) => {
          newRow[col] = params[idx];
        });
        memoryStore[tableName].push(newRow);
        return [{ insertId: newId }];
      }
    } else if (trimmed.startsWith('SELECT COUNT(*) AS count FROM')) {
      const match = trimmed.match(/SELECT COUNT\(\*\) AS count FROM `([^`]+)`(?: WHERE (.+))?/i);
      const tableName = match ? match[1] : '';
      const rows = memoryStore[tableName] || [];
      const filtered = filterRows(rows, match ? match[2] : null, params);
      return [[{ count: filtered.length }]];
    } else if (trimmed.startsWith('SELECT')) {
      const match = trimmed.match(/SELECT (.+) FROM `([^`]+)`(?: WHERE (.*?))?(?: ORDER BY (.*?))?(?: LIMIT (\d+))?(?: OFFSET (\d+))?$/i);
      if (match) {
        const selectFields = match[1];
        const tableName = match[2];
        const whereStr = match[3];
        const orderStr = match[4];
        const limitNum = match[5] ? parseInt(match[5]) : null;
        const offsetNum = match[6] ? parseInt(match[6]) : 0;

        let rows = [...(memoryStore[tableName] || [])];
        if (whereStr) {
          rows = filterRows(rows, whereStr, params);
        }
        if (orderStr) {
          rows = sortRows(rows, orderStr);
        }
        if (limitNum !== null) {
          rows = rows.slice(offsetNum, offsetNum + limitNum);
        }
        return [rows.map(r => ({ ...r }))];
      }
      return [[]];
    } else if (trimmed.startsWith('UPDATE')) {
      const match = trimmed.match(/UPDATE `([^`]+)` SET (.+?) WHERE (.+)/i);
      if (match) {
        const tableName = match[1];
        const setStr = match[2];
        const whereStr = match[3];
        const rows = memoryStore[tableName] || [];

        const setMatches = [...setStr.matchAll(/`([^`]+)` = \?/g)];
        const setCols = setMatches.map(m => m[1]);
        const setValCount = setCols.length;
        const setValues = params.slice(0, setValCount);
        const whereParams = params.slice(setValCount);

        const filtered = filterRows(rows, whereStr, whereParams);
        filtered.forEach(row => {
          setCols.forEach((col, idx) => {
            row[col] = setValues[idx];
          });
        });
        return [{ affectedRows: filtered.length }];
      }
      return [{ affectedRows: 0 }];
    } else if (trimmed.startsWith('DELETE FROM')) {
      const match = trimmed.match(/DELETE FROM `([^`]+)`(?: WHERE (.+))?/i);
      if (match) {
        const tableName = match[1];
        const whereStr = match[2];
        const rows = memoryStore[tableName] || [];
        const toDelete = filterRows(rows, whereStr, params);
        const toDeleteIds = new Set(toDelete.map(r => r.id));
        memoryStore[tableName] = rows.filter(r => !toDeleteIds.has(r.id));
        return [{ affectedRows: toDelete.length }];
      }
      return [{ affectedRows: 0 }];
    }

    return [[]];
  }
}
const connect = async () => {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = parseInt(process.env.MYSQL_PORT) || 3306;
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || 'root';
  const database = process.env.MYSQL_DATABASE || 'lms_production';

  try {
    const realPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      connectTimeout: 2000,
    });

    // Test connection
    const conn = await realPool.getConnection();
    console.log(`[Database] MySQL Connection Pool Initialized. Connected to: mysql://${host}:${port}/${database}`);
    conn.release();
    pool = realPool;
    return pool;
  } catch (err) {
    console.warn(`[Database Warning] MySQL connection failed (${err.message}). Using In-Memory Database Fallback.`);
    pool = new InMemoryPool();
    isMemoryMode = true;
    return pool;
  }
};

// Mongoose-like Schema class
class Schema {
  constructor(definition = {}, options = {}) {
    this.definition = definition;
    this.options = options;
    this.preHooks = {};
    this.methods = {};
  }

  pre(event, fn) {
    if (!this.preHooks[event]) {
      this.preHooks[event] = [];
    }
    this.preHooks[event].push(fn);
    return this;
  }

  index(fields, options) {
    // No-op since indexes are created in schema.sql
    return this;
  }
}

Schema.Types = {
  ObjectId: String,
  Mixed: Object,
};

// Global registry of models
const modelsRegistry = {};

// Helper to translate table name from Model name
const getTableName = (modelName) => {
  const mapping = {
    User: 'users',
    StudentProfile: 'student_profiles',
    Category: 'categories',
    Course: 'courses',
    Module: 'modules',
    Lesson: 'lessons',
    LessonProgress: 'lesson_progresses',
    Enrollment: 'enrollments',
    Certificate: 'certificates',
    Discussion: 'discussions',
    Event: 'events',
    OTP: 'otps',
    RefreshToken: 'refresh_tokens',
    AuditLog: 'audit_logs',
    Settings: 'settings',
    Payment: 'payments',
  };
  return mapping[modelName] || modelName.toLowerCase() + 's';
};

// Builder for WHERE clauses
function buildWhereClause(queryObj) {
  const conditions = [];
  const params = [];

  if (!queryObj || typeof queryObj !== 'object') {
    return { clause: '1=1', params: [] };
  }

  for (let key of Object.keys(queryObj)) {
    let column = key;
    if (column === '_id') column = 'id';

    const val = queryObj[key];
    if (val === undefined) continue;

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const operators = Object.keys(val);
      for (let op of operators) {
        if (op === '$in') {
          const inList = val[op];
          if (!Array.isArray(inList) || inList.length === 0) {
            conditions.push('1=0');
          } else {
            const placeholders = inList.map(() => '?').join(', ');
            conditions.push(`\`${column}\` IN (${placeholders})`);
            params.push(...inList.map(item => (item && item._id ? item._id : item)));
          }
        } else if (op === '$ne') {
          conditions.push(`\`${column}\` != ?`);
          params.push(val[op] && val[op]._id ? val[op]._id : val[op]);
        }
      }
    } else {
      if (val === null) {
        conditions.push(`\`${column}\` IS NULL`);
      } else {
        conditions.push(`\`${column}\` = ?`);
        params.push(val && val._id ? val._id : val);
      }
    }
  }

  const clause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
  return { clause, params };
}

// Document class representing a row instance
class Document {
  constructor(modelClass, data = {}, isNew = false) {
    this._modelClass = modelClass;
    this._isNew = isNew;
    this._initialData = { ...data };

    // Set properties
    for (let key of Object.keys(data)) {
      let val = data[key];
      // Auto-parse JSON columns
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        try {
          val = JSON.parse(val);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
      this[key] = val;
    }

    // Expose _id as alias for id
    Object.defineProperty(this, '_id', {
      get() {
        return this.id;
      },
      set(val) {
        this.id = val;
      },
      configurable: true,
      enumerable: true,
    });

    // Copy instance methods from schema
    const schema = modelClass.schema;
    if (schema && schema.methods) {
      for (let key of Object.keys(schema.methods)) {
        this[key] = schema.methods[key].bind(this);
      }
    }
  }

  toObject() {
    const obj = {};
    for (let key of Object.keys(this)) {
      if (!key.startsWith('_') && typeof this[key] !== 'function') {
        obj[key] = this[key];
      }
    }
    obj.id = this.id;
    obj._id = this.id;
    return obj;
  }

  toJSON() {
    return this.toObject();
  }

  toString() {
    return this.id ? this.id.toString() : '';
  }

  isModified(path) {
    if (this._isNew) return true;
    return this[path] !== this._initialData[path];
  }

  async save() {
    const schema = this._modelClass.schema;
    
    // 1. Run pre-save hooks
    if (schema && schema.preHooks && schema.preHooks['save']) {
      for (let hook of schema.preHooks['save']) {
        await new Promise((resolve, reject) => {
          // Binding 'this' to document
          hook.call(this, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    // 2. Prepare columns and parameterized values
    const dataToSave = {};
    const columns = [];
    const values = [];

    // Filter properties to save
    for (let key of Object.keys(this)) {
      if (key.startsWith('_') || typeof this[key] === 'function' || key === 'id') continue;
      
      let val = this[key];
      val = prepareDatabaseValue(val);
      dataToSave[key] = val;
      columns.push(key);
      values.push(val);
    }

    const tableName = this._modelClass.tableName;

    if (this._isNew) {
      // Create column placeholders
      const placeholders = columns.map(() => '?').join(', ');
      const sql = `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;
      
      const [result] = await pool.query(sql, values);
      this.id = result.insertId;
      this._isNew = false;
    } else {
      // Update existing record
      const setClause = columns.map(c => `\`${c}\` = ?`).join(', ');
      const sql = `UPDATE \`${tableName}\` SET ${setClause} WHERE \`id\` = ?`;
      values.push(this.id);
      
      await pool.query(sql, values);
    }

    return this;
  }
}

// Query class supporting Mongoose chained operations
class Query {
  constructor(modelClass, type = 'find', queryObj = {}) {
    this.modelClass = modelClass;
    this.type = type;
    this.queryObj = queryObj;
    this.populatePaths = [];
    this.sortObj = null;
    this.skipNum = null;
    this.limitNum = null;
    this.updateData = null;
  }

  populate(path, selectFields = '') {
    this.populatePaths.push({ path, selectFields });
    return this;
  }

  sort(sortObj) {
    this.sortObj = sortObj;
    return this;
  }

  skip(n) {
    this.skipNum = n;
    return this;
  }

  limit(n) {
    this.limitNum = n;
    return this;
  }

  select(fields) {
    // No-op for main select fields since we fetch all columns, but parsed in populate
    return this;
  }

  async execute() {
    if (!pool) await connect();

    const tableName = this.modelClass.tableName;
    const { clause, params } = buildWhereClause(this.queryObj);

    let sql = '';
    if (this.type === 'find' || this.type === 'findOne') {
      sql = `SELECT * FROM \`${tableName}\` WHERE ${clause}`;
      
      // Order By
      if (this.sortObj) {
        const orderClauses = [];
        if (typeof this.sortObj === 'object') {
          for (let key of Object.keys(this.sortObj)) {
            const dir = this.sortObj[key] === -1 || this.sortObj[key] === 'desc' ? 'DESC' : 'ASC';
            orderClauses.push(`\`${key === '_id' ? 'id' : key}\` ${dir}`);
          }
        } else if (typeof this.sortObj === 'string') {
          const parts = this.sortObj.trim().split(/\s+/);
          parts.forEach(part => {
            if (part.startsWith('-')) {
              orderClauses.push(`\`${part.substring(1)}\` DESC`);
            } else {
              orderClauses.push(`\`${part}\` ASC`);
            }
          });
        }
        if (orderClauses.length > 0) {
          sql += ` ORDER BY ${orderClauses.join(', ')}`;
        }
      }

      // Limit & Offset
      if (this.limitNum !== null) {
        sql += ` LIMIT ${parseInt(this.limitNum)}`;
        if (this.skipNum !== null) {
          sql += ` OFFSET ${parseInt(this.skipNum)}`;
        }
      } else if (this.type === 'findOne') {
        sql += ' LIMIT 1';
      }
    } else if (this.type === 'countDocuments') {
      sql = `SELECT COUNT(*) AS count FROM \`${tableName}\` WHERE ${clause}`;
    } else if (this.type === 'deleteMany' || this.type === 'deleteOne') {
      sql = `DELETE FROM \`${tableName}\` WHERE ${clause}`;
      if (this.type === 'deleteOne') sql += ' LIMIT 1';
    } else if (this.type === 'updateMany') {
      const setClauses = [];
      const updateParams = [];
      for (let key of Object.keys(this.updateData)) {
        setClauses.push(`\`${key}\` = ?`);
        let val = this.updateData[key];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        updateParams.push(val);
      }
      sql = `UPDATE \`${tableName}\` SET ${setClauses.join(', ')} WHERE ${clause}`;
      params.unshift(...updateParams); // Prepended before WHERE params
    }

    const [rows] = await pool.query(sql, params);

    // Handle count return type
    if (this.type === 'countDocuments') {
      return rows[0].count;
    }

    if (this.type === 'deleteMany' || this.type === 'deleteOne') {
      return { deletedCount: rows.affectedRows };
    }

    if (this.type === 'updateMany') {
      return { modifiedCount: rows.affectedRows };
    }

    // Convert rows to documents
    let docs = rows.map(row => new Document(this.modelClass, row, false));

    // Handle populate chains
    if (docs.length > 0 && this.populatePaths.length > 0) {
      for (let pop of this.populatePaths) {
        const refField = pop.path; // e.g. 'category' or 'instructor'
        const refModelName = this.modelClass.schema.definition[refField]?.ref || 
                             this.modelClass.schema.definition[refField]?.type?.ref;

        if (!refModelName) continue;

        const refModel = modelsRegistry[refModelName];
        if (!refModel) continue;

        // Extract referenced keys
        const idsToFetch = [...new Set(docs.map(d => d[refField]).filter(Boolean))];
        if (idsToFetch.length === 0) continue;

        // Fetch referenced items
        const selectFields = pop.selectFields;
        const columns = selectFields ? selectFields.split(/\s+/).map(c => c === '_id' ? 'id' : c).filter(Boolean) : [];
        const selectClause = columns.length > 0 ? columns.map(c => `\`${c}\``).join(', ') : '*';
        
        const placeholders = idsToFetch.map(() => '?').join(', ');
        const popSql = `SELECT id, ${selectClause === '*' ? '*' : selectClause} FROM \`${refModel.tableName}\` WHERE \`id\` IN (${placeholders})`;
        const [refRows] = await pool.query(popSql, idsToFetch);

        const refDocsMap = {};
        refRows.forEach(row => {
          refDocsMap[row.id] = new Document(refModel, row, false);
        });

        // Map them back to the original documents
        docs.forEach(doc => {
          const refId = doc[refField];
          if (refId) {
            doc[refField] = refDocsMap[refId] || null;
          }
        });
      }
    }

    if (this.type === 'findOne') {
      return docs[0] || null;
    }

    return docs;
  }

  // Make Query compatible with direct await
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.execute().catch(onRejected);
  }
}

// Generator to build Model classes
const createModel = (modelName, schema) => {
  const tableName = getTableName(modelName);

  class Model {
    constructor(data = {}) {
      return new Document(Model, data, true);
    }

    static get tableName() {
      return tableName;
    }

    static get schema() {
      return schema;
    }

    static get modelName() {
      return modelName;
    }

    // CRUD Queries
    static find(queryObj = {}) {
      return new Query(Model, 'find', queryObj);
    }

    static findOne(queryObj = {}) {
      return new Query(Model, 'findOne', queryObj);
    }

    static findById(id) {
      if (!id) return new Query(Model, 'findOne', { id: null });
      return new Query(Model, 'findOne', { id });
    }

    static async create(data) {
      const doc = new Document(Model, data, true);
      return await doc.save();
    }

    static findByIdAndUpdate(id, updateData, options = {}) {
      return {
        then: async (resolve, reject) => {
          try {
            const { clause, params } = buildWhereClause({ id });
            const setClauses = [];
            const values = [];

            for (let key of Object.keys(updateData)) {
              if (key === 'id' || key === '_id') continue;
              setClauses.push(`\`${key}\` = ?`);
              let val = updateData[key];
              val = prepareDatabaseValue(val);
              values.push(val);
            }

            if (setClauses.length > 0) {
              const sql = `UPDATE \`${tableName}\` SET ${setClauses.join(', ')} WHERE ${clause}`;
              values.push(...params);
              await pool.query(sql, values);
            }

            // Fetch the updated doc
            const updated = await Model.findById(id);
            resolve(updated);
          } catch (err) {
            reject(err);
          }
        }
      };
    }

    static async findByIdAndDelete(id) {
      const { clause, params } = buildWhereClause({ id });
      const sql = `DELETE FROM \`${tableName}\` WHERE ${clause}`;
      const [result] = await pool.query(sql, params);
      return { deletedCount: result.affectedRows };
    }

    static deleteOne(queryObj = {}) {
      return new Query(Model, 'deleteOne', queryObj);
    }

    static deleteMany(queryObj = {}) {
      return new Query(Model, 'deleteMany', queryObj);
    }

    static countDocuments(queryObj = {}) {
      return new Query(Model, 'countDocuments', queryObj);
    }

    static updateMany(queryObj, updateData) {
      const q = new Query(Model, 'updateMany', queryObj);
      q.updateData = updateData;
      return q;
    }
  }

  modelsRegistry[modelName] = Model;
  return Model;
};

// Exporting the Mock Mongoose Package API
module.exports = {
  connect,
  query: async (sql, params) => {
    if (!pool) await connect();
    return await pool.query(sql, params);
  },
  Schema,
  model: (name, schema) => {
    if (modelsRegistry[name]) return modelsRegistry[name];
    return createModel(name, schema);
  },
  Types: {
    ObjectId: String, // String representation for id compatibility
    Mixed: Object,
  },
};
