<template>
  <div class="row">
    <div id="toggleBtn" class="col-md-4 absolute-right" v-if="isNotPhone">
      <q-btn :icon="tbIcon"
             size="16px"
             color="white"
             text-color="black"
             @click="_toggleMapFeatures"
             :style="{ right: tbRight }"
             dense />
    </div>
    <div id="MapFeatures"
         class="col-xs-12 col-sm-12 col-md-4 absolute-bottom-right"
         :style="mfStyle">
      <div id="feature_touch_pan" v-touch-pan.vertical.prevent="_featureTouchPanHandler" v-if="isShowPan">
        <q-icon name="mdi-minus" size="30px"/>
        <p>{{pText}}</p>
      </div>
      <SearchKeyWord ref="SearchKeyWord" v-if="isNotPhone"/>
      <ShowInfo ref="ShowInfo" />
      <BarChart ref="BarChart" />
      <LineChart ref="LineChart" />
    </div>
  </div>
</template>

<script>
import SearchKeyWord from './SearchKeyWord.vue'
import ShowInfo from './ShowInfo.vue'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'

export default {
  name: 'MapFeatures',
  components: {
    SearchKeyWord,
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
        lineChart: true,
        searchKeyWord: true
      },
      isToggleBtn: false,
      isNotPhone: true,
      pText: '上下捲動此軸以顯示或隱藏內容',
      tbIcon: 'mdi-eye-off',
      tbRight: 0,
      mfStyle: {
        right: '',
        height: '',
        bottom: '',
        overflowY: ''
      }
    }
  },
  methods: {
    setIsHideFeature (key, bool) {
      let obj = {
        showInfo: true,
        barChart: true,
        lineChart: true,
        searchKeyWord: true
      }
      if (key === 'showInfo') {
        obj.showInfo = (bool !== undefined ? bool : !this.isHideFeature.showInfo)
      } else if (key === 'barChart') {
        obj.barChart = (bool !== undefined ? bool : !this.isHideFeature.barChart)
      } else if (key === 'lineChart') {
        obj.lineChart = (bool !== undefined ? bool : !this.isHideFeature.lineChart)
      } else {
        obj.searchKeyWord = (bool !== undefined ? bool : !this.isHideFeature.searchKeyWord)
      }
      this.isHideFeature = Object.assign({}, this.isHideFeature, obj)
    },
    defaultIsHideFeature () {
      this.isHideFeature = Object.assign({}, this.isHideFeature, {
        showInfo: false,
        barChart: true,
        lineChart: true,
        searchKeyWord: true
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
          this.pText = '上下捲動此軸以顯示或隱藏內容'
          this.$set(this.mfStyle, 'bottom', '160px')
        }
      } else {
        if (obj.position.top > (window.outerHeight - 160)) {
          this.pText = '向上捲動此軸以顯示內容'
          this.$set(this.mfStyle, 'bottom', '60px')
        } else {
          this.pText = '上下捲動此軸以顯示或隱藏內容'
          this.$set(this.mfStyle, 'bottom', (obj.isFinal ? '160px' : (window.outerHeight - obj.position.top) + 'px'))
        }
      }
    },
    _toggleMapFeatures (e) {
      let mf = document.getElementById('MapFeatures')

      if (e.type === 'click') {
        if (this.isToggleBtn) {
          this.tbRight = 0
          this.tbIcon = 'mdi-eye-off'
          this.$set(this.mfStyle, 'right', 0)
        } else {
          let w = mf.offsetWidth * -1
          this.tbRight = w + 'px'
          this.tbIcon = 'mdi-eye'
          this.$set(this.mfStyle, 'right', w + 'px')
        }
        this.isToggleBtn = !this.isToggleBtn
      } else {
        if (this.isToggleBtn) {
          let w = mf.offsetWidth * -1
          this.tbRight = w + 'px'
          this.$set(this.mfStyle, 'right', w + 'px')
        } else {
          this.tbRight = 0
          this.$set(this.mfStyle, 'right', 0)
        }
      }
    }
  },
  mounted () {
    if (screen.width < 425) {
      this.isNotPhone = false
      this.$set(this.mfStyle, 'height', window.outerHeight + 'px')
    }
    window.onresize = (e) => {
      this._toggleMapFeatures(e)
    }
  }
}
</script>

<style lang="stylus">
@media screen and (max-width: 426px)
  #MapFeatures
    position: relative
    bottom: 160px
    border-top: 1px solid #aaaaaa

@media screen and (min-width: 768px)
  #MapFeatures
    position: absolute
    border-left: 1px solid #aaaaaa
    height: 100%
    transition-duration: 0.19s
    transition-timing-function: linear

#MapFeatures
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

#toggleBtn
  position: absolute
  top: 10px
  right: 30px
  z-index: 1000

::-webkit-scrollbar
  width: 0
  height: 0

</style>
