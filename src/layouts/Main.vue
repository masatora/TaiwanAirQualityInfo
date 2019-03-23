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
  position: fixed
  width: 100%
  height: 100%
  -webkit-touch-callout: none
  -webkit-user-select: none
  -khtml-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none
  overscroll-behavior-y: contain

</style>
