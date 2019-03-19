<template>
  <div class="row">
    <div id="info" class="col-xs-12 col-sm-12 col-md-11">
      <div id="info_head">
        <p>{{publishTime}}</p>
        <div class="row" @click="$parent.setIsHideFeature('showInfo')">
          <span class="col-xs-2 col-sm-2 col-md-2">
            <q-icon name="mdi-map-search" />
          </span>
          <span class="col-xs-10 col-sm-10 col-md-10">
            <b>{{county || '各地'}}AQI資訊</b>
          </span>
        </div>
      </div>
      <div id="info_body" :class="{hide: $parent.isHideFeature.showInfo}">
        <ul class="sites_container">
          <li class="site_status" v-for="(value, index) in countyData" :key="index">
            <div :class="['info_site', 'row', $parent.$parent.getColor(value.AQI)]" @click="$set(isHide, index, !isHide[index])">
              <div class="info_left col-xs-6 col-sm-6 col-md-6">
                <p class="info_site_name">{{value.SiteName}}</p>
                <p class="info_status">{{value.Status}}</p>
              </div>
              <div class="info_right col-xs-6 col-sm-6 col-md-6">
                <q-knob class="info_value" :value="value.AQI * 1" size="70px" :min="0" :max="500" readonly />
              </div>
            </div>
            <div :class="['more_info', {hide: isHide[index]}]">
              <q-list v-for="(mean, substance, idx) in keyTranslate" :key="idx" class="row" highlight dense no-border>
                <q-item class="col-xs-12 col-sm-12 col-md-12">
                  <q-item-side>
                    <q-btn v-if="['CO', 'NO2', 'SO2', 'O3', 'O3_AVG', 'PM10', 'PM2.5'].indexOf(substance) !== -1"
                            @click="$parent.$refs.LineChart.showLineChart(value.SiteName, substance)"
                            icon="mdi-chart-areaspline"
                            size="25px"
                            color="primary" flat round dense class="test" />
                    <q-btn v-else icon="mdi-cancel" size="25px" color="negative" flat round dense disable />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile label><b>{{mean}}</b></q-item-tile>
                    <hr class="hr_style"/>
                    <q-item-tile sublabel>{{value[substance] || '無'}}</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowInfo',
  data () {
    return {
      isHide: [],
      publishTime: '',
      county: '',
      countyData: [],
      keyTranslate: {
        Pollutant: '空氣污染指標物',
        PM10: '懸浮微粒(μg/m3)',
        PM10_AVG: '懸浮微粒移動平均值(μg/m3)',
        'PM2.5': '細懸浮微粒(μg/m3)',
        'PM2.5_AVG': '細懸浮微粒移動平均值(μg/m3)',
        CO: '一氧化碳(ppm)',
        CO_8hr: '一氧化碳8小時移動平均(ppm)',
        NO: '一氧化氮(ppb)',
        NO2: '二氧化氮(ppb)',
        NOx: '氮氧化物(ppb)',
        SO2: '二氧化硫(ppb)',
        SO2_AVG: '二氧化硫移動平均值(ppb)',
        O3: '臭氧(ppb)',
        O3_AVG: '臭氧8小時移動平均(ppb)',
        WindSpeed: '風速(m/sec)',
        WindDerec: '風向(degrees)'
      }
    }
  },
  methods: {
    updateComponent (data) {
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
  padding: 6px 8px
  background: white
  border-radius: 5px
  box-shadow: 3px 3px 3px #777777

  #info_head
    border-bottom: 8px solid #aaaaaa
    border-radius: 2px

    p:nth-child(1)
      text-align: center
      line-height: 12px
      font-size: 12px

    div
      padding: 5px

      span
        font-size: 24px
        color: #777777
        text-align: center

    div:hover
      cursor: pointer
      background-color: #f1f1f1

  #info_body
    .sites_container
      display: inline
      margin: 0
      padding: 0
      list-style-type: none

    .site_status
      margin: 3px 0
      padding: 5px 5px
      border-bottom: 3px dashed #aaaaaa

    .info_site:hover
      cursor: pointer
      background-color: #f1f1f1

    .info_site
      clear: both
      height: 70px
      border-radius: 3px

      .info_left
        float: left
        height: 70px
        border-right: 1px solid #aaaaaa

        .info_site_name
          display: block
          text-align: center
          font-size: 24px
          text-overflow: ellipsis
          white-space: nowrap
          overflow: hidden

        .info_status
          font-size: 12px
          display: block
          text-align: center

      .info_right
        float: left
        height: 70px
        text-align: center
        border-left: 1px solid #aaaaaa

        .info_value
          font-size: 32px
          font-weight: bolder

    .more_info
      padding: 5px

      .hr_style
        border: 0
        height: 1px
        background: #333
        background-image: linear-gradient(to right, #ccc, #333, #ccc)

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

.hidden
  visibility: hidden

</style>
