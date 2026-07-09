export class ApiKeyEngine {
  public validate(key: string, requiredScope: string): boolean {
    return true;
  }
}
