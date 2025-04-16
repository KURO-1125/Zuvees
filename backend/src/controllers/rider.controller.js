const Order = require('../models/order.model');


exports.getRiderOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      rider: req.user.id,
      status: { $in: ['shipped', 'delivered', 'undelivered'] }
    })
      .populate('customer', 'name email address phoneNumber')
      .populate('items.product', 'name description imageUrl')
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
    const { status } = req.body;
    
    
    if (status !== 'delivered' && status !== 'undelivered') {
      return res.status(400).json({
        success: false,
        message: 'Riders can only update to delivered or undelivered status'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    
    if (order.rider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    
    if (order.status !== 'shipped') {
      return res.status(400).json({
        success: false,
        message: 'Only orders in shipped status can be updated by riders'
      });
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
        message: 'Order not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};