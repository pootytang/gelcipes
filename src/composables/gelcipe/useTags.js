import { ref } from "vue";

const useTags = (recipes) => {
  const tags = ref([])
  const tagSet = new Set()

  recipes.forEach(recipe => {
    recipe.hashTags.forEach(tag => tagSet.add(tag))
  });
  tags.value = [...tagSet]

  return { tags }
}


export default useTags