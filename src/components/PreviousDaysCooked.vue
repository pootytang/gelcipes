<template>
<div class="main">
  DISPLAY THE IMAGES

  <ul v-if="recipe" class="cards">
    <li v-for="(days, key) in recipe.daysCooked" :key="key" class="cards-item">
      <div class="card">

        <div class="card-content" v-for="(day, date) in days" :key="day">
          <div  class="card-content-day">
            <h2>{{ date }}</h2>
          </div>
          <div class="card-content-images">
            <img :src="imgData.imageUrl" class="card-content-images-image" v-for="imgData in day" :key="imgData.id" />
            <!-- <img src="https://i.pravatar.cc/125" class="card-content-images-image" v-for="imgData in day" :key="imgData.id" /> -->
          </div>
        </div>
        
      </div>
    </li>
  </ul>

</div>
  
</template>

<script>
import getDocument from '@/composables/firebase/getDocument'
import { onMounted, ref } from 'vue'

export default {
  name: 'PreviousDaysCooked',
  props: ['recipeId'],
  setup(props) {
    const daysImages = ref([])
    const { document: recipe, error } = getDocument('recipes', props.recipeId)

    return { recipe }
  }

}
</script>

<style scoped>
.main{
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
}

.cards_item {
  display: flex;
  padding: 2rem;
}

@media (min-width: 40rem) {
  .cards_item {
    width: 50%;
  }
}

@media (min-width: 56rem) {
  .cards_item {
    width: 33.3333%;
  }
}

.card {
  padding: 10px;
  /* border-radius: 0.25rem;
  box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid green; */
}
.card-content {
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* padding: 20px; */
  margin: 20px;
}
.card-content-day {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 30px;
  border-radius: 15px;
  background: var(--secondary);
}
.card-content-images {
  background-color: burlywood;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  border: 2px solid green;
  border-radius: 8px;
  margin: 10px;
}
.card-content-images-image {
  margin: 10px;
  height: 100px;
  width: 100px;
  border-radius: 15px;
}
.card-content-images-image:hover {
    box-shadow: 1px 5px 3px #888;
    transform: scale(1.02);
    transition: all ease 0.2s;
  }
</style>