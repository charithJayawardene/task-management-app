const pool = require('../database/connection');

exports.getTasks = async () => {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    return result.rows;
};

exports.createTask = async (title, description, status, priority, dueDate, assignUserId) => {
    const query = 'INSERT INTO tasks (title, description, status, priority, due_date, assign_user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [title, description, status, priority, dueDate, assignUserId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

exports.updateTask = async (title, description, status, priority, dueDate, assignUserId, id) => {
    const query = 'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, assign_user_id = $6 WHERE id = $7 RETURNING *';
    const values = [title, description, status, priority, dueDate, assignUserId, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

exports.deleteTask = async (taskId) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
    return result;
};
