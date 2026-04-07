export class AppError extends Error {
  constructor(errorInfo) {
    super(errorInfo.msg);
    this.name = 'AppError';
    this.code = errorInfo.code;
  }
}
