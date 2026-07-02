export class SnapshotBuilder {
  /**
   * Normalizes the snapshot payload to guarantee a deterministic hash.
   */
  public normalize(payload: any): any {
    if (payload === null || payload === undefined) {
      return payload;
    }

    if (Array.isArray(payload)) {
      // Recursively normalize array elements. 
      // Note: we don't sort arrays here unless they are intrinsically order-independent (like a set),
      // because questions/sections order matters.
      return payload.map(item => this.normalize(item));
    }

    if (typeof payload === 'object') {
      const normalizedObject: Record<string, any> = {};
      // Sort keys alphabetically to ensure deterministic object serialization
      const sortedKeys = Object.keys(payload).sort();
      
      for (const key of sortedKeys) {
        let value = payload[key];

        // Specific Normalizations
        
        // 1. Strings: trim whitespace
        if (typeof value === 'string') {
          value = value.trim();
        }
        
        // 2. Dates: convert to UTC ISO strings
        if (value instanceof Date) {
          value = value.toISOString();
        }
        
        // 3. Numbers: strip trailing decimal zeros if needed (usually handled by stringify, but good to ensure)
        if (typeof value === 'number') {
          // JS numbers are floats; JSON.stringify handles basic deterministic output, but we can enforce no -0.
          if (Object.is(value, -0)) {
            value = 0;
          }
        }

        // Recursively normalize
        normalizedObject[key] = this.normalize(value);
      }
      return normalizedObject;
    }

    return payload;
  }
}
