export interface ErrorResponseApp {
  timestamp: string;
  status: number;
  error: string;
  method: string;
  path: string;
  fieldErrors: Record<string, string>;
  message: string;
}
