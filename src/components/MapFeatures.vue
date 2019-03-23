<template>
  <div class="row">
    <div id="MapFeatures"
         class="col-xs-12 col-sm-12 col-md-4 absolute-bottom-right"
         :style="mfStyle">
      <div id="feature_touch_pan" v-touch-pan.vertical.prevent="_featureTouchPanHandler" v-if="isShowPan">
        <q-icon name="mdi-minus" size="30px"/>
        <p>{{pText}}</p>
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
      isHideFeature: {
        showInfo: false,
        barChart: true,
        lineChart: true
      },
      pText: '上下捲動此軸以顯示內容',
      mfStyle: {
        height: '',
        bottom: '',
        overflowY: ''
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
      this.$set(this.mfStyle, 'overflowY', 'hidden')
      if (obj.direction === 'up') {
        if (obj.position.top < (window.outerHeight - 160)) {
          this.pText = '向下捲動此軸以隱藏內容'
          this.$set(this.mfStyle, 'overflowY', 'auto')
          this.$set(this.mfStyle, 'bottom', (obj.isFinal ? window.outerHeight : (window.outerHeight - obj.position.top)) + 'px')
        } else {
          this.pText = '上下捲動此軸以顯示內容'
          this.$set(this.mfStyle, 'bottom', '160px')
        }
      } else {
        if (obj.position.top > (window.outerHeight - 160)) {
          this.pText = '向上捲動此軸以顯示內容'
          this.$set(this.mfStyle, 'bottom', '60px')
        } else {
          this.pText = '上下捲動此軸以顯示內容'
          this.$set(this.mfStyle, 'bottom', (obj.isFinal ? '160px' : (window.outerHeight - obj.position.top) + 'px'))
        }
      }
    }
  },
  mounted () {
    if (screen.width < 425) {
      this.$set(this.mfStyle, 'height', window.outerHeight + 'px')
    }
  }
}
</script>

<style lang="stylus">
@media screen and (max-width: 425px)
  #MapFeatures
    position: relative
    bottom: 160px

@media screen and (min-width: 768px)
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
    height: 60px
    background-color: white
    color: #777777
    text-align: center

    p
      margin: 0

::-webkit-scrollbar
  width: 0
  height: 0

</style>
