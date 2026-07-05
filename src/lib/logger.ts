export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

export interface LogContext {
  userId?: string;
  action?: string;
  category?: string;
  correlationId?: string;
  workflowId?: string;
  [key: string]: any;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error
        ? {
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            name: error.name,
          }
        : undefined,
    };

    return JSON.stringify(logEntry);
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(this.formatMessage(LogLevel.ERROR, message, context, err));
  }

  fatal(message: string, error?: Error | unknown, context?: LogContext) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(this.formatMessage(LogLevel.FATAL, message, context, err));
    // In a real production system, this would also trigger PagerDuty/AlertManager
  }
}

export const logger = new Logger();
