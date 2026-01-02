// Generic success response wrapper
export interface GenericResponseDto<T = any> {
  data: T;
}

// Error/Exception response
export interface ExceptionDto {
  message: string;
  code: number;
}
