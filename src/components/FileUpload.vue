<template>
    <div class="days-cooked">
      <form class="image-form" @submit.prevent="addDay">
        <h3>Add images of Previous Days Cooked</h3>
        <!-- Date Cooked -->
        <input class="date-cooked" type="text" placeholder="Date Cooked (mm/dd/yyyy)" v-model="dateCooked" @change="checkDate">

        <!-- Image Upload -->
        <button v-if="isValidDate" class="add-image" @click.prevent="onPickFile"><div>Add Image</div><div>(jpeg, jpg, or png)</div></button>
        <button v-else class="add-image" @click.prevent="onPickFile" disabled><div>Add Image</div><div>(jpeg, jpg, or png)</div></button>
        <input type="file" accept="image/*" ref="fileInput" @change="onFilePicked" style="display: none" />
        <div>
          <progress :value="progress" max="100"></progress>
        </div>
        
        <hr />

        <span class="error" v-if="error">{{ error }}</span>
        <div v-if="imgUrls" class="preview">
          <div v-for="url in imgUrls" :key="url">
            <img class="preview-img" :src="url" alt="" />
          </div>
        </div>
        <div>
          <button v-if="isValidDate && isValidFile" class="submit-btn">Submit Day</button>
          <button v-else class="submit-btn" disabled>Submit Day</button>
        </div>
      </form>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import pushId from 'pushid'
import { fbaseFirestoreUnion, fbaseStorage } from '../firebase/config'
import getUser from '@/composables/firebase/getUser'
import useStorage from '@/composables/firebase/useStorage'
import useDocument from '@/composables/firebase/useDocument'
import getDocument from '@/composables/firebase/getDocument'
import genPushID from '@/composables/general/generateId'

export default {
  // TODO:
  //1.  Pull days cooked from db then check the day we're adding is not already in the data. If So, just add the image to the current day
  //    This is because currently if I add an image to a day (1/24/2021) -> submit, then add another one for the same day, The DB creates 
  //    a new array object with the same day.  Not sure if we can fix this in firebase     
  name: 'FileUpload',
  props: ['id'],
  setup(props) {
    const error = ref(false)
    const isValidDate = ref(false)
    const isValidFile = ref(false)
    const fileInput = ref(null)
    const fbaseFilePath = ref(null)
    const progress = ref(0)
    const imgUrls = ref([])
    const dateCooked = ref('')
    const daysCooked = ref([])
    const { user } = getUser()
    const { document: recipe, error: getDocError } = getDocument('recipes', props.id)
    const { updateDoc, isPending, error: useDocError } = useDocument('recipes', props.id)

    const onPickFile = () => {
      fileInput.value.click()
    }

    /********** DATE **********/
    const checkDate = () => {
      // First check for the pattern
      isValidDate.value = false
      error.value = false

      if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateCooked.value)) {
        console.log('Wrong Date Format')
        error.value = 'Date format must be mm/dd/yyyy'
        return
      } else {
        error.value = false
      }

      // Parse the date parts to integers
      var parts = dateCooked.value.split("/")
      var day = parseInt(parts[1], 10)
      var month = parseInt(parts[0], 10)
      var year = parseInt(parts[2], 10)

      // Check the ranges of month and year
      if ( (!error.value) && (year < 1000 || year > 3000 || month == 0 || month > 12)) {
        console.log('Bad Year Range')
        error.value = 'Month or Year range is invalid'
        return
      } else {
        error.value = false
      }

      // Check range of day and Adjust for leap years
      var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
      if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29
      }

      if ( !(day > 0) || !(day <= monthLength[month - 1])) {
        console.log('Day is invalid')
        error.value = 'Invalid Day'
        return
      } else {
        error.value = false
      }
      isValidDate.value = true
    }

    /********** UPLOAD THE IMAGE(s) **********/
    const uploadImage = async (f, dir) => {
      error.value = null
      let url = null

      // Setup the firebase file path
      fbaseFilePath.value = `gelcipe_images/${user.value.uid}/days/${dir}/${f.name}`

      const fbStorageRef = fbaseStorage.ref(fbaseFilePath.value)
      var uploadTask = fbStorageRef.put(f)

      uploadTask.on('state_changed', (snapshot) => {
        // track progress
        progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      }, (err) => {
        console.log(err.message)
        error.value = err.message
        }, async () => {
          progress.value = 100
          url = await uploadTask.snapshot.ref.getDownloadURL()

          // Now lets add the url we just got for previews
          imgUrls.value.push(url)

          // Add the day info
          // If the date is in the recipe, lets add to the days cooked for the entered day
          let dayFound = false
          recipe.value.daysCooked.forEach((day, idx) => {
            if ([dateCooked.value] in day) {
              dayFound = true
              recipe.value.daysCooked[idx][dateCooked.value].push( {'id': pushId(), 'imageUrl': url, 'imageFBPath': fbaseFilePath.value} )
            }
          });

          // the day wasn't in the recipe so lets add the entire day to the recipe array
          // A new entry looks like this:
          // "MM/DD/YYYY": {'id': 'xxxxxxx', 'imageUrl': 'https://xxx.xxx.xxx', 'imageFBPath': 'recipes/day/mm/dd/yyyy/file.jpg'}
          if (!dayFound) {
            recipe.value.daysCooked.push(
              {
                [dateCooked.value]: [{'id': pushId(), 'imageUrl': url, 'imageFBPath': fbaseFilePath.value}]
              }
            )
          }         
        })
    }

    const onFilePicked = async (e) => {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      let uploadedFile = e.target.files
      isValidFile.value = false

      // Currently only supporting 1 file upload. May change later
      if (uploadedFile && allowedTypes.includes(uploadedFile[0].type)) {
        await uploadImage(uploadedFile[0], dateCooked.value)
        if (!error.value) {
          error.value = null
          isValidFile.value = true
        }
      } else {
        uploadedFile = null
        isValidFile.value = false
        console.log('useStorage -> onFilePicked(): wrong file type')
        error.value = 'Invalid file type'
        return
      }
    }

    /********** SUBMIT THE DAY **********/
    // Submit the Day
    const addDay = async () => {
      error.value = null
      if (recipe.value && fbaseFilePath.value && dateCooked.value) {
        // await updateDoc( {'daysCooked': fbaseFirestoreUnion(...days) })
        // await updateDoc( {'daysCooked': fbaseFirestoreUnion(...recipe.value.daysCooked)} )
        await updateDoc( {'daysCooked': [...recipe.value.daysCooked]} )
        if (!useDocError) {
          error.value = 'Problem Uploading Day'
        } else {
          clearForm()
        }
      } else {
        error.value = 'Missing files'
      }
    }

    const clearForm = () => {
      console.log('Resetting the form...')
      dateCooked.value = ''
      fileInput.value = null
      progress.value = 0
      imgUrls.value = []
      isValidDate.value = null
      isValidFile.value = null
    }

    return { fileInput, onPickFile, onFilePicked, error, imgUrls, dateCooked, isValidDate, isValidFile, checkDate, progress, addDay }
  }
  

}
</script>

<style scoped>
.date-cooked {
  border: none;
}
.image-form {
  margin: 0 auto;
  padding: 0;
}
.add-image {
  margin: 0 0 2px 0;
}
.add-image > div {
  color: inherit;
}
progress {
  margin-top: 2px;
}
.preview {
  display: inline-flex;
}
.preview-img {
  width: 70px;
  padding-top: 20px;
  margin: 5px;
  border-radius: 10%;
}
.submit-btn {
  display: flex;
  margin: 40px 0px 10px 10px;
}
</style>