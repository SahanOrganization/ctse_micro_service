import express from 'express';
import logger from './util/Logger';
import productRouter from './api/product/product.router';
import categoryRouter from './api/category/category.router';
import errorHandler from './middleware/errorMiddleware';
import authMiddleware from './middleware/authMiddleware';
import authRouter from './api/auth/auth.router';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/auth', authRouter);
app.use(authMiddleware);
app.use(errorHandler);

app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);

app.listen(PORT, () => logger.info('Server Started'));
