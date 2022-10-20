/*
 * @Author: prashant.chaudhary 
 * @Date: 2022-10-20 10:58:57 
 * @Last Modified by:   prashant.chaudhary 
 * @Last Modified time: 2022-10-20 10:58:57 
 */

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { existsSync, mkdirSync } from 'fs';
import { LoggerService } from '@nestjs/common';

//logs directory
const logDir = __dirname + '/../../logs';

if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const loggerService = () =>
  WinstonModule.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      process.env.NODE_ENV === 'development'
        ? winston.format.colorize()
        : winston.format.uncolorize(),
      winston.format.splat(),
      winston.format.printf(
        ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
      ),
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
      }),
      // debug log setting
      new winstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/debug', // log file /logs/debug/*.log in save
        filename: `%DATE%.log`,
        maxFiles: 30, // 30 Days saved
        json: false,
        zippedArchive: true,
      }),
      // error log setting
      new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/error', // log file /logs/error/*.log in save
        filename: `%DATE%.log`,
        maxFiles: 30, // 30 Days saved
        handleExceptions: true,
        json: false,
        zippedArchive: true,
      }),
    ],
  });

/**
 * Writable Stream for Morgan
 */
class Stream {
  logger = null;
  constructor(logger: LoggerService) {
    this.logger = logger;
  }
  write(message: string) {
    this.logger.log(message.substring(0, message.lastIndexOf('\n')));
  }
}

export { loggerService, Stream };