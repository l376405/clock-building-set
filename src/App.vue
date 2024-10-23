<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import { useTitle } from '@vueuse/core'

// 引入組件
import Home from './views/Home.vue'

export default {
  name: 'App',
  components: {
    Home
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
  margin-top: 60px;
}
</style>
