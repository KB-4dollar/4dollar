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
    // 추가 대시보드 - 목표 소비 금액 설정 추가 함수 -> goalAmount 필드값을 새로 넣어줌
    updateGoalAmount(amount) {
      if (this.user) {
        // 기존 user 객체에 goalAmount 속성이 없어도 동적으로 추가됩니다.
        this.user.goalAmount = amount;
      }
    }
  },
  persist: true,
});
