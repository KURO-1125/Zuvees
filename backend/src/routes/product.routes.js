const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getProducts,
  getProduct,
  createProduct
} = require('../controllers/product.controller');


router.get('/', getProducts);
router.get('/:id', getProduct);


router.post('/', protect, authorize('admin'), createProduct);

module.exports = router;