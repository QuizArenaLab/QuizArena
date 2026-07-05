export abstract class PlatformError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly httpStatus: number,
    public readonly metadata?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends PlatformError {
  constructor(message: string, metadata?: any) {
    super(message, 'VALIDATION_ERROR', 400, metadata);
  }
}

export class WorkflowError extends PlatformError {
  constructor(message: string, metadata?: any) {
    super(message, 'WORKFLOW_ERROR', 409, metadata);
  }
}

export class InfrastructureError extends PlatformError {
  constructor(message: string, metadata?: any) {
    super(message, 'INFRASTRUCTURE_ERROR', 500, metadata);
  }
}

export class DomainError extends PlatformError {
  constructor(message: string, metadata?: any) {
    super(message, 'DOMAIN_ERROR', 422, metadata);
  }
}

export class IntegrationError extends PlatformError {
  constructor(message: string, metadata?: any) {
    super(message, 'INTEGRATION_ERROR', 502, metadata);
  }
}
