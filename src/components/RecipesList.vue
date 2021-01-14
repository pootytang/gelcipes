<template>
    <div v-if="!isPending">
      <RecipeItem :recipes="recipes" />
    </div>
    <div v-else>
      <h3>You have no recipes. Try adding one</h3>
    </div>  
</template>

<script>
import getCollection from '@/composables/firebase/getCollection'
import getUser from '@/composables/firebase/getUser'
import RecipeItem from '@/components/RecipeItem'
import { ref } from 'vue'

export default {
  name: 'RecipesList',
  components: { RecipeItem },
  setup () {
    const isPending = ref(true)
    const { user } = getUser()

    // const { documents: recipes } = getCollection('recipes', ['userId', '==', user.value.uid])
    const { error, documents: recipes } = getCollection('recipes')
    isPending.value = false

    return { isPending, recipes, error }
  }
}
</script>

<style scoped>

</style>