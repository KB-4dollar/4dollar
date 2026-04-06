/**
 * 회원 인증 관련 서비스 (F-00)
 */
export const authService = {
  /**
   * 회원가입 (F-00)
   * @param {Object} userData - 이름, 이메일, 비밀번호
   */
  async register(userData) {
    // TODO: 회원가입 API 호출 로직 구현
    // return await apiClient.post('/register', userData);
  },

  /**
   * 로그인 (F-00-1, F-00-2)
   * @param {Object} credentials - 이메일, 비밀번호
   */
  async login(credentials) {
    // TODO: 로그인 API 호출 및 JWT 토큰 브라우저 저장 로직 구현
  },

  /**
   * 로그아웃 (F-00-3)
   */
  logout() {
    // TODO: 저장된 토큰 파기 및 세션 종료 로직 구현
  }
};