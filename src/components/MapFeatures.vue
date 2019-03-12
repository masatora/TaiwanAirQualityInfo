<template>
  <div class="row">
    <div id="MapFeatures" class="col-xs-12 col-sm-12 col-md-4 absolute-bottom-right">
      <ShowInfo ref="ShowInfo" />
      <BarChart ref="BarChart" />
    </div>
  </div>
</template>

<script>
import ShowInfo from './ShowInfo.vue'
import BarChart from './BarChart.vue'

export default {
  name: 'MapFeatures',
  components: {
    ShowInfo,
    BarChart
  },
  data () {
    return {
      isHideFeature: {
        showInfo: false,
        barChart: true
      }
    }
  },
  methods: {
    setIsHideFeature () {
      let obj = {
        showInfo: !this.isHideFeature.showInfo,
        barChart: !this.isHideFeature.barChart
      }

      this.isHideFeature = Object.assign({}, this.isHideFeature, obj)
    },
    defaultIsHideFeature () {
      this.isHideFeature = Object.assign({}, this.isHideFeature, {
        showInfo: false,
        barChart: true
      })
    }
  }
}
</script>

<style lang="stylus">
@media (min-width: 320px), (max-width: 425px)
  #MapFeatures
    height: 30%

@media (min-width: 768px)
  #MapFeatures
    height: 100%

#MapFeatures
  border: 2px solid #aaaaaa
  background-color: #dddddd
  overflow-x: hidden
  overflow-y: auto
  z-index: 1000

::-webkit-scrollbar
  width: 6px
  height: 6px
  background-color: #F5F5F5

::-webkit-scrollbar-track
  -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 50px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  border-radius: 50px
  background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.44, rgb(122,153,217)), color-stop(0.72, rgb(73,125,189)), color-stop(0.86, rgb(28,58,148)))

</style>
