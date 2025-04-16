const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApprovedEmail = require('../models/approvedEmail.model');
const { generateToken } = require('../utils/jwt');

const createSendToken = (user, statusCode, res) => {
    const token = generateToken(user);
    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        },
    });
};

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res,next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({success:false,  message: info? info.message : 'Login failed' });
        }
        createSendToken(user, 200, res);
        })(req, res, next);
};


exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        res.status(200).json({ success: true, data: {user} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Testing
exports.testLogin = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const token = generateToken(user);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };