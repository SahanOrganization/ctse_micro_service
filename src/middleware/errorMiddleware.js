import Logger from '../util/Logger';

function errorHandler(err, req, res, next) {
    Logger.error(err.stack);

    if (err.status) {
        res.status(err.status).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default errorHandler;
