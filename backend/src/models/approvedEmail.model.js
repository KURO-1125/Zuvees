const mongoose = require('mongoose');

const approvedEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role:{
        type: String,
        enum: ['admin', 'rider', 'customer'],
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ApprovedEmail = mongoose.model('ApprovedEmail', approvedEmailSchema);
module.exports = ApprovedEmail;