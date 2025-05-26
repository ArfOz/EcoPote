import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Prisma } from '@prisma/client';
import { generateTraceId } from '@utils';
import { LogLevel } from '@shared/dtos'; // Adjust the import path based on your project structure

@Injectable()
export class LogsDatabaseService {
  private minLevel!: number;
  private readonly levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  };

  // Default service name
  private service = 'default-service';

  constructor(private prisma: PrismaService) {
    // Default to 'info' log level
    this.setLogLevel('info');
  }

  /**
   * Set the minimum log level dynamically
   * @param level The log level to set
   */
  setLogLevel(level: LogLevel): void {
    this.minLevel = this.levels[level] ?? this.levels['info'];
  }

  /**
   * Get the current log level
   */
  getLogLevel(): LogLevel {
    const levelEntry = Object.entries(this.levels).find(
      ([, value]) => value === this.minLevel
    );
    return (levelEntry?.[0] as LogLevel) || 'info';
  }

  /**
   * Set the service name
   * @param serviceName The service name to set
   */
  setServiceName(serviceName: string): void {
    this.service = serviceName;
  }

  async log(message: string, context?: string, metadata?: any): Promise<void> {
    if (this.levels.info < this.minLevel) return;
    await this.writeLog('INFO', message, context, metadata);
  }

  async warn(message: string, context?: string, metadata?: any): Promise<void> {
    if (this.levels.warn < this.minLevel) return;
    await this.writeLog('WARN', message, context, metadata);
  }

  async error(
    message: string,
    context?: string,
    metadata?: any
  ): Promise<void> {
    if (this.levels.error < this.minLevel) return;
    await this.writeLog('ERROR', message, context, metadata);
  }

  async debug(
    message: string,
    context?: string,
    metadata?: any
  ): Promise<void> {
    if (this.levels.debug < this.minLevel) return;
    await this.writeLog('DEBUG', message, context, metadata);
  }

  private async writeLog(
    level: string,
    message: string,
    context?: string,
    metadata?: any
  ): Promise<void> {
    try {
      // Generate a unique trace ID
      const traceId = generateTraceId();

      // Store in database
      await this.prisma.log.create({
        data: {
          level,
          message,
          context,
          metadata: metadata ? JSON.stringify(metadata) : Prisma.JsonNull,
          service: this.service,
          traceId,
          timestamp: new Date(),
        },
      });
    } catch (error: unknown) {
      console.error(
        'Failed to write log to PostgreSQL',
        error instanceof Error ? error.message : error
      );
    }
  }

  /**
   * Batch log multiple messages at once for better performance
   */
  async batchLog(
    logs: Array<{
      level: LogLevel;
      message: string;
      context?: string;
      metadata?: any;
      service?: string; // Optional service name
    }>
  ): Promise<void> {
    try {
      // Filter logs based on minimum log level
      const filteredLogs = logs.filter(
        (log) =>
          this.levels[log.level as keyof typeof this.levels] >= this.minLevel
      );

      if (filteredLogs.length === 0) return;

      // Create data array for prisma createMany
      const data = filteredLogs.map((log) => {
        const traceId = generateTraceId();
        const service = log.service || this.service; // Use the instance's service name
        return {
          level: log.level.toUpperCase(),
          message: log.message,
          context: log.context,
          metadata: log.metadata
            ? JSON.stringify(log.metadata)
            : Prisma.JsonNull,
          service,
          traceId,
          timestamp: new Date(),
        };
      });

      // Batch insert logs
      await this.prisma.log.createMany({
        data,
      });
    } catch (error: unknown) {
      console.error(
        'Failed to batch write logs to PostgreSQL',
        error instanceof Error ? error.message : error
      );
    }
  }

  /**
   * Clean up old logs to prevent database from growing too large
   * @param days Number of days of logs to keep
   */
  async cleanupOldLogs(days = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const result = await this.prisma.log.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      console.log(`Cleaned up ${result.count} old log entries`);
      return result.count;
    } catch (error: unknown) {
      console.error(
        'Failed to clean up old logs',
        error instanceof Error ? error.message : error
      );
      return 0;
    }
  }
}
