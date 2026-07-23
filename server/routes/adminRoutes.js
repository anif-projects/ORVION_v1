const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');
const { auditLog } = require('../middlewares/auditMiddleware');

router.use(protect, restrictTo('admin', 'super_admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/students', adminController.getStudents);
router.patch('/students/:id/status', auditLog('UPDATE_STUDENT_STATUS'), adminController.updateStudentStatus);
router.get('/audit-logs', adminController.getAuditLogs);
router.post('/categories', auditLog('CREATE_CATEGORY'), adminController.createCategory);

module.exports = router;
