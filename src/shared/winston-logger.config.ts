import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const loggerOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.Http({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      level: 'error',
      filename: './logs/errors.log',
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: './logs/exceptions.log',
      maxsize: 5242880,
    }),
  ],
  exitOnError: false,
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level}] --> ${info.message}`;
    }),
  ),
};
