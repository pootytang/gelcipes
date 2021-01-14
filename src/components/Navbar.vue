<template>
  <div class="navbar">
    <nav>
      <img src="@/assets/GelcipeLogo_blk.png" />
      <h1><router-link :to="{ name: 'Home' }">GELCIPES</router-link></h1>
      <div class="links">
        <div v-if="user">
          <router-link class="btn" :to="{ name: 'AddGelcipe' }">Add Gelcipe</router-link>
          <button @click="handleLogout" v-if="!isPending">Logout</button>
          <button v-else disabled>{{ error }}</button>
        </div>
        <!-- Login/Signup Buttons -->
        <div v-else>
          <router-link class="btn" :to="{ name: 'Login' }">Login</router-link>
          <router-link class="btn" :to="{ name: 'Signup' }">Signup</router-link>
        </div>
        
      </div>
    </nav>
  </div>
</template>

<script>
import getUser from '@/composables/firebase/getUser'
import useLogout from '@/composables/firebase/useLogout'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const { user } = getUser()
    const { isPending, logout, error } = useLogout()
    

    console.log('Navbar user check: ', user)

    const handleLogout = async () => {
      await logout()
      if (!error.value) {
        console.log('user logged out')
        router.push({ name: 'Login' })
      }
    }

    return { user, isPending, error, handleLogout }
  }
}
</script>

<style scoped>
.navbar {
    padding: 5px 10px;
    margin-bottom: 70px;
    background: white;
  }
  nav {
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  nav img {
    max-height: 70px;
  }
  nav h1 {
    margin-left: 5px;

  }
  nav .links {
    margin-left: auto;
  }
  nav .links a, button {
    margin-left: 16px;
    font-size: 14px;
  }
  span {
    font-size: 14px;
    display: inline-block;
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid #eee;
  }
</style>