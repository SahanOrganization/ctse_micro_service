import { PrismaClient } from '@prisma/client';
import Logger from '../../util/Logger';
import BadRequestError from '../../error/bad-request.error';
import NotFoundError from '../../error/not-found.error';

class ProductService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createProduct(productData) {
        Logger.info('[ProductService]: createProduct service invoked');

        if (productData === null || productData === '') {
            Logger.error(
                '[ProductService]: Unable to create product. Missing or invalid product data provided'
            );
            throw new BadRequestError(
                'Unable to create product. Please provide valid product data'
            );
        }

        const product = await this.prisma.product.create({
            data: {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                stockCount: productData.stockCount,
                image: productData.image,
                category: productData.category,
            },
        });

        Logger.info(
            `[ProductService]: Product creation for the product id:${product.id} successful`
        );
        return product;
    }

    async getProduct(productId) {
        Logger.info('[ProductService]: getProduct service invoked');

        if (productId === null || productId === '') {
            Logger.error(
                '[ProductService]: Unable to retrieve product. Missing product id'
            );
            throw new BadRequestError(
                'Unable to retrieve product. Please provide a valid product id'
            );
        }

        const product = await this.prisma.product.findFirst({
            where: { id: productId },
        });

        if (product === null) {
            Logger.error(
                `[ProductService]: Could not find a product with id:${productId}`
            );
            throw new NotFoundError(
                'Product not found. Please provide a valid product id'
            );
        }

        Logger.info(
            `[ProductService]: Data retrieval for the product id:${productId} successful`
        );
        return product;
    }

    async getProducts() {
        Logger.info('[ProductService]: getProducts service invoked');

        const products = await this.prisma.product.findMany();

        Logger.info(
            `[ProductService]: Data retrieval for the products successful. Total products found:${products.length}`
        );
        return products;
    }
}

export default ProductService;
