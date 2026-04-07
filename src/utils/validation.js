import { ErrorCode } from '@/api/constants/errorCode';
import { AppError } from './customError';

export function validateSignup({ name, email, password, confirm }) {
  if (!name || name.length < 2 || name.length > 10) {
    throw new AppError(ErrorCode.INVALID_NAME);
  }

  if (!email.includes('@')) {
    throw new AppError(ErrorCode.INVALID_EMAIL);
  }

  if (password.length < 8) {
    throw new AppError(ErrorCode.PASSWORD_SHORT);
  }

  if (password !== confirm) {
    throw new AppError(ErrorCode.PASSWORD_MISMATCH);
  }
}
