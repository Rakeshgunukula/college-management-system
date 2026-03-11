const express = require('express')
const mongoose = require('mongoose')
const dotEnv = require('dotenv')
const path = require('path')
const cors = require('cors')
const manualAdmin = require('./seed')
const adminRoutes = require('./routes/adminRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const studentRoutes = require('./routes/studentRoutes')
dotEnv.config()

const app = express()

// app.get('/', (req,res) => {
//     res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
// })
app.use(cors())
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
})
app.get('/admin-dashboard', (req,res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'admin.html'));
});

app.get('/teacher-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'teacher.html'));
});

app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'students.html'));
})

// animation route

app.get('/status', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'status.html'));
})
app.use(express.json())
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes)
app.use('/api/student', studentRoutes)


    mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.log('Error on Connecting MongoDB');
    });

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Server is Running at ${PORT}`);
})
