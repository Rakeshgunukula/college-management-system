const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware')

const Router = express.Router();

// Admin Login

Router.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: 'User Not Found' });

        // Check if the user is actually an admin
        if (user.role !== 'admin') {
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

//  creating a teacher role 

Router.post('/create-teacher', authMiddleware, roleMiddleware('admin'), async(req, res) => {
    const {name, email, password} = req.body;
    const teacher = await User.findOne({email});

    if(teacher) {
       return res.status(409).json({msg:'Teacher role already created with this username'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password:hashedPassword,
        role:'teacher'
    });

    res.status(201).json({msg:'Teacher created successfully'});
    
});

// get all users 

Router.get('/all-users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        // Main Admin email kakunda migatha andarini tesuko
        const mainAdminEmail = 'admin@gmail.com'; 
        const users = await User.find({ email: { $ne: mainAdminEmail } });

        if (users.length === 0) {
            return res.status(404).json({ msg: 'No records found' });
        }

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});


// make update admin route 

Router.put('/update/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const newRole = user.role === 'admin' ? 'teacher' : 'admin';
        user.role = newRole;
        await user.save();

        res.status(200).json({ msg: `User role changed to ${newRole}` });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// make delete route 

Router.delete('/deleteuser/:id', authMiddleware, roleMiddleware('admin'), async(req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({msg:'User not found'});
        }
        res.status(200).json({msg:'User Deleted Successfully'});
    }catch(err){
        res.status(500).json({msg:'Server Error'});
    }
})


 module.exports = Router;


