import { PrismaClient } from '@prisma/client';
import CategoryService from './category.service';
import BadRequestError from '../../error/bad-request.error';
import NotFoundError from '../../error/not-found.error';

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        category: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
        },
        product: {
            findMany: jest.fn(),
            update: jest.fn(),
        },
    })),
}));

describe('CategoryService', () => {
    let categoryService;
    let prismaMock;

    beforeEach(() => {
        prismaMock = {
            category: {
                create: jest.fn(),
                findFirst: jest.fn(),
                findMany: jest.fn(),
            },
            product: {
                findMany: jest.fn(),
                update: jest.fn(),
            },
        };
        PrismaClient.mockReturnValue(prismaMock);
        categoryService = new CategoryService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        it('should create a category successfully', async () => {
            const categoryData = {
                name: 'Test Category',
                description: 'Test Description',
                products: [],
            };
            prismaMock.category.create.mockResolvedValue(categoryData);

            const result = await categoryService.createCategory(categoryData);

            expect(prismaMock.category.create).toHaveBeenCalledWith({
                data: {
                    name: categoryData.name,
                    description: categoryData.description,
                    products: categoryData.products,
                },
            });
            expect(result).toEqual(categoryData);
        });

        it('should throw a BadRequestError if category data is missing or invalid', async () => {
            await expect(categoryService.createCategory(null)).rejects.toThrow(
                BadRequestError
            );
            await expect(categoryService.createCategory('')).rejects.toThrow(
                BadRequestError
            );
        });
    });

    describe('getCategory', () => {
        it('should retrieve a category successfully', async () => {
            const categoryId = 1;
            const categoryData = {
                id: categoryId,
                name: 'Test Category',
                description: 'Test Description',
                products: [],
            };
            prismaMock.category.findFirst.mockResolvedValue(categoryData);

            const result = await categoryService.getCategory(categoryId);

            expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
                where: { id: categoryId },
            });
            expect(result).toEqual(categoryData);
        });

        it('should throw a BadRequestError if category id is missing', async () => {
            await expect(categoryService.getCategory(null)).rejects.toThrow(
                BadRequestError
            );
            await expect(categoryService.getCategory('')).rejects.toThrow(
                BadRequestError
            );
        });

        it('should throw a NotFoundError if category is not found', async () => {
            const categoryId = 1;
            prismaMock.category.findFirst.mockResolvedValue(null);

            await expect(
                categoryService.getCategory(categoryId)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe('getCategories', () => {
        it('should retrieve all categories successfully', async () => {
            const categoriesData = [
                {
                    id: 1,
                    name: 'Category 1',
                    description: 'Description 1',
                    products: [],
                },
                {
                    id: 2,
                    name: 'Category 2',
                    description: 'Description 2',
                    products: [],
                },
            ];
            prismaMock.category.findMany.mockResolvedValue(categoriesData);

            const result = await categoryService.getCategories();

            expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
            expect(result).toEqual(categoriesData);
        });
    });

    describe('addProductsToCategory', () => {
        it('should add products to a category successfully', async () => {
            const requestData = {
                category: 1,
                products: [1, 2],
            };
            const categoryData = {
                id: 1,
                name: 'Test Category',
                description: 'Test Description',
                products: [],
            };
            const productData = [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
            ];
            prismaMock.category.findFirst.mockResolvedValue(categoryData);
            prismaMock.product.findMany.mockResolvedValue(productData);
            prismaMock.product.update.mockResolvedValue({});

            const result =
                await categoryService.addProductsToCategory(requestData);

            expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
                where: { id: requestData.category },
            });
            expect(prismaMock.product.findMany).toHaveBeenCalledWith({
                where: { id: { in: requestData.products } },
            });
            expect(prismaMock.product.update).toHaveBeenCalledTimes(
                productData.length
            );
            expect(result.message).toBe(
                'Products added to category successfully'
            );
        });

        it('should throw a BadRequestError if category id or product ids are missing', async () => {
            await expect(
                categoryService.addProductsToCategory({
                    category: null,
                    products: [],
                })
            ).rejects.toThrow(BadRequestError);
            await expect(
                categoryService.addProductsToCategory({
                    category: 1,
                    products: null,
                })
            ).rejects.toThrow(BadRequestError);
        });

        it('should throw a NotFoundError if category is not found', async () => {
            const requestData = {
                category: 1,
                products: [1, 2],
            };
            prismaMock.category.findFirst.mockResolvedValue(null);

            await expect(
                categoryService.addProductsToCategory(requestData)
            ).rejects.toThrow(NotFoundError);
        });
    });
});
