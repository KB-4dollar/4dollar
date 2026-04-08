import apiClient from '../client/apiClient';
import { ErrorCode } from '@/api/constants/errorCode';
/**
 * 회원 인증 관련 서비스 (F-00)
 */
export const authService = {
  /**
   * 회원가입 (F-00)
   * @param {Object} userData - 이름, 이메일, 비밀번호
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      const serverMsg = error.response?.data?.message;

      if (serverMsg === 'Email already exists') {
        throw new Error(ErrorCode.EMAIL_EXISTS.msg);
      }

      throw new Error(ErrorCode.REGISTER_FAILED.msg);
    }
  },

  /**
   * 로그인 (F-00-1, F-00-2)
   * @param {Object} credentials - 이메일, 비밀번호
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/login', credentials);
      const { accessToken, user } = response.data;

      localStorage.setItem('token', accessToken);
      return user;
    } catch (error) {
      throw new Error(ErrorCode.LOGIN_FAILED.msg);
    }
  },

  /**
   * 로그아웃 (F-00-3)
   */
  logout() {
    // TODO: 저장된 토큰 파기 및 세션 종료 로직 구현
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // 설정 : 회원정보수정
  async updateUser(id, data) {
    try {
      const response = await apiClient.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(ErrorCode.USER_UPDATE_FAILED.msg);
    }
  },
};
