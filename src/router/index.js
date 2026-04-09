import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import NotFound from '@/pages/NotFoundPage.vue';
import Dashboard from '@/pages/DashboardPage.vue';
import Layout from '@/layouts/DefaultLayout.vue';
import Login from '@/pages/LoginPage.vue';
import Signup from '@/pages/SignupPage.vue';

const publicRoutes = [
  // 랜딩페이지먼저로딩
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/LandingPage.vue'),
    exact: true,
  },

  {
    path: '/app',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        // meta: { requiresAuth: false }, // 테스트를 위해 저도 false 해둘게요,,
      },
      {
        path: '/list',
        name: 'transactionList',
        component: () => import('@/pages/TransactionListPage.vue'),
        meta: { requiresAuth: false }, // 테스트를 위해 우선 false
        props: { dummyMode: false },
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/pages/SettingPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

/**본인 담당 라우터 추가 */

const userRoutes = [];
const transactionRoutes = [];

const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: { guestOnly: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...publicRoutes, ...userRoutes, ...transactionRoutes],
});

//네비게이션 가드
router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  // ✅ 더미 테스트를 위해 'transactionList'는 가드를 통과시킴
  if (to.name === 'transactionList') {
    return true;
  }

  if (to.meta.requiresAuth && !authStore.isLogin) {
    return '/login';
  }

  if (to.meta.guestOnly && authStore.isLogin) {
    return '/';
  }
});
export default router;
