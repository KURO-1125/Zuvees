const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getAllOrders,
  updateOrderStatus,
  getRiders,
  addApprovedEmail
} = require('../controllers/admin.controller');


router.use(protect);
router.use(authorize('admin'));

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/riders', getRiders);
router.post('/approved-emails', addApprovedEmail);

module.exports = router;