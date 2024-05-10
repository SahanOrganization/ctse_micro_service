import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customLogFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} : ${level.toUpperCase()} : ${message}`;
});

const Logger = winston.createLogger({
    format: combine(timestamp(), customLogFormat, colorize()),
    transports: [
        new winston.transports.File({
            filename: 'logs.log',
        }),
        new winston.transports.File({
            filename: 'error_logs.log',
            level: 'error',
        }),
        new winston.transports.Console(),
    ],
});

export default Logger;
