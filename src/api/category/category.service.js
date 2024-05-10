import { PrismaClient } from '@prisma/client';
import Logger from '../../util/Logger';
import BadRequestError from '../../error/bad-request.error';
import NotFoundError from '../../error/not-found.error';

class CategoryService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createCategory(categoryData) {
        Logger.info('[CategoryService]: createCategory service invoked');

        if (categoryData === null || categoryData === '') {
            Logger.error(
                '[CategoryService]: Unable to create category. Missing or invalid category data provided'
            );
            throw new BadRequestError(
                'Unable to create category. Please provide valid category data'
            );
        }

        const category = await this.prisma.category.create({
            data: {
                name: categoryData.name,
                description: categoryData.description,
                products: categoryData.products,
            },
        });

        Logger.info(
            `[CategoryService]: Category creation for the category id:${category.id} successful`
        );
        return category;
    }

    async getCategory(categoryId) {
        Logger.info('[CategoryService]: getCategory service invoked');

        if (categoryId === null || categoryId === '') {
            Logger.error(
                '[CategoryService]: Unable to retrieve category. Missing category id'
            );
            throw new BadRequestError(
                'Unable to retrieve category. Please provide a valid category id'
            );
        }

        const category = await this.prisma.category.findFirst({
            where: { id: categoryId },
        });

        if (category === null) {
            Logger.error(
                `[CategoryService]: Could not find a category with id:${categoryId}`
            );
            throw new NotFoundError(
                'Category not found. Please provide a valid category id'
            );
        }

        Logger.info(
            `[CategoryService]: Data retrieval for the category id:${categoryId} successful`
        );
        return category;
    }

    async getCategories() {
        Logger.info('[CategoryService]: getCategories service invoked');

        const categories = await this.prisma.category.findMany();

        Logger.info(
            `[CategoryService]: Data retrieval for the categories successful. Total categories found:${categories.length}`
        );
        return categories;
    }

    async addProductsToCategory(requestData) {
        Logger.info('[CategoryService]: addProductsToCategory service invoked');

        const { category, products } = requestData;

        if (!category || !products || products.length === 0) {
            Logger.error(
                '[CategoryService]: Unable to map products. Missing category id or product ids'
            );
            throw new BadRequestError(
                'Unable to map products. Please provide a valid category id or product ids'
            );
        }

        const categoryObj = await this.prisma.category.findFirst({
            where: { id: category },
        });

        if (!categoryObj) {
            Logger.error(
                `[CategoryService]: Could not find a category with id:${category}`
            );
            throw new NotFoundError(
                'Category not found. Please provide a valid category id'
            );
        }

        const productList = await this.prisma.product.findMany({
            where: { id: { in: products } },
        });

        const updatedProducts = await Promise.all(
            productList.map(async (product) => {
                return await this.prisma.product.update({
                    where: { id: product.id },
                    data: { category: { connect: { id: category } } },
                });
            })
        );

        Logger.info(
            `[CategoryService]: Product mapping to the category with id:${category} successful`
        );
        return {
            message: 'Products added to category successfully',
            updatedProducts,
        };
    }
}

export default CategoryService;
