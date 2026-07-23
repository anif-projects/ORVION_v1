const AuditLog = require('../models/AuditLog');

class AuditRepository {
  async logAction(userId, action, ipAddress, userAgent, details = {}) {
    return await AuditLog.create({
      user: userId,
      action,
      ipAddress,
      userAgent,
      details,
    });
  }

  async getRecentLogs(limit = 20) {
    return await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new AuditRepository();
