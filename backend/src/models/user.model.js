const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    googleId:{
        type: String,
        unique: true,
        sparse: true
    },
    name:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['admin', 'rider', 'customer'],
        default: 'customer'
    },
    address:{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    phoneNumber: String,
    isActive:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const user = mongoose.model('User', userSchema);
module.exports = user;