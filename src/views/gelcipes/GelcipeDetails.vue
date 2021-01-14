<template>
  <div class="recipe-container">

    <div class="error" v-if="error">{{ error }}</div>
    <div class="recipe-details" v-if="recipe">
      <div class="cover">
        <img :src="recipe.coverUrl" />
        <h2>
          {{ recipe.title }} 
          <span v-if="!recipe.isFav && !favorite"><img class="favImg" src="@/assets/blankHeart.png" @click="favorite = !recipe.isFav" /></span>
          <span v-else ><img class="favImg" src="@/assets/filledHeart.png" @click="favorite = !recipe.isFav" /></span>
        </h2>
      </div>
      
      <div class="inner-grid">

        <!-- TIMES -->
        <div class="times">
          <div>Preparation Time: {{ recipe.prepTime }}</div>
          <div>Cook Time: {{ recipe.cookTime }}</div>
          <div>Feeds: {{ recipe.feeds }}</div>
          <!-- Author Info -->
          <div class="author-info">
              <p>Author: <a :href="recipe.author.url" target="_blank">{{ recipe.author.name }}</a></p>
            </div>
          </div>
        </div>

        <!-- Main Info -->
        <div class="main-info">
          <div class="ingredients">
            <h2>INGREDIENTS - Estimated cost: {{ recipe.cost }}</h2>
            <div v-for="ingredient in ingredients" :key="ingredient">{{ ingredient }}</div>
          </div>
          <div class="directions">
              <h2>DIRECTIONS</h2>
              <ol>
                  <li v-for="direction in directions" :key="direction">{{ direction }}</li>  
              </ol>
          </div>
        </div>

        <!-- HashTags -->
        <div class="hashtags">
          <h3>Tags:</h3>
          <div class="tags" v-for="tag in recipe.hashTags" :key="tag">
            #{{ tag }}
          </div>
        </div>

      <!-- Days Cooked -->
      <!-- <div class="days-cooked">
        <div v-for="day in recipe.daysCooked" :key="day">
          {{ day }}
          <div class="cook-day" v-for="img in day" :key="img.id" >
            {{ img }}
          </div>
        </div> 
      </div> -->
    </div>

  </div>
</template>

<script>
import getDocument from '@/composables/firebase/getDocument'
import { computed, ref, watch } from 'vue';

export default {
	name: "GelcipeDetails",
  props: ['id'],
	components: {},
	setup(props) {
    const { error, document: recipe } = getDocument('recipes', props.id)
    const favorite = ref(false)
    const needs = ref([])
    const ingredients = computed(() => {
      if (recipe) {
        return recipe.value.ingredients.split('\n')
      }
    })

    const instructions = ref([])
    const directions = computed(() => {
      if (recipe) {
        return recipe.value.directions.split('\n')
      }
    })

    watch(favorite, (newval, oldval) => {
      recipe.value.isFav = favorite
      // update the value in the db
    })

    
		return { error, recipe, favorite, ingredients, directions }
	},
};
</script>

<style scoped>
  .recipe-container {
    display: grid;
    overflow: hidden;
    /* grid-template-columns: 2fr 2fr; */
    gap: 80px;
    /* border: 2px solid black; */
    padding: 20px;
  }
  .recipe-details {
    display: grid;
    /* grid-template-columns: 1fr 2fr; */
    gap: 20px;
  }
  .cover {
    overflow: hidden;
    position: relative;
    padding: 1px;
  }
  .cover img {
    border-radius: 20px;
    max-width: 50%;
    max-height: 50%;
    box-shadow: 0px 2px 3px #aaa;
  }
  .favImg {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .inner-grid {
    display: grid;
  }
  .ingredients {
    text-align: left;
    padding: 0px 0px 20px 0px;
  }
  .directions {
    /* margin-top: 20px; */
    /* background: lemonchiffon; */
    text-align: left;
  }
  .directions > ol {
    padding: 2px 0px 0px 20px;
  }
  p > a {
    color: steelblue;
  }
  .times {
    margin-left: 5px;
    margin-bottom: 10px;
    text-align: left;
  }
  .tags {
    display: inline-block;
    margin: 2px 2px 0 0;
    margin-bottom: 20px;
    color: white;
    background: darkgreen;
    border: none;
    padding: 8px;
    border-radius: 20px;
    font-size: 14px;
  }
  .username {
    color: #999;
  }
</style>
