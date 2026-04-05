// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 현재 로그인 여부
    isLogin: false,
    // 앱 시작 시 인증 체크를 한 번이라도 끝냈는지 여부
    checked: false,
    // 로그인한 사용자 정보
    user: null,
  }),
  actions: {
    async checkAuth() {
      // 새로고침 후에도 로그인 상태를 유지할 수 있도록 localStorage에서 토큰 확인
      const token = localStorage.getItem('token');
      this.isLogin = !!token;
      // 라우터 가드가 중복 체크하지 않도록 검사 완료 표시
      this.checked = true;
    },
    login(user) {
      // 로그인 성공 시 사용자 정보와 로그인 상태 저장
      this.isLogin = true;
      this.user = user;
      // 실제 구현시 서버에서 받은 access token 등을 저장
      localStorage.setItem('token', 'sample-token');
    },
    logout() {
      // 로그아웃 시 인증 상태와 사용자 정보 초기화
      this.isLogin = false;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});
