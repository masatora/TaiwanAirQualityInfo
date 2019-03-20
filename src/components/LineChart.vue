<template>
  <div class="row">
    <div id="line_chart" class="col-xs-12 col-sm-12 col-md-11">
      <div id="line_chart_head">
        <div class="row" @click="$parent.setIsHideFeature('lineChart')">
          <span class="col-xs-2 col-sm-2 col-md-2">
            <q-icon name="mdi-chart-areaspline" />
          </span>
          <span class="col-xs-10 col-sm-10 col-md-10">
            <b>{{siteName}}每日監測資料</b>
          </span>
        </div>
      </div>
      <div id="line_chart_body" :class="{hide: $parent.isHideFeature.lineChart}">
        <div id="main_line_chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import jsonp from 'jsonp'
import * as Plotly from 'plotly.js-dist'
import { map, pluck, filter, prop, sort, descend } from 'ramda'

export default {
  name: 'LineChart',
  data () {
    return {
      siteName: '',
      daily: []
    }
  },
  methods: {
    showLineChart (siteName, substance) {
      const _this = this

      this.siteName = siteName
      this.$parent.setIsHideFeature('lineChart')
      this.$nextTick(() => {
        _this.drawChart(siteName, substance)
      })
    },
    _getDailyJsonData () {
      const _this = this

      return new Promise((resolve, reject) => {
        if (_this.daily.length === 0) {
          this.$q.loading.show()
          jsonp('https://opendata.epa.gov.tw/api/v1/ATM00679?$skip=0&$top=1000&$format=json', null, (err, res) => {
            if (err) {
              reject(err)
            } else {
              _this.daily = res
              resolve(res)
            }
            this.$q.loading.hide()
          })
        } else {
          resolve(_this.daily)
        }
      })
    },
    drawChart (siteName, substance) {
      this._getDailyJsonData().then(res => {
        if (res.length > 0) {
          let siteData = filter(d => d.SiteName === siteName)(res)
          let xData = pluck('MonitorDate')(siteData)
          let yData = [
            { '空氣品質指標': [pluck('AQI')(siteData), 'AQI'] },
            { '一氧化碳副指標': [pluck('COSubIndex')(siteData), 'CO'] },
            { '二氧化氮副指標': [pluck('NO2SubIndex')(siteData), 'NO2'] },
            { '二氧化硫副指標': [pluck('SO2SubIndex')(siteData), 'SO2'] },
            { '臭氧副指標': [pluck('O3SubIndex')(siteData), 'O3'] },
            { '臭氧8小時副指標': [pluck('O38SubIndex')(siteData), 'O3_AVG'] },
            { '懸浮微粒副指標': [pluck('PM10SubIndex')(siteData), 'PM10'] },
            { '細懸浮微粒副指標': [pluck('PM25SubIndex')(siteData), 'PM2.5'] }
          ]
          let data = yData.map(y => {
            let values = Object.values(y)[0]
            return {
              x: xData,
              y: map(d => d || 0)(values[0]),
              fill: 'tozeroy',
              line: { shape: 'spline' },
              marker: { opacity: 0.8, size: 14 },
              type: 'scatter',
              visible: substance === values[1],
              connectgaps: true,
              name: Object.keys(y)[0]
            }
          })
          const axisStyle = {
            linecolor: 'rgb(204,204,204)',
            linewidth: 2,
            ticks: 'outside',
            tickcolor: 'rgb(204,204,204)',
            tickwidth: 2,
            ticklen: 5,
            tickfont: {
              family: 'Arial',
              size: 12,
              color: 'rgb(82, 82, 82)'
            }
          }
          let layout = {
            showlegend: false,
            autosize: true,
            margin: { l: 30, r: 30, b: 45, t: 10 },
            xaxis: Object.assign({}, axisStyle, {
              autotick: false,
              tickformat: '%m/%d'
            }),
            yaxis: axisStyle,
            updatemenus: [{
              direction: 'top',
              showactive: true,
              x: 0.5,
              xanchor: 'auto',
              y: 1.15,
              yanchor: 'auto',
              buttons: sort(descend(prop('visible')))(data).map((d, i) => {
                return {
                  method: 'restyle',
                  label: d.name,
                  args: [{ visible: [0, 1, 2, 3, 4, 5, 6, 7].map(v => v === i) }]
                }
              })
            }]
          }
          let config = { responsive: true, displayModeBar: false, scrollZoom: true }
          Plotly.newPlot('main_line_chart', data, layout, config)
        }
      }).catch(err => {
        alert('Service Unavailable Temporarily')
        console.log(err)
      })
    }
  }
}
</script>

<style lang="stylus">
#line_chart
  margin: 10px auto
  height: auto
  padding: 6px 8px
  background: white
  border-radius: 5px
  overflow-x: hidden
  box-shadow: 3px 3px 3px #777777

  #line_chart_head
    border-bottom: 8px solid #aaaaaa
    border-radius: 2px

    div
      padding: 5px

      span
        font-size: 24px
        color: #777777
        text-align: center

    div:hover
      cursor: pointer
      background-color: #f1f1f1

  #line_chart_body
    width: 100%

    #main_line_chart
      width: 100%

</style>
