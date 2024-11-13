const express = require('express');
const taskController = require('../controllers/taskController');
const taskAuditController = require('../controllers/taskAuditController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/getTasks', authMiddleware, taskController.getTasks);
router.post('/addTask', authMiddleware, taskController.createTask);
router.put('/updateTask/:id', authMiddleware, taskController.updateTask);
router.delete('/deleteTask/:id', authMiddleware, taskController.deleteTask);

router.get('/audit/:id', authMiddleware, taskAuditController.getTaskAuditsById);

module.exports = router;
