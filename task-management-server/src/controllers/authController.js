const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
require('dotenv').config();

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await userService.createUser(name, email, hashedPassword);
        const token = jwt.sign({ userId: newUser.id }, 'your_jwt_secret_key', { expiresIn: '1h' });

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successfully',
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
