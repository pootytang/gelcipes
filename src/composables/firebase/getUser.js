import { ref } from "vue"
import { fbaseAuth } from '../../firebase/config'

const user = ref(fbaseAuth.currentUser)

fbaseAuth.onAuthStateChanged(_user => {
  user.value = _user
})

const getUser = () => {
  return { user }
}

export default getUser