<template>
  <h2>Signup</h2>
  <form @submit.prevent="handleSubmit">
    <input v-model="displayName" type="text" placeholder="Enter your display name" required />
    <input v-model="email" type="text" placeholder="Enter your email" required />
    <input v-model="password" type="password" placeholder="Enter your passoword" autocomplete="on" required />
    <input v-model="confirmPassword" type="password" placeholder="Confirm your passoword" autocomplete="on" required />
    <div class="error">{{ signUpError }}</div>
    <button v-if="!signUpError">Signup</button>
    <button v-else disabled>Signup</button>
  </form>
  <p>Already have an account? <router-link :to="{ name: 'Login' }" ><span>Login Here</span></router-link></p> 
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useSignup from '@/composables/firebase/useSignup'

export default {
  name: 'Signup',
  setup() {
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const signUpError = ref('')
    const displayName = ref('')
    const router = useRouter()
    const { error, signup } = useSignup()

// Good site for validation example https://5balloons.info/password-validation-indicator-in-vuejs/
    const handleSubmit = async () => {
      if (password.value === confirmPassword.value) {
        const res = await signup(email.value, password.value, displayName.value)
        if (!error.value) {
          router.push({ name: 'Home' })
        } else {
          signUpError.value = error.value
        }
      } else {
        console.log('Passwords do not match')
        signUpError.value = 'Your passwords do not match, please try again'
      }
      
    }

    return { email, password, confirmPassword, signUpError, displayName, handleSubmit }
  }
}
</script>

<style scoped>
  span {
    color: darkgreen;
  }
</style>