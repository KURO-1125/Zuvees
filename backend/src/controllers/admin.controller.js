const Order = require('../models/order.model');
const User = require('../models/user.model');
const ApprovedEmail = require('../models/approvedEmail.model');


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('rider', 'name email')
      .populate('items.product', 'name')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, riderId } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'undelivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    

    if (status === 'shipped') {
      if (!riderId) {
        return res.status(400).json({
          success: false,
          message: 'Rider ID is required when status is set to shipped'
        });
      }
      
      const rider = await User.findById(riderId);
      
      if (!rider || rider.role !== 'rider') {
        return res.status(404).json({
          success: false,
          message: 'Rider not found'
        });
      }
      
      order.rider = riderId;
    }
    
    order.status = status;
    order.updatedAt = Date.now();
    
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Order or rider not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('name email');
    
    res.status(200).json({
      success: true,
      count: riders.length,
      data: riders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.addApprovedEmail = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Validate role
    const validRoles = ['customer', 'admin', 'rider'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }
    
    const approvedEmail = await ApprovedEmail.create({
      email,
      role
    });
    
    res.status(201).json({
      success: true,
      data: approvedEmail
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};