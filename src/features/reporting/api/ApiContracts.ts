export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}

export interface ApiRequest {
  headers: Record<string, string>;
  body: any;
  query: Record<string, string>;
}
