const pool = require('../database/connection');

exports.createUser = async (name, email, password) => {
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, email, password];
    const result = await pool.query(query, values);
    return result.rows[0];
};

exports.getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

exports.getUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};
