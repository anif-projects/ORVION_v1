const auditRepo = require('../repositories/auditRepo');

const auditLog = (actionName) => {
  return (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode < 400 && req.user) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const agent = req.headers['user-agent'];
        auditRepo.logAction(req.user._id, actionName, ip, agent, {
          method: req.method,
          url: req.originalUrl,
          body: req.body,
        }).catch((err) => console.error('Audit log failed:', err));
      }
    });
    next();
  };
};

module.exports = { auditLog };
