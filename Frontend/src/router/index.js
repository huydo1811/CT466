import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// User pages
import HomeView from '@/views/user/HomeView.vue'
import MoviesView from '@/views/user/movies/MoviesView.vue'
import SeriesView from '@/views/user/movies/SeriesView.vue'
import CategoriesView from '@/views/user/categories/CategoriesView.vue'
import CategoriesDetailView from '@/views/user/categories/CategoryDetailView.vue'
import NationalView from '@/views/user/countries/NationalView.vue'
import ActorsView from '@/views/user/actors/ActorsView.vue'
import ActorsDetailView from '@/views/user/actors/ActorDetailView.vue'
import LoginView from '@/views/user/LoginView.vue'
import RegisterView from '@/views/user/RegisterView.vue'
import MovieDetailView from '@/views/user/movies/MovieDetailView.vue'
import WatchMovieView from '@/views/user/movies/WatchMovieView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import ContactView from '@/views/user/support/ContactView.vue'
import FAQView from '@/views/user/support/FAQview.vue'
import PolicyView from '@/views/user/support/PolicyView.vue'
import TermsView from '@/views/user/support/TermsView.vue'
import WatchSeriesView from '@/views/user/movies/WatchSeriesView.vue'
import SeriesDetailView from '@/views/user/movies/SeriesDetailView.vue'

// Admin pages
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
//Movie
import AdminMovies from '@/views/admin/movies/AdminMovies.vue'
import AddMovie from '@/views/admin/movies/AddMovie.vue'
import EditMovie from '@/views/admin/movies/EditMovie.vue'
import MovieDetail from '@/views/admin/movies/MovieDetail.vue'
//Series
import AdminSeries from '@/views/admin/series/AdminSeries.vue'
import AddSeries from '@/views/admin/series/AddSeries.vue'
import AddEpisode from '@/views/admin/series/AddEpisode.vue'
import EditSeries from '@/views/admin/series/EditSeries.vue'
import SeriesDetail from '@/views/admin/series/SeriesDetail.vue'

//Country
import AdminCountries from '@/views/admin/countries/AdminCountries.vue'

//Actor
import AdminActors from '@/views/admin/actors/AdminActors.vue'

//Category
import AdminCategories from '@/views/admin/categories/AdminCategories.vue'

//User
import AdminUsers from '@/views/admin/users/AdminUsers.vue'
import AddUser from '@/views/admin/users/AddUser.vue'
import EditUser from '@/views/admin/users/EditUser.vue'

//Banner
import AdminBanners from '@/views/admin/banners/AdminBanners.vue'

//Comment
import AdminComments from '@/views/admin/comments/AdminComments.vue'

//Setting
import AdminSettings from '@/views/admin/setting/AdminSettings.vue'

//Profile
import AdminProfile from '@/views/admin/profile/AdminProfile.vue'

const routes = [
  {
    path: '/',
    component: UserLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'movies', name: 'movies', component: MoviesView },
      { path: 'series', name: 'series', component: SeriesView },
      { path: 'categories', name: 'categories', component: CategoriesView },
      { path: 'categories/:slug', name: 'category', component: CategoriesView, props: true },
      { path: 'category/:slug', name: 'category-detail', component: CategoriesDetailView, props: true },
      { path: 'national/:slug', name: 'country', component: NationalView, props: true },
      { path: 'actors', name: 'actors', component: ActorsView },
      { path: 'actors/:id', name: 'actor-detail', component: ActorsDetailView, props: true },
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView },
      { path: 'movies/:id', name: 'movie-detail', component: MovieDetailView, props: true },
      { path: 'watch/:id', name: 'watch-movie', component: WatchMovieView, props: true },
      { path: 'profile', name: 'profile', component: ProfileView },
      { path: 'contact', name: 'contact', component: ContactView },
      { path: 'faq', name: 'faq', component: FAQView },
      { path: 'policy', name: 'policy', component: PolicyView },
      { path: 'terms', name: 'terms', component: TermsView },
      { path: 'series/:id', name: 'series-detail', component: SeriesDetailView, props: true },
      { path: 'series/:id/episode/:episodeId', name: 'watch-series', component: WatchSeriesView, props: true }
    ]
  },

  {
    path: '/admin/login',
    name: 'admin.login',
    component: () => import('@/views/admin/AdminLogin.vue'),
    meta: { public: true }
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin.dashboard', component: AdminDashboard },
      { path: 'movies', name: 'admin.movies', component: AdminMovies },
      { path: 'movies/add', name: 'admin.movies.add', component: AddMovie },
      { path: 'movies/edit/:id', name: 'admin.movies.edit', component: EditMovie },
      { path: 'movies/:id', name: 'admin.movies.detail', component: MovieDetail },
      { path: 'series', name: 'admin.series', component: AdminSeries },
      { path: 'series/add', name: 'admin.series.add', component: AddSeries },
      { path: 'series/add-episode', name: 'admin.series.addEpisode', component: AddEpisode },
      { path: 'series/edit/:id', name: 'admin.series.edit', component: EditSeries },
      { path: 'series/:id', name: 'admin.series.detail', component: SeriesDetail },
      { path: 'countries', name: 'admin.countries', component: AdminCountries },
      { path: 'actors', name: 'admin.actors', component: AdminActors },
      { path: 'categories', name: 'admin.categories', component: AdminCategories },
      { path: 'users', name: 'admin.users', component: AdminUsers },
      { path: 'users/add', name: 'admin.users.add', component: AddUser },
      { path: 'users/edit/:id', name: 'admin.users.edit', component: EditUser },
      { path: 'banners', name: 'admin.banners', component: AdminBanners },
      { path: 'comments', name: 'admin.comments', component: AdminComments },
      { path: 'settings', name: 'admin.settings', component: AdminSettings },
      { path: 'profile', name: 'admin.profile', component: AdminProfile }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //cuộn đầu trang mỗi khi điều hướng
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 0, behavior: 'smooth' }
    }
    // mặc định cuộn về đầu trang
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.meta?.public) return next()

  if (auth.token && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch (e) {
      console.error('Failed to fetch user profile:', e)
      auth.logout()
      if (to.path.startsWith('/admin')) {
        return next({ path: '/admin/login', query: { redirect: to.fullPath } })
      } else {
        return next({ name: 'login', query: { redirect: to.fullPath } })
      }
    }
  }

  // protect admin area
  if (to.path.startsWith('/admin')) {
    if (!auth.isAuthenticated) {
      return next({ path: '/admin/login', query: { redirect: to.fullPath } })
    }
    if (to.meta?.requiresAdmin && auth.user?.role !== 'admin') {
      return next({ name: 'home' })
    }
    return next()
  }

  // generic auth protection for other protected routes
  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router
