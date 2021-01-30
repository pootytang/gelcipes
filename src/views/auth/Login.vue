<template>
  <h2>Login</h2>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="text" required placeholder="Enter your email" />
    <input v-model="password" type="password" placeholder="Enter your passoword" required autocomplete="" />
    <div v-if="error" class="error">{{error}}</div>
    <button v-if="!isPending">Login</button>
    <button v-else-if="error" disabled>Login</button>
    <button v-else>Checking...</button>
    <div class="oauth">
      <a class="fa fa-google" @click="handleGoogleLogin"></a>
      <a href="#" class="fa fa-facebook"></a>
      <a href="#" class="fa fa-twitter"></a>
    </div>
  </form>
  <p>Do not have an account? <router-link :to="{ name: 'Signup' }" ><span>Signup Here</span></router-link></p> 
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useLogin from '@/composables/firebase/useLogin'

export default {
  name: 'Home',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const { error, login, gLogin, isPending } = useLogin()

    const handleLogin = async () => {
      const res = await login(email.value, password.value)
      if (!error.value) {
        router.push({ name: 'Home' })
      }
    }

    const handleGoogleLogin = async () => {
      const res = await gLogin()
      return
    }

    return { error, isPending, email, password, handleLogin, handleGoogleLogin }
  }
}
</script>

<style scoped>
  span {
    color: darkgreen;
  }

  /* Social Media Icons */
  .fa {
  padding: 20px;
  font-size: 30px;
  width: 50px;
  text-align: center;
  text-decoration: none;
  margin: 15px 10px;
}

.fa:hover {
    opacity: 0.7;
}

.fa-facebook {
  background: #3B5998;
  color: white;
}

.fa-twitter {
  background: #55ACEE;
  color: white;
}

.fa-google {
  background: #dd4b39;
  color: white;
}
</style>