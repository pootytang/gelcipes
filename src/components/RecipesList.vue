<template>
  <div v-if="recipes.length">
    <section class="recipes">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe">
        <RecipeItem :recipe="recipe" />
      </div>
    </section>
  </div>
  <div v-else>
    <h3>You have no recipes. Try adding one</h3>
  </div>  
</template>

<script>
import RecipeItem from '@/components/RecipeItem'
import Spinner from '@/components/base/Spinner'

export default {
  name: 'RecipesList',
  props: ['recipes'],
  components: { RecipeItem, Spinner},
  setup () {

    return {}
  }
}
</script>

<style>
.recipes {
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: center;
  align-items: center;
  /* border: 2px dashed blue; */
}
.recipe {
  box-sizing: border-box;
  border-radius: 30px;
  background: cornsilk;
  /* background: floralwhite; */
  /* background: lightgoldenrodyellow; */
  /* background: whitesmoke; */
  box-shadow: 0 3px 3px #aaa;
  margin: 10px;
  padding: 8px;
  width: 280px;
  transition: all ease 0.2s;
}
.recipe:hover {
  box-shadow: 1px 5px 3px #888;
  transform: scale(1.02);
  transition: all ease 0.2s;
}
</style>