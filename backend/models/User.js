const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        sparse:true,
        required:false
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['admin','teacher','student'],
        default:'student'
    },
    rollno:{
        type:String,
        sparse:true,
        unique:true,
    },
    branch:{
        type:String
    }

});

module.exports = mongoose.model('User', userSchema);