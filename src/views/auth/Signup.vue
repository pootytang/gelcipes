<template>
  <h2>Signup</h2>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" type="text" placeholder="Enter your username" required />
    <input v-model="password" type="password" placeholder="Enter your passoword" required />
    <input v-model="confirmPassword" type="password" placeholder="Confirm your passoword" required />
    <button>Signup</button>
  </form>
  <p>Already have an account <router-link :to="{ name: 'Login' }" >Login Here</router-link></p> 
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const handleSubmit = () => {
      console.log(username, password, confirmPassword)
    }

    return { username, password, confirmPassword, handleSubmit }
  }
}
</script>

<style>

</style>