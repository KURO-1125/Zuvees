const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getRiderOrders,
  updateOrderStatus
} = require('../controllers/rider.controller');


router.use(protect);
router.use(authorize('rider'));

router.get('/orders', getRiderOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;