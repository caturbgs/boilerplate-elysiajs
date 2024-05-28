export interface IResponse<T = Record<string, object>> {
  message: string;
  status: boolean;
  stack?: string;
  data?: T;
}
