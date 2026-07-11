import { ValidationAdapter, ValidationResult } from "./ValidationAdapter";

export class ValidationEngine {
  private adapter: ValidationAdapter;

  constructor(adapter: ValidationAdapter) {
    this.adapter = adapter;
  }

  async validate(data: unknown, schema: any): Promise<ValidationResult> {
    return this.adapter.validate(data, schema);
  }

  validateSync(data: unknown, schema: any): ValidationResult {
    return this.adapter.validateSync(data, schema);
  }
}
