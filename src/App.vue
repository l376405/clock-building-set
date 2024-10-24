<template>
  <div id="app">
    <HomePage />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import { useTitle } from '@vueuse/core'

// 引入組件
import HomePage from './views/HomePage.vue'

export default {
  name: 'App',
  components: {
    HomePage
  },
  setup() {
    const title = useTitle('時鐘設置')
    return { title }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
</style>
