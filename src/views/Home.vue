<template>
  <div class="home">
    <h2 v-if="user">{{ user.displayName }}'s GELCIPES</h2>
    <recipes-list />
  </div>
</template>

<script>
import RecipesList from '../components/RecipesList'
import getUser from '@/composables/firebase/getUser'

export default {
  name: 'Home',
  components: { RecipesList },
  setup() {
    const { user } = getUser()

    return { user }
  }
}
</script>
