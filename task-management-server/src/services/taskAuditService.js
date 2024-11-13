const pool = require('../database/connection');

exports.createTaskAudit = async (taskId, changeType, userId, taskDetails) => {
    const query = 'INSERT INTO task_audits (task_id, change_type, user_id, task_details) VALUES ($1, $2, $3, $4) RETURNING *;';
    const values = [taskId, changeType, userId, JSON.stringify(taskDetails)];
    const result = await pool.query(query, values);
    return result.rows[0];
};

exports.getTaskAuditsById = async (taskId) => {
    const query = "SELECT task_audits.*, users.name as user_name, ls.name as log_name FROM task_audits LEFT OUTER JOIN users ON task_audits.user_id = users.id LEFT OUTER JOIN users ls ON (task_audits.task_details->>'assign_user_id')::INTEGER = ls.id WHERE task_id = $1 ORDER BY created_at DESC";
    const values = [taskId];
    const result = await pool.query(query, values);
    return result.rows;
};
