import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'
import { fbaseAuth } from './firebase/config'

// const app = createApp(App)

// app.use(store)
// app.use(router)

// app.mount('#app')

let app

fbaseAuth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
    app.use(store)
    app.use(router)
    
    app.mount('#app')
  }
})