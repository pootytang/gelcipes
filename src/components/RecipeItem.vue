<template>
      <router-link :to="{ name: 'GelcipeDetails', params: { id: recipe.id }}">
        <div>
          <h3>{{ recipe.title }}</h3>
          <div class="thumbnail">
            <img :src="recipe.coverUrl" />
          </div>
          <div class="info">
            <p>Created by {{ recipe.createdBy }}</p>
            <p>Cook Time: {{ recipe.cookTime }}</p>
          </div>
        </div>
      </router-link>
</template>

<script>

export default {
  name: 'RecipeItem',
  props: ['recipe'],
}
</script>

<style scoped>
  .thumbnail {
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 200px;
    /* max-width: 100px;
    max-height: 100px; */
    overflow: hidden;
    border-radius: 50px;
  }
  img {
    max-width: 150%;
    max-height: 150%;
    display: block;
  }
  .info {
    margin: 0 30px;
  }
  .cook-time {
    margin-left: auto;
  }
</style>