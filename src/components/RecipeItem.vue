<template>
  <section class="recipes">
    <div v-for="recipe in recipes" :key="recipe.id" class="recipe">
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
    </div>
  </section>
</template>

<script>

export default {
  name: 'RecipeItem',
  props: ['recipes'],
}
</script>

<style scoped>
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