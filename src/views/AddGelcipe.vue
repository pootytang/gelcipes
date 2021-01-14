<template>
  <h2>Add a recipe</h2>
  <form @submit.prevent="addGelcipe">
    <div class="defaults">
      <input type="text" required placeholder="Recipe Title" v-model="title" />
      <input type="text" required placeholder="Preperation Time (Ex: 10 minutes)" v-model="prepTime" />
      <input type="text" required placeholder="Cook Time (Ex: 40 minutes)" v-model="cookTime" />
      <input type="text" required placeholder="How many it feeds" v-model="feeds" />
    </div>
    <div>
      <!-- upload recipe image -->
      <label>Upload an image (JGEG, JPG, or PNG)</label>
      <input type="file" @change="checkImage" />
      <div class="error" v-if="fileError">{{ fileError }}</div>
    </div>

    <!-- Ingredients and Directions -->
    <div class="ingredients">
      <textarea required placeholder="Ingredients" v-model="ingredients"></textarea>
      <textarea required placeholder="Cost (Ex: $10)" v-model="cost"></textarea>
      <textarea required placeholder="Cooking Directions" v-model="directions"></textarea>
    </div>

    <div>
      <input type="text" required placeholder="Author Name" v-model="author.name" />
      <input type="text" required placeholder="Author URL" v-model="author.url" />
    </div>

    <div class="hashtags">
      <input  
        type="text" 
        placeholder="Hash Tags (Press enter after each hashtag)" 
        v-model="tag"
        @keydown.enter.prevent="addTag"
      />
      <div v-for="tag in hashTags" :key="tag" @click="deleteTag(tag)" class="pill">#{{ tag }}</div>
    </div>
    <hr />
      <button v-if="!uploadPending">Add Gelcipe</button>
      <button v-else>Loading...</button>
  </form>
</template>

<script>
import { computed, reactive, ref, toRefs } from 'vue'
import { timestamp } from '@/firebase/config'
import useCollection from '@/composables/firebase/useCollection'
import useStorage from '@/composables/firebase/useStorage'
import getUser from '@/composables/firebase/getUser'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const tag = ref('')
    const imageFile = ref(null)
    const fileError = ref(null)
    const uploadPending = ref(false)
    const router = useRouter()

    const { user } = getUser()
    const { error: collectionError, isPending, addDoc } = useCollection('recipes')
    const { filePath, uploadImage, url: imgUrl, error: storageError } = useStorage()

    const newGelcipe = reactive({
      userId: '',
      createdBy: '',
      title: '',
      prepTime: '',
      cookTime: '',
      feeds: null,
      imagePath: null,
      coverUrl: null,
      ingredients: '',
      cost: '',
      directions: '',
      author: { name: '', url: ''},
      hashTags: [],
      createdAt: null
    })
    const fileTypes = ['image/png', 'image/jpeg', 'image/jpg']

    // HANDLE TAGS
    const addTag = () => {
      const newTag = tag.value.replace(/\s/, '')
      if (!newGelcipe.hashTags.includes(newTag)) {
        newGelcipe.hashTags.push(newTag)
      }
      tag.value = ''
    }

    const deleteTag = (deleteMe) => {
      if (newGelcipe.hashTags.includes(deleteMe))
      newGelcipe.hashTags = newGelcipe.hashTags.filter(t => t !== deleteMe)
    }

    // HANDLE THE IMAGE UPLOAD
    const checkImage = (e) => {
      const selected = e.target.files[0]

      if (selected && fileTypes.includes(selected.type)) {
        imageFile.value = selected
        fileError.value = null
      } else {
        imageFile.value = null
        fileError.value = 'Please select an image file (png or jpg)'
      }
    }

    // ADD THE GELCIIPE
    const addGelcipe = async () => {
      if (imageFile.value) {
        uploadPending.value = true
        await uploadImage(imageFile.value)
        // document to upload
        let newDoc = {
          userId: user.value.uid,
          createdBy: user.value.displayName,
          title: newGelcipe.title,
          prepTime: newGelcipe.prepTime,
          cookTime: newGelcipe.cookTime,
          feeds: newGelcipe.feeds,
          imagePath: filePath.value,
          coverUrl: imgUrl.value,
          ingredients: newGelcipe.ingredients,
          cost: newGelcipe.cost,
          directions: newGelcipe.directions,
          author: newGelcipe.author,
          hashTags: newGelcipe.hashTags,
          createdAt: timestamp(),
          isFav: false,
          cookedDays: []
        }

        // upload the doc
        const res = await addDoc(newDoc)
        uploadPending.value = false
        if (!storageError.value && !collectionError.value) {
          router.push({ name: 'Home' })
        } else {
          if (storageError.value) {
            console.log(storageError.value)
          } else {
            console.log(collectionError.value)
          }
        }
      }
    }

    return { ...toRefs(newGelcipe), tag, fileError, addTag, deleteTag, addGelcipe, checkImage, uploadPending }
  }
}
</script>

<style scoped>
hr {
  margin-bottom: 30px;
}
.pill {
  display: inline-block;
  margin: 2px 2px 0 0;
  margin-bottom: 20px;
  color: white;
  background: darkgreen;
  border: none;
  padding: 8px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
</style>