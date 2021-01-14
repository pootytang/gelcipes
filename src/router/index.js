import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddGelcipe from '../views/AddGelcipe.vue'
import NotFound from '../views/NotFound.vue'
import Login from '../views/auth/Login.vue'
import Signup from '../views/auth/Signup.vue'
import GelcipeDetails from '../views/gelcipes/GelcipeDetails.vue'
import { fbaseAuth } from '../firebase/config'


//GUARDS
const requireAuth = (to, from, next) => {
  let user = fbaseAuth.currentUser
  if (!user) {
    next({ name: 'Login' })
  } else {
    next()
  }
}

const authNotRequired = (to, from, next) => {
  let user = fbaseAuth.currentUser
  if (user) {
    next({ name: 'Home' })
  } else {
    next()
  }
}

const routes = [
  // AUTH REQUIRED ROUTES
  { path: '/', name: 'Home', component: Home, beforeEnter: requireAuth },
  { path: '/add', name: 'AddGelcipe', component: AddGelcipe , beforeEnter: requireAuth},
  { path: '/details/:id', name: 'GelcipeDetails', component: GelcipeDetails, beforeEnter: requireAuth, props: true },

  // AUTH NOT REQUIRED ROUTES
  { path: '/login', name: 'Login', component: Login, beforeEnter: authNotRequired },
  { path: '/signup', name: 'Signup', component: Signup, beforeEnter: authNotRequired },

  // 404
  { path: '/:notFound(.*)', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
