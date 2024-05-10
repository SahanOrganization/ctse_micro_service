import express from 'express';
import CategoryController from './category.controller';

const categoryRouter = express.Router();
const categoryController = new CategoryController();

categoryRouter.post(
    '/',
    categoryController.createCategory.bind(categoryController)
);
categoryRouter.get(
    '/',
    categoryController.getCategory.bind(categoryController)
);
categoryRouter.get(
    '/all',
    categoryController.getCategories.bind(categoryController)
);
categoryRouter.post(
    '/addProduct',
    categoryController.addProductsToCategory.bind(categoryController)
);

export default categoryRouter;
