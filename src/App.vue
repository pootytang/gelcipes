<template>
  <div id="nav">
    <Navbar />
  </div>
  <div id="content">
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/base/Navbar.vue'
export default {
  name: 'App',
  components: { Navbar }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
