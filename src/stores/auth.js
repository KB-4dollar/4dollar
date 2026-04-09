// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 현재 로그인 여부
    isLogin: false,
    // 로그인한 사용자 정보
    user: null,
  }),
  actions: {
    login(user) {
      // 로그인 성공 시 사용자 정보와 로그인 상태 저장
      this.isLogin = true;
      this.user = user;
    },
    logout() {
      // 로그아웃 시 인증 상태와 사용자 정보 초기화
      this.isLogin = false;
      this.user = null;
    },
  },
  persist: true,
});
