import express from 'express';
import AuthController from './auth.controller';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post('/', authController.getToken.bind(authController));

export default authRouter;
