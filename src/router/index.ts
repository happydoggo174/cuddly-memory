import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/checkin/:slug',
      name: 'checkin',
      component: () => import('@/views/CheckinView.vue'),
      meta: { public: true },
    },
    {
      path: '/checkin/:slug/success',
      name: 'checkin-success',
      component: () => import('@/views/CheckinSuccessView.vue'),
      meta: { public: true },
    },

    // Admin routes
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
        { path: 'courses', name: 'courses', component: () => import('@/views/CoursesView.vue') },
        { path: 'courses/create', name: 'course-create', component: () => import('@/views/CourseFormView.vue') },
        { path: 'courses/:id/edit', name: 'course-edit', component: () => import('@/views/CourseFormView.vue') },
        { path: 'courses/:id', name: 'course-detail', component: () => import('@/views/CourseDetailView.vue') },
        { path: 'records', name: 'records', component: () => import('@/views/RecordsView.vue') },
      ],
    },

    // Fallback
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Navigation guard
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
