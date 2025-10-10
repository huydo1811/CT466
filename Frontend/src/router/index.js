import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// User pages
import HomeView from '@/views/HomeView.vue'
import MoviesView from '@/views/MoviesView.vue'
import SeriesView from '@/views/SeriesView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import NationalView from '@/views/NationalView.vue'
import ActorsView from '@/views/ActorsView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MovieDetailView from '@/views/MovieDetailView.vue'
import WatchMovieView from '@/views/WatchMovieView.vue'

// Admin pages
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminMovies from '@/views/admin/AdminMovies.vue'
import AdminUsers from '@/views/admin/AdminUsers.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: UserLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'movies', name: 'movies', component: MoviesView },
        { path: 'series', name: 'series', component: SeriesView },
        { path: 'categories', name: 'categories', component: CategoriesView },
        { path: 'categories/:slug', name: 'category', component: CategoriesView, props: true },
        { path: 'national', name: 'national', component: NationalView },
        { path: 'national/:slug', name: 'country', component: NationalView, props: true },
        { path: 'actors', name: 'actors', component: ActorsView },
        { path: 'login', name: 'login', component: LoginView },
        { path: 'register', name: 'register', component: RegisterView },
        { path: 'movies/:id', name: 'movie-detail', component: MovieDetailView, props: true },
        { path: 'watch/:id', name: 'watch-movie', component: WatchMovieView, props: true }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'admin.dashboard', component: AdminDashboard },
        { path: 'movies', name: 'admin.movies', component: AdminMovies },
        { path: 'users', name: 'admin.users', component: AdminUsers },
        { path: 'settings', name: 'admin.settings', component: AdminSettings }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
  ],
  scrollBehavior: () => ({ top: 0 })
})

export default router
