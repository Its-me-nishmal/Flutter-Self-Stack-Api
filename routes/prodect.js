import express from 'express';
import productController from '../controllers/prodect.js';

const router = express.Router();

router.get('/:id', productController.productGet);
router.get('/', productController.productGetAll);
router.delete('/:id', productController.productDelete);
router.delete('/', productController.productDeleteAll);
router.post('/', productController.productCreate);
router.put('/:id', productController.productUpdate);
router.post('/multiple', productController.productCreateMultiple);
router.put('/multiple', productController.productUpdateMultiple);
router.post('/search', productController.productSearch)

export default router;
