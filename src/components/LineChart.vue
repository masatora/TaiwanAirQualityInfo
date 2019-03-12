<template>
  <div id="line_chart">
    <div id="line_chart_head">
      <h3>
        <b></b>
      </h3>
    </div>
    <div id="line_chart_body">
      <div id="main_line_chart">
      </div>
    </div>
  </div>
</template>

<script>
import daily from '../assets/daily.json'
import * as Plotly from 'plotly.js-dist'
import { map, pluck, pipe, filter, sort, descend, ascend, prop } from 'ramda'

export default {
  name: 'LineChart',
  mounted() {
    let siteData = filter(d => d.SiteName === '富貴角')(daily)
    const xData = pluck('MonitorDate')(siteData)
    const yData = [
      pluck('AQI')(siteData),
      pluck('COSubIndex')(siteData),
      pluck('NO2SubIndex')(siteData),
      pluck('O3SubIndex')(siteData),
      pluck('O38SubIndex')(siteData),
      pluck('PM10SubIndex')(siteData),
      pluck('PM25SubIndex')(siteData),
      pluck('SO2SubIndex')(siteData)
    ]

    console.log(xData, yData, siteData)
    let data = [{
        x: xData,
        y: yData[0],
        name: '空氣品質指標',
        fill: 'tozeroy',
        line: {shape: 'spline'},
        type: 'scatter'
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
        direction: 'left',
        showactive: true,
        type: 'buttons',
        x: 0,
        xanchor: 'auto',
        y: 1.15,
        yanchor: 'auto',
        buttons: [{
          args: [{y: [yData[0]]}],
          label: '空氣品質指標',
          method: 'restyle'
        }, {
          args: [{y: [yData[1]]}],
          label: '一氧化碳副指標',
          method: 'restyle'
        }, {
          args: [{y: [yData[2]]}],
          label:'二氧化氮副指標',
          method:'restyle'
        }, {
          args: [{y: [yData[3]]}],
          label:'臭氧副指標',
          method:'restyle'
        }, {
          args: [{y: [yData[4]]}],
          label:'臭氧8小時副指標',
          method:'restyle'
        }, {
          args: [{y: [yData[5]]}],
          label:'懸浮微粒副指標',
          method:'restyle'
        }, {
          args: [{y: [yData[6]]}],
          label:'細懸浮微粒副指標',
          method:'restyle'
        }, {
          args: [{y: [yData[7]]}],
          label:'二氧化硫副指標',
          method:'restyle'
        }]
      }]
    }
    let config = {responsive: true, displayModeBar: false, scrollZoom: true}
    Plotly.newPlot('main_line_chart', data, layout, config);
  }
}
</script>

<style lang="stylus">
#line_chart
  margin: 10px auto
  width: 370px
  height: auto
  padding: 6px 8px
  background: white
  border-radius: 5px
  overflow-x: hidden
  box-shadow: 3px 3px 3px #777777

  #line_chart_head
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

  #line_chart_body
    width: 370px

    #main_line_chart
      width: 370px
      min-width: 340px
</style>