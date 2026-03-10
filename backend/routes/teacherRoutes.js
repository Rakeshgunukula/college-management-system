const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware')

const Router = express.Router()
// adding teacher login

Router.post('/teacher-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: 'User Not Found' });

        // Check if the user is actually an admin
        if (user.role !== 'teacher') {
            return res.status(403).json({ msg: 'Access Denied: Not an Admin' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(403).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey');
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});


// adding student

Router.post('/add-student', authMiddleware, roleMiddleware('teacher'), async (req, res) => {
    const { name, rollno, password, branch } = req.body;
    try {
        // Roll number tho check cheyi, email tho kadu
        const existingStudent = await User.findOne({ rollno });
        if (existingStudent) {
            return res.status(400).json({ msg: 'Student with this Roll No already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new User({
            name,
            rollno,
            password: hashedPassword,
            branch,
            role: 'student'
        });

        await newStudent.save();
        res.status(201).json({ msg: 'Student Added Successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error while adding student'});
    
    }
});

Router.get('/all-students', authMiddleware, roleMiddleware('teacher'), async(req, res) => {
    try{
        const students = await User.find({role:'student'});
        if(students.length === 0) {
            return res.status(404).json({msg:'No student records found'});
        }
        res.status(200).json(students);
    }catch(err){
        res.status(500).json({msg: 'Server Error'});
    }
})


module.exports = Router;