export type ServiceResult<T> = { status?: number } & (
  | {
      error: string;
      data: null;
    }
  | {
      error: null;
      data: T;
    }
);
