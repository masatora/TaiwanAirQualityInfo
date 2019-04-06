<template>
  <div class="row">
    <div id="bar_chart" class="col-xs-12 col-sm-12 col-md-12">
      <div id="bar_chart_head" @click="_showBarChart">
        <p>&nbsp;</p>
        <div class="row">
          <span class="col-xs-2 col-sm-2 col-md-2">
            <q-icon name="mdi-chart-bar" />
          </span>
          <span class="col-xs-10 col-sm-10 col-md-10">
            <b>{{county || '各地'}}AQI柱狀圖</b>
          </span>
        </div>
      </div>
      <div id="bar_chart_body" :class="{hide: $parent.isHideFeature.barChart}">
        <div id="main_bar_chart">
          <StatusInfo ref="StatusInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatusInfo from './StatusInfo.vue'
import * as Plotly from 'plotly.js-dist'
import { map, pluck, pipe, filter, sort, descend, ascend, prop } from 'ramda'

export default {
  name: 'BarChart',
  components: {
    StatusInfo
  },
  data () {
    return {
      county: ''
    }
  },
  methods: {
    _getAscendArgs (countyData) {
      let sortAQI = pipe(prop('AQI'), (s) => s * 1)
      let getAscendAQI = pipe(sort(ascend(sortAQI)), pluck('AQI'))
      let getAscendSiteName = pipe(sort(ascend(sortAQI)), pluck('SiteName'))
      let y = getAscendAQI(countyData)
      let x = getAscendSiteName(countyData)
      let args = [{
        y: [y],
        x: [x],
        text: [y],
        marker: this._getMarkerArgs(y),
        countyData: [sort(ascend(sortAQI))(countyData)]
      }]
      return args
    },
    _getDescendArgs (countyData) {
      let sortAQI = pipe(prop('AQI'), (s) => s * 1)
      let getDescendAQI = pipe(sort(descend(sortAQI)), pluck('AQI'))
      let getDescendSiteName = pipe(sort(descend(sortAQI)), pluck('SiteName'))
      let y = getDescendAQI(countyData)
      let x = getDescendSiteName(countyData)
      let args = [{
        y: [y],
        x: [x],
        text: [y],
        marker: this._getMarkerArgs(y),
        countyData: [sort(descend(sortAQI))(countyData)]
      }]
      return args
    },
    _getMarkerArgs (value) {
      return {
        color: map(this.$parent.$parent.getColor)(value),
        opacity: 0.6,
        line: { width: 1.5 }
      }
    },
    _showBarChart () {
      const _this = this

      this.$parent.setIsHideFeature('barChart')
      this.$nextTick(() => {
        _this.drawChart()
      })
    },
    drawChart () {
      if (this.county !== '') {
        let aqiData = this.$parent.$parent.aqiData
        let countyData = filter(d => d.County === this.county)(aqiData)
        let xValue = pluck('SiteName')(countyData)
        let yValue = pluck('AQI')(countyData)
        let data = [{
          x: xValue,
          y: yValue,
          type: 'bar',
          text: yValue,
          textposition: 'auto',
          hoverinfo: 'none',
          marker: this._getMarkerArgs(yValue),
          countyData
        }]
        let layout = {
          showlegend: false,
          autosize: true,
          margin: { l: 30, r: 30, b: 50, t: 10 },
          xaxis: { fixedrange: true },
          yaxis: { fixedrange: true },
          updatemenus: [{
            direction: 'left',
            showactive: true,
            type: 'buttons',
            x: 0,
            xanchor: 'auto',
            y: 1.15,
            yanchor: 'auto',
            buttons: [{
              args: [{
                x: [xValue],
                y: [yValue],
                text: [yValue],
                marker: [this._getMarkerArgs(yValue)]
              }],
              label: '預設排序',
              method: 'restyle'
            }, {
              args: this._getAscendArgs(countyData),
              label: '升冪',
              method: 'restyle'
            }, {
              args: this._getDescendArgs(countyData),
              label: '降冪',
              method: 'restyle'
            }]
          }]
        }

        let config = { responsive: true, displayModeBar: false, scrollZoom: false }
        Plotly.newPlot('main_bar_chart', data, layout, config)
        this.$refs.StatusInfo.init('main_bar_chart')
      }
    }
  }
}
</script>

<style lang="stylus">
#bar_chart
  margin: 10px auto
  height: auto
  padding: 0 0 1px 0
  overflow-x: hidden
  box-shadow: 3px 3px 3px #777777
  background-color: white

  #bar_chart_head
    border-bottom: 8px solid #aaaaaa
    background-color: #0b5bd5
    color: #fafafa

    p:nth-child(1)
      text-align: center
      line-height: 12px
      font-size: 12px

    div
      padding: 5px

      span
        font-size: 24px
        text-align: center

  #bar_chart_head:hover
      cursor: pointer
      background-color: #2075f4

  #bar_chart_body
    width: 100%

    #main_bar_chart
      width: 100%

</style>
