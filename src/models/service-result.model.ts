export type ServiceResult<T> =
  | {
      error: string;
    }
  | {
      data: T;
    };
