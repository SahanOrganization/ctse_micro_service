import express from 'express';
import ProductController from './product.controller';

const productRouter = express.Router();
const productController = new ProductController();

productRouter.post(
    '/',
    productController.createProduct.bind(productController)
);
productRouter.get('/', productController.getProduct.bind(productController));
productRouter.get(
    '/all',
    productController.getProducts.bind(productController)
);

export default productRouter;
