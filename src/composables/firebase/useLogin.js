import { ref } from "vue"
import { fbaseAuth, gProvider, fbProvider, twProvider } from '../../firebase/config'

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
    error.value = 'Login to Google Failed: ' + err.message
    isPending.value = false
  }
}

const fbLogin = async () => {
  error.value = null
  isPending.value = true

  try {
    const res = await fbaseAuth.signInWithPopup(fbProvider)
    error.value = null
    isPending = false
    return res
  } catch (err) {
    console.log(err)
    error.value = 'Login to Facebook Failed: ' + err.message
    isPending.value = false
  }
}

const twLogin = async () => {
  error.value = null
  isPending.value = true

  try {
    const res = await fbaseAuth.signInWithRedirect(twProvider)
    error.value = null
    isPending = false
    return res
  } catch (err) {
    console.log(err)
    error.value = 'Login to Twitter Failed' + err.message
    isPending.value = false
  }
}

const useLogin = () => {
  return { isPending, error, login, gLogin, fbLogin, twLogin }
}

export default useLogin