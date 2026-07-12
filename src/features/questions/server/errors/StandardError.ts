export class StandardError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends StandardError {
  constructor(message: string = "Validation failed", details?: any) {
    super(message, 400, details);
  }
}

export class NotFoundError extends StandardError {
  constructor(message: string = "Resource not found", details?: any) {
    super(message, 404, details);
  }
}

export class ConflictError extends StandardError {
  constructor(message: string = "Resource conflict", details?: any) {
    super(message, 409, details);
  }
}

export class AuthorizationError extends StandardError {
  constructor(message: string = "Unauthorized access", details?: any) {
    super(message, 403, details);
  }
}

export class BusinessRuleError extends StandardError {
  constructor(message: string = "Business rule violation", details?: any) {
    super(message, 422, details);
  }
}

export class InternalServerError extends StandardError {
  constructor(message: string = "Internal server error", details?: any) {
    super(message, 500, details);
  }
}
