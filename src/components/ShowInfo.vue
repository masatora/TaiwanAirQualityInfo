<template>
  <div id="info">
    <div id="info_head">
      <p>{{publishTime}}</p>
      <h3 @click.prevent="showBarChart(county)" v-if="county !== ''">
        <fa icon="chart-bar" />&nbsp;
        <b>{{county}}空氣品質AQI</b>
      </h3>
      <h3 v-else>
        <fa icon="search-location" />&nbsp;
        <b>各地空氣品質AQI</b>
      </h3>
    </div>
    <div id="info_body" :class="{hide: $parent.isHideFeature.showInfo}">
      <ul>
        <li v-for="(value, index) in countyData" :key="index">
          <div :class="['info_site', $parent.$parent.getColor(value.AQI)]" @click="$set(isHide, index, !isHide[index])">
            <div class="info_left">
              <p class="info_site_name">{{value.SiteName}}</p>
              <p class="info_status">{{value.Status}}</p>
            </div>
            <div class="info_right">
              <p class="info_value">{{value.AQI || 0}}</p>
            </div>
          </div>
          <div :class="['more_info', {hide: isHide[index]}]">
            <div>
              <span>空氣污染指標物</span>
              <span>{{value.Pollutant || '無'}}</span>
            </div>
            <div>
              <span>懸浮微粒(μg/m3)</span>
              <span>{{value.PM10}}</span>
            </div>
            <div>
              <span>懸浮微粒移動平均值(μg/m3)</span>
              <span>{{value.PM10_AVG}}</span>
            </div>
            <div>
              <span>細懸浮微粒(μg/m3)</span>
              <span>{{value['PM2.5']}}</span>
            </div>
            <div>
              <span>細懸浮微粒移動平均值(μg/m3)</span>
              <span>{{value['PM2.5_AVG']}}</span>
            </div>
            <div>
              <span>一氧化碳(ppm)</span>
              <span>{{value.CO}}</span>
            </div>
            <div>
              <span>一氧化碳8小時移動平均(ppm)</span>
              <span>{{value.CO_8hr}}</span>
            </div>
            <div>
              <span>一氧化氮(ppb)</span>
              <span>{{value.NO}}</span>
            </div>
            <div>
              <span>二氧化氮(ppb)</span>
              <span>{{value.NO2}}</span>
            </div>
            <div>
              <span>氮氧化物(ppb)</span>
              <span>{{value.NOx}}</span>
            </div>
            <div>
              <span>二氧化硫(ppb)</span>
              <span>{{value.SO2}}</span>
            </div>
            <div>
              <span>二氧化硫移動平均值(ppb)</span>
              <span>{{value.SO2_AVG}}</span>
            </div>
            <div>
              <span>臭氧(ppb)</span>
              <span>{{value.O3}}</span>
            </div>
            <div>
              <span>臭氧8小時移動平均(ppb)</span>
              <span>{{value.O3_8hr}}</span>
            </div>
            <div>
              <span>風速(m/sec)</span>
              <span>{{value.WindSpeed}}</span>
            </div>
            <div>
              <span>風向(degrees)</span>
              <span>{{value.WindDirec}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowInfo',
  data() {
    return {
      isHide: [],
      publishTime: '',
      county: '',
      countyData: []
    }
  },
  methods: {
    showBarChart(county) {
      let parent = this.$parent
      let barChart = parent.$refs.BarChart

      parent.setIsHideFeature()
      barChart.drawChart(county)
    },
    updateComponent(data) {
      if (data !== undefined) {
        this.isHide = data.map(() => true)
        this.publishTime = data[0].PublishTime
        this.county = data[0].County
        this.countyData = data
      } else {
        this.isHide = {}
        this.publishTime = ''
        this.county = ''
        this.countyData = []
      }
    }
  }
}
</script>

<style lang="stylus">
#info
  margin: 10px auto
  width: 370px
  padding: 6px 8px
  background: white
  border-radius: 5px
  box-shadow: 3px 3px 3px #777777

  #info_head
    width: 100%
    min-width: 284px
    border-bottom: 8px solid #aaaaaa
    border-radius: 2px

    p
      text-align: center
      line-height: 12px
      font-size: 12px
    h3
      margin: 0 0 5px
      line-height: 56px
      text-align: center
      color: #777777

    h3:hover
      cursor: pointer
      background-color: #f1f1f1

  #info_body
    width: 100%
    min-width: 284px

    ul 
      display: inline
      margin: 0
      padding: 0
      list-style-type: none

    li
      margin: 3px 0
      padding: 5px 5px
      border-bottom: 3px dashed #aaaaaa

    .info_site:hover
      cursor: pointer
      background-color: #f1f1f1

    .info_site
      clear: both
      width: 100%
      height: 70px
      border-radius: 3px

      .info_left
        float: left
        width: 50%
        height: 70px
        border-right: 1px solid #aaaaaa

        .info_site_name
          display: block
          text-align: center
          font-size: 20px
          text-overflow: ellipsis
          white-space: nowrap
          overflow: hidden

        .info_status
          display: block
          text-align: center

      .info_right
        float: left
        width: 50%
        height: 70px
        border-left: 1px solid #aaaaaa

        .info_value
          text-align: center
          font-size: 50px
          font-weight: bolder

    .more_info
      padding: 5px
      width: 100%
      min-width: 284px

      div
        margin: 5px 0
        border-bottom: 1px solid #aaaaaa

        span:nth-child(1)
          display: inline-block
          width: 80%
          min-width: 225px
          color: #555555
        span:nth-child(2)
          display: inline-block
          width: 10%
          min-width: 45px
          color: #555555
          text-align: center
          font-weight: bolder

      h6
        margin: 5px 0
        border-bottom: 1px solid #aaaaaa

        span:nth-child(1)
          display: inline-block
          width: 70%
          color: #555555

        span:nth-child(2)
          display: inline-block
          width: 30%
          color: #555555
          text-align: center
          font-weight: bolder

.gray 
  color: gray

.green
  color: green

.yellow
  color: #ffbb00

.darkOrange
  color: darkOrange

.red
  color: red

.purple
  color: purple

.darkred
  color: darkred

.hide 
  display: none
</style>