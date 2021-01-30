<template>
<div class="tag-cloud">
  <div class="tag-grey" v-for="tag in tags" :key="tag" @click="handleTagClick(tag)">
    #{{ tag }}
  </div>
  <button v-if="clear" @click="clearFilter">clear filter</button>
</div>
</template>

<script>
import useTags from '@/composables/gelcipe/useTags'
import { ref } from 'vue'

export default {
  name: 'TagCloud',
  props: ['recipes'],
  emits: ['tag-clicked'],
  components: {},
  setup(props, { emit }) {
    const { tags } = useTags(props.recipes)
    const clear = ref(false)

    const handleTagClick = (tag) => {
      clear.value = true
      emit('tag-clicked', tag)
    }

    const clearFilter = () => {
      console.log('TagCloud -> ClearFilter: Clearing the Filter')
      clear.value = false
      emit('tag-clicked', clear.value)
    }

    return { tags, handleTagClick, clearFilter, clear }
  }
}
</script>

<style scoped>
/* .tag-cloud {
  border: 1px dashed black;
  background-color: linen;
} */
</style>