class AuditRepository {
  async logAction(userId, action, ipAddress, userAgent, details = {}) {
    // No-op since audit logs table was deleted.
    return { success: true };
  }

  async getRecentLogs(limit = 20) {
    return [];
  }
}

module.exports = new AuditRepository();
