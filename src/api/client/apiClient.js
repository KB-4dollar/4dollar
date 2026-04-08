import axios from 'axios';
import { ErrorCode } from '@/api/constants/errorCode';
import { AppError } from '@/utils/customError';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

/**
 * 요청 interceptor (토큰)
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * 응답 interceptor (🔥 핵심)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1️⃣ 네트워크 오류
    if (!error.response) {
      return Promise.reject(new AppError(ErrorCode.NETWORK));
    }

    const status = error.response.status;
    const data = error.response.data;

    // 2️⃣ timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new AppError(ErrorCode.TIMEOUT));
    }

    // 3️⃣ 인증 에러
    if (status === 401) {
      localStorage.removeItem('token');
      return Promise.reject(new AppError(ErrorCode.SESSION_EXPIRED));
    }

    if (status === 403) {
      return Promise.reject(new AppError(ErrorCode.FORBIDDEN));
    }

    // 4️⃣ 회원가입 / 로그인 (json-server-auth)
    if (status === 400) {
      if (typeof data === 'string' && data.includes('already exists')) {
        return Promise.reject(new AppError(ErrorCode.EMAIL_EXISTS));
      }

      return Promise.reject(new AppError(ErrorCode.LOGIN_FAILED));
    }

    // 5️⃣ 기본 fallback
    return Promise.reject(new AppError(ErrorCode.UNKNOWN));
  },
);

export default apiClient;
