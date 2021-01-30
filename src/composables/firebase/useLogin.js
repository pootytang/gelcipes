import { ref } from "vue"
import { fbaseAuth, gProvider } from '../../firebase/config'

const error = ref(null)
const isPending = ref(false)

const login = async (email, password) => {
  error.value = null
  isPending.value = true

  try {
    const res = await fbaseAuth.signInWithEmailAndPassword(email, password)
    error.value = null
    isPending.value = false
    return res
  } catch (err) {
    console.log(err.value)
    error.value = 'Incorrect login credentials'
    isPending.value = false
  }
}

const gLogin = async () => {
  error.value = null
  isPending.value = true

  try {
    const res = await fbaseAuth.signInWithRedirect(gProvider)
    error.value = null
    isPending = false
    return res
  } catch (err) {
    console.log(err)
    error.value = 'Login to Google Failed'
    isPending.value = false
  }
}

const useLogin = () => {
  return { isPending, error, login, gLogin }
}

export default useLogin