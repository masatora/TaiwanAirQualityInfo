<template>
  <div id="bar_chart">
    <div id="bar_chart_head">
      <h3 @click.prevent="$parent.setIsHideFeature()">
        <b>{{county}}AQI統計圖</b>
      </h3>
    </div>
    <div id="bar_chart_body" :class="{hide: $parent.isHideFeature.barChart}">
      <div id="main_chart">
        <StatusInfo ref="StatusInfo" />
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
  data() {
    return {
      county: ''
    }
  },
  methods: {
    _getAscendArgs(countyData) {
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
    _getDescendArgs(countyData) {
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
    _getMarkerArgs(value) {
      return {
        color: map(this.$parent.$parent.getColor)(value),
        opacity: 0.6,
        line: {width: 1.5}
      }
    },
    drawChart(county) {
      if (county !== '' && this.county !== county) {
        let aqiData = this.$parent.$parent.aqiData
        let countyData = filter(d => d.County === county)(aqiData)
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
          margin: {
            l: 30,
            r: 30,
            b: 35,
            t: 10
          },
          updatemenus: [{
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
              label: '由小至大',
              method: 'restyle'
            }, {
              args: this._getDescendArgs(countyData),
              label:'由大至小',
              method:'restyle'
            }],
              direction: 'left',
              showactive: true,
              type: 'buttons',
              x: 0,
              xanchor: 'auto',
              y: 1.15,
              yanchor: 'auto'
          }]
        }
        let config = {responsive: true, displayModeBar: false, scrollZoom: true}
        Plotly.newPlot('main_chart', data, layout, config)
        this.county = county
        this.$refs.StatusInfo.init('main_chart')
      }
    }
  }
}
</script>

<style lang="stylus">
#bar_chart
  margin: 10px auto
  width: 370px
  height: auto
  padding: 6px 8px
  background: white
  border-radius: 5px
  overflow-x: hidden
  box-shadow: 3px 3px 3px #777777

  #bar_chart_head
    border-bottom: 8px solid #aaaaaa
    border-radius: 2px

    h3
      margin: 0 0 5px
      line-height: 56px
      text-align: center
      color: #777777

    h3:hover
      cursor: pointer
      background-color: #f1f1f1

  #bar_chart_body
    width: 370px

    #main_chart
      width: 370px
      min-width: 340px
</style>