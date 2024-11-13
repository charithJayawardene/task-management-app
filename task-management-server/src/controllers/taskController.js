const taskService = require('../services/taskService');
const taskAuditService = require('../services/taskAuditService');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve tasks', error });
    }
};

exports.createTask = async (req, res) => {
    const userId = req.user.userId;
    const { title, description, status, priority, dueDate, assignUserId } = req.body;

    try {
        const newTask = await taskService.createTask(title, description, status, priority, dueDate, assignUserId);

        await taskAuditService.createTaskAudit(newTask.id, 'CREATE', userId, newTask);

        res.status(201).json({
            message: 'Task created successfully',
            task: newTask
        });
    } catch (error) {
        console.error('Error adding task', error);
        res.status(500).json({ message: 'Error creating task', error });
    }
};

exports.updateTask = async (req, res) => {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate, assignUserId } = req.body;

    try {
        const updatedTask = await taskService.updateTask(title, description, status, priority, dueDate, assignUserId, taskId);

        await taskAuditService.createTaskAudit(updatedTask.id, 'EDIT', userId, updatedTask);

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task', error);
        res.status(500).json({ message: 'Error updating task', error });
    }
};

exports.deleteTask = async (req, res) => {
    const userId = req.user.userId;
    const taskId = req.params.id;

    try {
        const result = await taskService.deleteTask(taskId)

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const deletedTask = result.rows[0];

        if (deletedTask) {
            await taskAuditService.createTaskAudit(deletedTask.id, 'DELETE', userId, deletedTask);
        }

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task', error });
    }
};