<template>
  <div class="row">
    <div id="MapFeatures" class="col-xs-12 col-sm-12 col-md-4 absolute-bottom-right">
      <div id="feature_touch_pan" v-touch-pan.vertical="_featureTouchPanHandler" v-if="isShowPan">
        <q-icon name="mdi-minus" size="30px"/>
      </div>
      <ShowInfo ref="ShowInfo" />
      <BarChart ref="BarChart" />
      <LineChart ref="LineChart" />
    </div>
  </div>
</template>

<script>
import ShowInfo from './ShowInfo.vue'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'

export default {
  name: 'MapFeatures',
  components: {
    ShowInfo,
    BarChart,
    LineChart
  },
  data () {
    return {
      isShowPan: screen.width < 426,
      isAnimation: false,
      isHideFeature: {
        showInfo: false,
        barChart: true,
        lineChart: true
      }
    }
  },
  methods: {
    setIsHideFeature (key) {
      let obj = {
        showInfo: true,
        barChart: true,
        lineChart: true
      }
      if (key === 'showInfo') {
        obj.showInfo = !this.isHideFeature.showInfo
      } else if (key === 'barChart') {
        obj.barChart = !this.isHideFeature.barChart
      } else {
        obj.lineChart = !this.isHideFeature.lineChart
      }
      this.isHideFeature = Object.assign({}, this.isHideFeature, obj)
    },
    defaultIsHideFeature () {
      this.isHideFeature = Object.assign({}, this.isHideFeature, {
        showInfo: false,
        barChart: true,
        lineChart: true
      })
    },
    _featureTouchPanHandler (obj) {
      let mf = document.getElementById('MapFeatures')
      let verticalHeight = screen.height - obj.position.top

      if (obj.direction === 'up') {
        mf.style.height = (obj.isFinal ? screen.height : verticalHeight) + 'px'
      } else {
        mf.style.height = (obj.isFinal ? '30%' : verticalHeight + 'px')
      }
      mf.scrollTop = 0
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

  #feature_touch_pan
    width: 100%
    height: 30px
    background-color: white
    color: #777777
    text-align: center

::-webkit-scrollbar
  width: 0
  height: 0

</style>
