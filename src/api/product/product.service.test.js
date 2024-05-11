import { PrismaClient } from '@prisma/client';
import ProductService from './product.service';
import BadRequestError from '../../error/bad-request.error';
import NotFoundError from '../../error/not-found.error';

jest.mock('@prisma/client');

describe('ProductService', () => {
    let productService;
    let prismaMock;

    beforeEach(() => {
        prismaMock = {
            product: {
                create: jest.fn(),
                findFirst: jest.fn(),
                findMany: jest.fn(),
            },
        };
        PrismaClient.mockReturnValue(prismaMock);
        productService = new ProductService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const productData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 9.99,
                stockCount: 10,
                image: 'test.jpg',
                category: 1,
            };
            prismaMock.product.create.mockResolvedValue(productData);

            const result = await productService.createProduct(productData);

            expect(prismaMock.product.create).toHaveBeenCalledWith({
                data: {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    stockCount: productData.stockCount,
                    image: productData.image,
                    category: productData.category,
                },
            });
            expect(result).toEqual(productData);
        });

        it('should throw a BadRequestError if product data is missing or invalid', async () => {
            await expect(productService.createProduct(null)).rejects.toThrow(
                BadRequestError
            );
            await expect(productService.createProduct('')).rejects.toThrow(
                BadRequestError
            );
        });
    });

    describe('getProduct', () => {
        it('should retrieve a product successfully', async () => {
            const productId = 1;
            const productData = {
                id: productId,
                name: 'Test Product',
                description: 'Test Description',
                price: 9.99,
                stockCount: 10,
                image: 'test.jpg',
                category: 1,
            };
            prismaMock.product.findFirst.mockResolvedValue(productData);

            const result = await productService.getProduct(productId);

            expect(prismaMock.product.findFirst).toHaveBeenCalledWith({
                where: { id: productId },
            });
            expect(result).toEqual(productData);
        });

        it('should throw a BadRequestError if product id is missing', async () => {
            await expect(productService.getProduct(null)).rejects.toThrow(
                BadRequestError
            );
            await expect(productService.getProduct('')).rejects.toThrow(
                BadRequestError
            );
        });

        it('should throw a NotFoundError if product is not found', async () => {
            const productId = 1;
            prismaMock.product.findFirst.mockResolvedValue(null);

            await expect(productService.getProduct(productId)).rejects.toThrow(
                NotFoundError
            );
        });
    });

    describe('getProducts', () => {
        it('should retrieve all products successfully', async () => {
            const productsData = [
                {
                    id: 1,
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 9.99,
                    stockCount: 10,
                    image: 'product1.jpg',
                    category: 1,
                },
                {
                    id: 2,
                    name: 'Product 2',
                    description: 'Description 2',
                    price: 19.99,
                    stockCount: 5,
                    image: 'product2.jpg',
                    category: 2,
                },
            ];
            prismaMock.product.findMany.mockResolvedValue(productsData);

            const result = await productService.getProducts();

            expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
            expect(result).toEqual(productsData);
        });
    });
});
