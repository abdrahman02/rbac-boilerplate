export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
