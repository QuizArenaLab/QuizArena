export class ApiController {
  public route(path: string, method: string, payload: any): any {
    return { path, method, payload };
  }
}
