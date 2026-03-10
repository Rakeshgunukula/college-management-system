const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware')

Router.post('/student-login', async (req, res) => {
    const { rollno, password } = req.body;
    try {
        
        const user = await User.findOne({ rollno, role: 'student' });
        if (!user) return res.status(404).json({ msg: 'Student Not Found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey');
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// student Profile Route
Router.get('/profile', authMiddleware, roleMiddleware('student'), async (req, res) => {
    try {
        
        const student = await User.findById(req.user.id).select('-password');
        
        if (!student) {
            return res.status(404).json({ msg: 'Student record not found' });
        }

        // Student name and branch return chesthunnam
        res.json({
            name: student.name,
            branch: student.branch,
            rollno: student.rollno
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = Router;
