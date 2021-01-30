<template>
  <div v-if="owner" class="recipe-container">

    <div class="error" v-if="error">{{ error }}</div>
    <div class="recipe-details" v-if="recipe">
      <div class="cover">
        <img :src="recipe.coverUrl" />
        <h2>
          {{ recipe.title }} 

          <!-- Favorite -->
          <span v-if="!recipe.isFav"><img class="favImg" src="@/assets/blankHeart.png" @click="setFavorite" /></span>
          <span v-else ><img class="favImg" src="@/assets/filledHeart.png" @click="setFavorite" /></span>
        </h2>
        <div class="tag" v-for="tag in recipe.hashTags" :key="tag" @click="deleteTag(tag)">
          #{{ tag }}
        </div>
      </div>
      <PreviousDaysCooked :recipeId="id" />
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
          <input type="text" v-model="tag" placeholder="add new tag (press enter after each tag)" class="newtag" @keydown.enter.prevent="newtag"/>
          <div class="tag" v-for="tag in recipe.hashTags" :key="tag" @click="deleteTag(tag)">
            #{{ tag }}
          </div>
        </div>
      <FileUpload :id="id" />
    </div>

  </div>
  <div v-else>Sorry, you don't have access to this page</div>
</template>

<script>
import FileUpload from '../../components/FileUpload'
import PreviousDaysCooked from '../../components/PreviousDaysCooked'
import getUser from '@/composables/firebase/getUser'
import getDocument from '@/composables/firebase/getDocument'
import useDocument from '@/composables/firebase/useDocument'
import useStorage from '@/composables/firebase/useStorage'
import { computed, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, reactive, ref, watch } from 'vue';


export default {
	name: "GelcipeDetails",
  props: ['id'],
	components: { FileUpload, PreviousDaysCooked },
	setup(props) {
    const { error, document: recipe } = getDocument('recipes', props.id)
    const { updateDoc, isPending, error: useDocError } = useDocument('recipes', props.id)
    const { user } = getUser()

    const tag = ref('')
    const favorite = ref(false)
    const needs = ref([])

    const owner = computed(() => {
      if (recipe.value) {
        return recipe.value && user.value && recipe.value.userId == user.value.uid
      }
    })

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

    /************************************ 
                FAVORITE
     ************************************/
    onBeforeUpdate(() => {
      // set the favorite property's initial value
      favorite.value = recipe.value.isFav
    })
    
    const setFavorite = async () => {
      favorite.value = !favorite.value

      useDocError.value = null
      await updateDoc({
        'isFav': favorite.value
      })
      if (!useDocError.value) {
        recipe.value.isFav = favorite.value
      } else {
        console.error('Problem updating favorite in DB')
      }
    }

    /************************************ 
            HASH TAG FUNCTIONS
     ************************************/
    const newtag = computed(() => {
      if (tag && !recipe.value.hashTags.includes(tag)){
        recipe.value.hashTags.push(tag.value)
        updateTags()
        return tag.value = ''
      }
    })

    const deleteTag = (deleteMe) => {
      if (recipe.value.hashTags.includes(deleteMe)) {
        recipe.value.hashTags = recipe.value.hashTags.filter(t => t !== deleteMe)
        updateTags()
      }
    }

    const updateTags = async () => {
      console.log('Updating Tags')
      await updateDoc({
        hashTags: [...recipe.value.hashTags]
      })
    }
    
		return { error, recipe, setFavorite, ingredients, directions, newtag, tag, deleteTag, owner }
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

  .main-info {
    border: 1px solid black;
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
    margin-bottom: 5px;
    text-align: left;
    border: 1px solid black;
  }
  .hashtags {
    display: inline-block;
    margin: 0 auto;
  }
  .newtag {
    background-color: lightgray;
    border: 1px solid darkgray;
    border-radius: 20px;
    margin: 0px 0px 10px 0px;
  }
  .tags {
    display: inline-block;
    margin: 2px 2px 0 0;
    margin-bottom: 20px;
    color: white;
    background: darkgreen;
    border: 1px solid black;
    padding: 8px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
  }
  .username {
    color: #999;
  }
</style>
