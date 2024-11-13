const taskAuditService = require('../services/taskAuditService');

exports.getTaskAuditsById = async (req, res) => {
    const taskId = req.params.id;

    try {
        const audits = await taskAuditService.getTaskAuditsById(taskId);

        res.status(200).json(audits);
    } catch (error) {
        console.error('Error fetching task changes', error);
        res.status(500).json({ message: 'Error fetching task changes' });
    }
};
