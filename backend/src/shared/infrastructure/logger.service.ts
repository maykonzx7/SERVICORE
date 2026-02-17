import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";

/**
 * Logger Service
 *
 * Serviço de logging estruturado.
 * Por enquanto usa o Logger do NestJS, mas pode ser facilmente
 * substituído por Winston, Pino ou outro logger.
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger = new (require("@nestjs/common").Logger)(
    LoggerService.name
  );

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }

  /**
   * Log estruturado para eventos de domínio
   */
  logDomainEvent(eventName: string, data: Record<string, any>) {
    this.logger.log(
      JSON.stringify({
        type: "domain_event",
        event: eventName,
        data,
        timestamp: new Date().toISOString(),
      })
    );
  }

  /**
   * Log estruturado para operações de negócio
   */
  logBusinessOperation(operation: string, data: Record<string, any>) {
    this.logger.log(
      JSON.stringify({
        type: "business_operation",
        operation,
        data,
        timestamp: new Date().toISOString(),
      })
    );
  }
}

