import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/home/HomePage.vue'

const routes = [
	//*home page route
	{ path: '/', name: 'Home', component: HomePage },

	//*login page route
	{ path: '/login', name: 'login', component: () => import('../pages/auth/LoginPage.vue') },
	//*register page route
	{ path: '/register', name: 'register', component: () => import('@/pages/auth/RegisterPage.vue') },
	//*forgot password page route
	{ path: '/forget-password', name: 'forgetPassword', component: () => import('@/pages/auth/ForgetPasswordPage.vue') },
	//*verify-email page route
	{ path: '/verify-email', name: 'verifyEmail', component: () => import('@/pages/auth/VerifyEmailPage.vue') },

	//*profile page route
	{ path: '/profile', name: 'profile', component: () => import('@/pages/profile/ProfilePage.vue') },
	//*update profile route
	{ path: '/profile/update', name: 'updateProfile', component: () => import('@/pages/profile/update-profile/UpdateProfilePage.vue') },
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
