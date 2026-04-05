import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import NotFound from '@/components/Common/NotFound.vue';
import Dashboard from '@/components/Dashboard/dashboard.vue';

import Layout from '@/components/Common/Layout.vue';
import Login from '@/components/Auth/Login.vue';

const publicRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

/**본인 담당 라우터 추가 */
const authRoutes = []; //로그인, 회원가입
const userRoutes = [];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...authRoutes, ...userRoutes],
});

//네비게이션 가드
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.checked) {
    await authStore.checkAuth();
  }

  if (to.meta.requiresAuth && !authStore.isLogin) {
    return '/login';
  }

  if (to.meta.guestOnly && authStore.isLogin) {
    return '/';
  }
});
export default router;
