import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import NotFound from '@/pages/NotFoundPage.vue';
import Dashboard from '@/pages/DashboardPage.vue';
import Layout from '@/layouts/DefaultLayout.vue';
import Login from '@/pages/LoginPage.vue';

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
      {
        path: '/transaction/:id',
        name: 'detail',
        component: import('../pages/TransactionDetailPage.vue'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

/**본인 담당 라우터 추가 */
const authRoutes = []; //로그인, 회원가입
const userRoutes = [];
const transactionRoutes = [
  {
    path: '/list',
    name: 'transactionList',
    component: () => import('@/pages/TransactionListPage.vue'),
    meta: { requiresAuth: false },
    // 더미 모드 활성화: API 없이 UI 테스트 시 props: { dummyMode: true } 로 변경
    props: { dummyMode: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...authRoutes, ...userRoutes, ...transactionRoutes],
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
