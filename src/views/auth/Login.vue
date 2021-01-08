<template>
  <h2>Login</h2>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" type="text" placeholder="Enter your username" required />
    <input v-model="password" type="password" placeholder="Enter your passoword" required />
    <button>Login</button>
  </form>
  <p>Do not have an account <router-link :to="{ name: 'Signup' }" >Signup Here</router-link></p> 
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const username = ref('')
    const password = ref('')

    const handleSubmit = () => {
      console.log(username, password)
    }

    return { username, password, handleSubmit }
  }
}
</script>

<style>

</style>