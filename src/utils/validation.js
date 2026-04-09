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

const MAX_AMOUNT = 999999999;
const MAX_MEMO_LENGTH = 100;

export function validateTransactionForm({ type, amount, date, category, memo }) {
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
  } else if (numericAmount > MAX_AMOUNT) {
    errors.amount = '금액은 10억원 미만이어야 합니다.';
  }

  if (!String(date ?? '').trim()) {
    errors.date = ErrorCode.REQUIRED.msg;
  }

  if (type === 'expense' && !String(category ?? '').trim()) {
    errors.category = ErrorCode.REQUIRED.msg;
  }

  if (memo && String(memo).length > MAX_MEMO_LENGTH) {
    errors.memo = `메모는 ${MAX_MEMO_LENGTH}자 이하여야 합니다.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
