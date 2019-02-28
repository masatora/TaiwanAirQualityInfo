<template>
  <div id="app">
    <TaiwanMap ref="TaiwanMap" />
  </div>
</template>

<script>
import TaiwanMap from './components/TaiwanMap.vue'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    TaiwanMap
  }
}
</script>

<style lang="stylus">
html, body, #app
  height: 100%
</style>
