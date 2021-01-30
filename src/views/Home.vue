<template>
  <div class="home">
    <div v-if="!isPending && recipes && user">
      <h2>{{ user.displayName }}'s GELCIPES</h2>
      <TagCloud :recipes="recipes" @tag-clicked="handleTagClicked" />
      <recipes-list v-if="filteredRecipes.length" :recipes="filteredRecipes" />
      <recipes-list v-else :recipes="recipes" />
    </div>
    <div v-else>
      <Spinner />
    </div>
  </div>
</template>

<script>
import RecipesList from '../components/RecipesList'
import TagCloud from '@/components/TagCloud'
import Spinner from '@/components/base/Spinner'
import getUser from '@/composables/firebase/getUser'
import getCollection from '@/composables/firebase/getCollection'
import { ref } from 'vue'

export default {
  name: 'Home',
  components: { RecipesList, TagCloud, Spinner },
  setup () {
    const { user } = getUser()
    const isPending = ref(true)
    const filteredRecipes = ref([])

    const { error, documents: recipes } = getCollection('recipes', ['userId', '==', user.value.uid])
    isPending.value = false
    console.log('Home')
    console.log(user.value.user)

    const handleTagClicked = ((tag) => {
      filteredRecipes.value = recipes.value.filter((recipe) => recipe.hashTags.includes(tag))
    })


    return { isPending, recipes, filteredRecipes, user, handleTagClicked }
  }
}
</script>
