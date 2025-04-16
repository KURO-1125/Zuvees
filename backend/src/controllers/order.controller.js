const Order = require('../models/order.model');
const Product = require('../models/product.model');


exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      
     
      const variant = product.variants.find(
        v => v.size === item.size && v.color === item.color
      );
      
      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant with size ${item.size} and color ${item.color} not found for product ${product.name}`
        });
      }
      
  
      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name} (${item.color}, ${item.size})`
        });
      }
      
      const itemTotal = variant.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: variant.price
      });
    }
    

    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'name description')
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


exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name description imageUrl')
      .populate('customer', 'name email')
      .populate('rider', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    
    if (
      req.user.role === 'customer' && 
      order.customer._id.toString() !== req.user.id &&
      req.user.role === 'rider' && 
      (!order.rider || order.rider._id.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }
    
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