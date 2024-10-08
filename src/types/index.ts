export type FieldError = {
  message: string | null;
  field: string | null;
};

export type ErrorResult = {
  errorsMessages: Array<FieldError> | null;
};
