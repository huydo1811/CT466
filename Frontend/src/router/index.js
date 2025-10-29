import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// User pages
import HomeView from '@/views/HomeView.vue'
import MoviesView from '@/views/MoviesView.vue'
import SeriesView from '@/views/SeriesView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import CategoriesDetailView from '@/views/CategoryDetailView.vue'
import NationalView from '@/views/NationalView.vue'
import ActorsView from '@/views/ActorsView.vue'
import ActorsDetailView from '@/views/ActorDetailView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import MovieDetailView from '@/views/MovieDetailView.vue'
import WatchMovieView from '@/views/WatchMovieView.vue'
import ProfileView from '@/views/ProfileView.vue'

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
        { path: 'category/:slug', name: 'category-detail', component: CategoriesDetailView, props: true },
        { path: 'national/:slug', name: 'country', component: NationalView, props: true },
        { path: 'actors', name: 'actors', component: ActorsView },
        { path: 'actors/:id', name: 'actor-detail', component: ActorsDetailView, props: true },
        { path: 'login', name: 'login', component: LoginView },
        { path: 'register', name: 'register', component: RegisterView },
        { path: 'movies/:id', name: 'movie-detail', component: MovieDetailView, props: true },
        { path: 'watch/:id', name: 'watch-movie', component: WatchMovieView, props: true },
        { path: 'profile', name: 'profile', component: ProfileView }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        { path: '', name: 'admin.dashboard', component: AdminDashboard },
        { path: 'movies', name: 'admin.movies', component: AdminMovies },
        { path: 'movies/add', name: 'admin.movies.add', component: AddMovie },
        { path: 'movies/edit/:id', name: 'admin.movies.edit', component: EditMovie },
        { path: 'movies/:id', name: 'admin.movies.detail', component: MovieDetail },        { path: 'users', name: 'admin.users', component: AdminUsers },
        { path: 'settings', name: 'admin.settings', component: AdminSettings },
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
        { path: 'profile', name: 'admin.profile', component: AdminProfile }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
  ],
  scrollBehavior: () => ({ top: 0 })
})

export default router
