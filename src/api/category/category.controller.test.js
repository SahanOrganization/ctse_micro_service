import CategoryController from './category.controller';
import CategoryService from './category.service';

jest.mock('./category.service');
jest.mock('../../util/Logger');

describe('CategoryController', () => {
    let categoryController;
    let categoryServiceMock;
    let req;
    let res;
    let next;

    beforeEach(() => {
        categoryServiceMock = new CategoryService();
        categoryController = new CategoryController();
        categoryController.categoryService = categoryServiceMock;

        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        it('should create a category successfully', async () => {
            const categoryData = { name: 'Test Category' };
            const createdCategory = { id: 1, ...categoryData };
            categoryServiceMock.createCategory.mockResolvedValue(
                createdCategory
            );

            await categoryController.createCategory(req, res, next);

            expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(
                req.body
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: createdCategory });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and pass them to the next middleware', async () => {
            const error = new Error('Failed to create category');
            categoryServiceMock.createCategory.mockRejectedValue(error);

            await categoryController.createCategory(req, res, next);

            expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(
                req.body
            );
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getCategory', () => {
        it('should retrieve a category successfully', async () => {
            const categoryId = 1;
            const category = { id: categoryId, name: 'Test Category' };
            req.body.id = categoryId;
            categoryServiceMock.getCategory.mockResolvedValue(category);

            await categoryController.getCategory(req, res, next);

            expect(categoryServiceMock.getCategory).toHaveBeenCalledWith(
                categoryId
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ category });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and pass them to the next middleware', async () => {
            const error = new Error('Failed to retrieve category');
            categoryServiceMock.getCategory.mockRejectedValue(error);

            await categoryController.getCategory(req, res, next);

            expect(categoryServiceMock.getCategory).toHaveBeenCalledWith(
                req.body.id
            );
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getCategories', () => {
        it('should retrieve all categories successfully', async () => {
            const categories = [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' },
            ];
            categoryServiceMock.getCategories.mockResolvedValue(categories);

            await categoryController.getCategories(req, res, next);

            expect(categoryServiceMock.getCategories).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ categories });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and pass them to the next middleware', async () => {
            const error = new Error('Failed to retrieve categories');
            categoryServiceMock.getCategories.mockRejectedValue(error);

            await categoryController.getCategories(req, res, next);

            expect(categoryServiceMock.getCategories).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('addProductsToCategory', () => {
        it('should add products to a category successfully', async () => {
            const requestData = { category: 1, products: [1, 2] };
            const result = {
                message: 'Products added to category successfully',
            };
            categoryServiceMock.addProductsToCategory.mockResolvedValue(result);

            await categoryController.addProductsToCategory(req, res, next);

            expect(
                categoryServiceMock.addProductsToCategory
            ).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ result });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and pass them to the next middleware', async () => {
            const error = new Error('Failed to add products to category');
            categoryServiceMock.addProductsToCategory.mockRejectedValue(error);

            await categoryController.addProductsToCategory(req, res, next);

            expect(
                categoryServiceMock.addProductsToCategory
            ).toHaveBeenCalledWith(req.body);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
