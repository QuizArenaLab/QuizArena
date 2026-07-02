export type Lifecycle = 'Singleton' | 'Scoped' | 'Transient';

interface Registration {
  token: string;
  factory: () => any;
  lifecycle: Lifecycle;
  instance?: any;
}

export class Container {
  private static instance: Container;
  private registrations: Map<string, Registration> = new Map();

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(token: string, factory: () => T, lifecycle: Lifecycle = 'Singleton'): void {
    this.registrations.set(token, { token, factory, lifecycle });
  }

  public resolve<T>(token: string): T {
    const reg = this.registrations.get(token);
    if (!reg) throw new Error(`Token ${token} not registered in container.`);

    if (reg.lifecycle === 'Singleton') {
      if (!reg.instance) reg.instance = reg.factory();
      return reg.instance;
    }
    
    if (reg.lifecycle === 'Scoped') {
      // Scoped would typically tie to a request/context. For simplicity, we treat it similarly to transient or placeholder here.
      return reg.factory();
    }

    return reg.factory(); // Transient
  }
}
