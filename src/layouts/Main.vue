<template>
  <div id="main">
    <TaiwanMap ref="TaiwanMap" />
  </div>
</template>

<script>
import TaiwanMap from '../components/TaiwanMap.vue'

export default {
  name: 'Main',
  components: {
    TaiwanMap
  }
}
</script>

<style lang="stylus">
html, body, #q-app, #main
  width: 100%
  height: 100%

</style>
