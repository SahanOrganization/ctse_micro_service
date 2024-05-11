import ProductController from './product.controller';
import ProductService from './product.service';

jest.mock('./product.service');
jest.mock('../../util/Logger');

describe('ProductController', () => {
    let productController;
    let productServiceMock;
    let req;
    let res;
    let next;

    beforeEach(() => {
        productServiceMock = new ProductService();
        productController = new ProductController();
        productController.productService = productServiceMock;

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

    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const productData = { name: 'Test Product' };
            const createdProduct = { id: 1, ...productData };
            productServiceMock.createProduct.mockResolvedValue(createdProduct);

            await productController.createProduct(req, res, next);

            expect(productServiceMock.createProduct).toHaveBeenCalledWith(
                req.body
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: createdProduct });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and pass them to the next middleware', async () => {
            const error = new Error('Failed to create product');
            productServiceMock.createProduct.mockRejectedValue(error);

            await productController.createProduct(req, res, next);

            expect(productServiceMock.createProduct).toHaveBeenCalledWith(
                req.body
            );
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getProduct', () => {
        it('should retrieve a product successfully', async () => {
            const productId = 1;
            const product = { id: productId, name: 'Test Product' };
            req.body.id = productId;
            productServiceMock.getProduct.mockResolvedValue(product);

            await productController.getProduct(req, res, next);

            expect(productServiceMock.getProduct).toHaveBeenCalledWith(
                productId
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ product });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and pass them to the next middleware', async () => {
            const error = new Error('Failed to retrieve product');
            productServiceMock.getProduct.mockRejectedValue(error);

            await productController.getProduct(req, res, next);

            expect(productServiceMock.getProduct).toHaveBeenCalledWith(
                req.body.id
            );
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getProducts', () => {
        it('should retrieve all products successfully', async () => {
            const products = [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
            ];
            productServiceMock.getProducts.mockResolvedValue(products);

            await productController.getProducts(req, res, next);

            expect(productServiceMock.getProducts).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ products });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and pass them to the next middleware', async () => {
            const error = new Error('Failed to retrieve products');
            productServiceMock.getProducts.mockRejectedValue(error);

            await productController.getProducts(req, res, next);

            expect(productServiceMock.getProducts).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
