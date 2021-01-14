import { ref } from "vue"
import { fbaseAuth } from '../../firebase/config'

const error = ref(null)
const isPending = ref(false)

const logout = async () => {
  error.value = null
  isPending.value = true

  try {
    await fbaseAuth.signOut()
    isPending.value = false
  } catch (err) {
    console.log(err.message)
    error.value = err.message
    isPending.value = false
  }
}

const useLogout = () => {
  return { isPending, logout, error }
}

export default useLogout