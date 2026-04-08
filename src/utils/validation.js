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

export function validateTransactionForm({ type, amount, date, category }) {
  const errors = {};
  const normalizedAmount = String(amount ?? '').trim();
  const numericAmount = Number(normalizedAmount);

  if (!type) {
    errors.type = ErrorCode.REQUIRED.msg;
  }

  if (!normalizedAmount) {
    errors.amount = ErrorCode.REQUIRED.msg;
  } else if (!Number.isInteger(numericAmount)) {
    errors.amount = ErrorCode.INVALID_AMOUNT.msg;
  } else if (numericAmount < 1) {
    errors.amount = ErrorCode.INVALID_AMOUNT_RANGE.msg;
  }

  if (!String(date ?? '').trim()) {
    errors.date = ErrorCode.REQUIRED.msg;
  }

  if (type === 'expense' && !String(category ?? '').trim()) {
    errors.category = ErrorCode.REQUIRED.msg;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
