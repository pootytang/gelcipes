<template>
  <h2>Login</h2>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="text" required placeholder="Enter your email" />
    <input v-model="password" type="password" placeholder="Enter your passoword" required autocomplete="" />
    <button v-if="!isPending">Login</button>
    <button v-else>Checking...</button>
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
    const { error, login, isPending } = useLogin()

    const handleLogin = async () => {
      const res = await login(email.value, password.value)
      if (!error.value) {
        router.push({ name: 'Home' })
      }
    }

    return { isPending, email, password, handleLogin }
  }
}
</script>

<style scoped>
  span {
    color: darkgreen;
  }
</style>