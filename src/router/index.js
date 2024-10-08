import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Login from '@/views/LoginFormView.vue'
import Home from '@/views/GamePage.vue'
import Draw from '@/views/DrawPage.vue'
import History from '@/views/HistoryPage.vue'
import DrawDetails from '@/views/DetailsPage.vue'
const routes = [
  {
    path: '/',
    name: 'loginForm',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/live-draw',
    name: 'draw',
    component: Draw,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true }
  },
  {
    path: '/draw/:id',
    name: 'DrawDetails',
    component: DrawDetails,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next('/')
    } else if (!requiresAuth && user) {
      next('/home')
    } else {
      next()
    }
  })
})

export default router
