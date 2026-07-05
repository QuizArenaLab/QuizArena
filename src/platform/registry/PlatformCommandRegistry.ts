export interface CommandSchemaDefinition {
  commandName: string;
  version: string;
  handlerDomain: string;
  schema: any; // JSON Schema for the payload
}

export class PlatformCommandRegistry {
  private schemas = new Map<string, CommandSchemaDefinition>();

  public register(schema: CommandSchemaDefinition): void {
    const key = `${schema.commandName}@${schema.version}`;
    if (this.schemas.has(key)) {
      throw new Error(`Command schema ${key} is already registered.`);
    }
    this.schemas.set(key, schema);
  }

  public get(commandName: string, version: string): CommandSchemaDefinition | undefined {
    return this.schemas.get(`${commandName}@${version}`);
  }
}
