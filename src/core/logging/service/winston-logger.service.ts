import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { context, trace } from '@opentelemetry/api';
import chalk from 'chalk';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const env = this.configService.get<string>('app.env') ?? 'local';
    const logLevel = this.configService.get<string>('log.level') ?? 'info';

    const jsonFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const span = trace.getSpan(context.active());
        const traceId = span?.spanContext().traceId ?? null;
        const spanId = span?.spanContext().spanId ?? null;

        return JSON.stringify({
          timestamp,
          level,
          message,
          traceId,
          spanId,
          ...meta,
        });
      }),
    );

    interface LogInfo extends winston.Logform.TransformableInfo {
      level: string;
      message: string;
      timestamp: string;
      context?: string;
      ms?: string;
    }

    const consoleFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'MM/DD/YYYY, h:mm:ss A',
      }),
      winston.format.colorize({ all: true }),
      winston.format.errors({ stack: true }),
      winston.format.ms(),
      winston.format.printf((info: LogInfo) => {
        const {
          level,
          message,
          timestamp,
          context: ctx = 'Application',
          ms,
        } = info;

        const span = trace.getSpan(context.active());
        const traceId = span?.spanContext().traceId ?? 'N/A';
        const spanId = span?.spanContext().spanId ?? 'N/A';
        const pid = chalk.green(process.pid);

        // Align log levels (NestJS uses padding up to VERBOSE = 7 chars)
        const levelMap: Record<string, string> = {
          error: 'ERROR',
          warn: ' WARN',
          log: '  LOG',
          debug: 'DEBUG',
        };
        const formattedLevel = levelMap[level]
          ? chalk.green(level.toUpperCase().padStart(4))
          : chalk.green(levelMap['log']);

        // Append execution time like +9ms if available
        const timeSuffix = chalk.yellow(ms ? ` ${ms}` : '');

        // Colorize context only (like NestJS does, usually yellow)
        const contextLabel = chalk.yellow(`[${ctx}]`);

        return `${chalk.green('[Nest]')} ${pid}  - ${timestamp}   ${formattedLevel} ${contextLabel} ${message}${timeSuffix} (traceId=${traceId}, spanId=${spanId})`;
      }),
    );

    this.logger = winston.createLogger({
      level: logLevel,
      format: env !== 'local' ? jsonFormat : consoleFormat,
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error'],
        }),
      ],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug?(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose?(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }
}
