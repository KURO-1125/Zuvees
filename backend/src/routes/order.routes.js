const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createOrder,
  getOrders,
  getOrder
} = require('../controllers/order.controller');


router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

module.exports = router;