<template>
  <div class="row desktop-only">
    <div id="search_key_word" class="col-xs-12 col-sm-12 col-md-12">
      <div id="btn_wrap" @click.stop="Object.keys(spots).length > 0 ? $parent.setIsHideFeature('searchKeyWord') : $parent.setIsHideFeature('searchKeyWord', true)">
        <q-btn id="btn_style"
                icon="mdi-dots-horizontal"
                @click.stop="showFilterBtn()"
                flat dense />
      </div>
      <div class="row">
        <span id="map_marker" class="col-xs-2 col-sm-2 col-md-2">
          <q-icon name="mdi-map-marker" />
        </span>
        <span class="col-md-10" v-if="isHideFilter">
          <q-input
            v-model="inputValue"
            color="primary"
            float-label="輸入縣市或監測站名稱可顯示該地AQI"
            @input="searchSpot"
          />
        </span>
        <span class="col-md-10" v-else>
          <div class="row">
            <span class="col-md-6 selection_style" :class="{ hidden: isHideFilter }">
              <q-select
                v-model="selectParameter"
                :options="parameters"
                radio
                @input="inputValue = ''; $parent.setIsHideFeature('searchKeyWord', true)"
              />
            </span>
            <span class="col-md-3 selection_style" :class="{ hidden: isHideFilter }">
              <q-select
                v-model="selectSymbol"
                :options="symbols"
                radio
                @input="inputValue = ''; $parent.setIsHideFeature('searchKeyWord', true)"
              />
            </span>
            <span class="col-md-3">
              <q-input
                v-model="inputValue"
                color="primary"
                float-label="輸入適當值"
                @input="filterCondition"
              />
            </span>
          </div>
        </span>
      </div>
      <q-list id="filter_list" highlight :class="{ hidden: $parent.isHideFeature.searchKeyWord }">
        <q-item v-for="(value, key) in spots" :key="key">
          <q-item-main>
            {{value.County}}
          </q-item-main>
          <q-item-side>
            {{value.SiteName}}
          </q-item-side>
          <q-item-side>
            {{value[selectParameter]}}
          </q-item-side>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
/* eslint no-eval: 0 */
import { filter, project } from 'ramda'

export default {
  name: 'SearchKeyword',
  data () {
    return {
      spots: {},
      isHideFilter: true,
      inputValue: '',
      selectParameter: 'AQI',
      selectSymbol: '===',
      parameters: [
        { label: '空氣品質指標', sublabel: 'AQI', value: 'AQI' },
        { label: '空氣品質狀態', sublabel: 'Status', value: 'Status' },
        { label: '空氣污染指標物', sublabel: 'Pollutant', value: 'Pollutant' },
        { label: '縣市名稱', sublabel: 'County', value: 'County' },
        { label: '監測站名稱', sublabel: 'SiteName', value: 'SiteName' },
        { label: '懸浮微粒', sublabel: 'PM10', value: 'PM10' },
        { label: '懸浮微粒移動平均值', sublabel: 'PM10_AVG', value: 'PM10_AVG' },
        { label: '細懸浮微粒', sublabel: 'PM2.5', value: 'PM2.5' },
        { label: '細懸浮微粒移動平均值', sublabel: 'PM2.5_AVG', value: 'PM2.5_AVG' },
        { label: '一氧化碳', sublabel: 'CO', value: 'CO' },
        { label: '一氧化碳8小時移動平均', sublabel: 'CO_8hr', value: 'CO_8hr' },
        { label: '一氧化氮', sublabel: 'NO', value: 'NO' },
        { label: '二氧化氮', sublabel: 'NO2', value: 'NO2' },
        { label: '氮氧化物', sublabel: 'NOx', value: 'NOx' },
        { label: '二氧化硫', sublabel: 'SO2', value: 'SO2' },
        { label: '二氧化硫移動平均值', sublabel: 'SO2_AVG', value: 'SO2_AVG' },
        { label: '臭氧', sublabel: 'O3', value: 'O3' },
        { label: '臭氧移動平均值', sublabel: 'O3_AVG', value: 'O3_AVG' },
        { label: '風速', sublabel: 'WindSpeed', value: 'WindSpeed' },
        { label: '風向', sublabel: 'WindDecrec', value: 'WindDecrec' }
      ]
    }
  },
  computed: {
    isIntParameter () {
      return (['County', 'Pollutant', 'SiteName', 'Status'].indexOf(this.selectParameter) === -1)
    },
    symbols () {
      let selectSymbols = [
        {
          label: '等於',
          value: '==='
        },
        {
          label: '不等於',
          value: '!=='
        }
      ]
      if (this.isIntParameter) {
        selectSymbols = selectSymbols.concat([
          {
            label: '大於',
            value: '>'
          },
          {
            label: '小於',
            value: '<'
          }
        ])
      }
      return selectSymbols
    }
  },
  methods: {
    searchSpot (keyword) {
      if (keyword !== '') {
        let reg = new RegExp(keyword + '+')
        let spots = filter(d => reg.test(d.County) || reg.test(d.SiteName))(this.$parent.$parent.aqiData)

        if (spots.length > 0) {
          this.spots = project(['County', 'SiteName', 'AQI'])(spots)
          this.$parent.setIsHideFeature('searchKeyWord', false)
        } else {
          this.$parent.setIsHideFeature('searchKeyWord', true)
        }
      } else {
        this.spots = {}
        this.$parent.setIsHideFeature('searchKeyWord', true)
      }
    },
    filterCondition (keyword) {
      if (keyword !== '') {
        let code = ''
        let spots = []

        if (this.isIntParameter) {
          code = '(d["' + this.selectParameter + '"] * 1) ' + this.selectSymbol + ' (keyword * 1)'
        } else {
          code = 'd["' + this.selectParameter + '"] ' + this.selectSymbol + ' keyword'
        }

        spots = filter(d => eval(code))(this.$parent.$parent.aqiData)

        if (spots.length > 0) {
          this.spots = project(['County', 'SiteName', this.selectParameter])(spots)
          this.$parent.setIsHideFeature('searchKeyWord', false)
        } else {
          this.$parent.setIsHideFeature('searchKeyWord', true)
        }
      } else {
        this.spots = {}
        this.$parent.setIsHideFeature('searchKeyWord', true)
      }
    },
    showFilterBtn () {
      this.spots = {}
      this.inputValue = ''
      this.selectParameter = 'AQI'
      this.selectSymbol = '==='
      this.isHideFilter = !this.isHideFilter
      this.$parent.setIsHideFeature('searchKeyWord', true)
    }
  },
  mounted () {
    document.getElementById('filter_list').addEventListener('click', e => {
      const items = e.target.parentElement.children

      if (items.length === 3) {
        const county = items[0].innerText
        const siteName = items[1].innerText

        if (county !== '' && siteName !== '') {
          const taiwanMap = this.$parent.$parent.$parent.$refs.TaiwanMap

          if (taiwanMap.clickedArea === '') {
            taiwanMap.clickedArea = siteName
            taiwanMap.setCountyLayer(1, county)
          } else {
            if (taiwanMap.clickedArea !== siteName) {
              taiwanMap.clickedArea = siteName
              taiwanMap.setCountyLayer(2, county)
            } else {
              taiwanMap.clickedArea = ''
              taiwanMap.setCountyLayer(3, county)
            }
          }
        }
      }
    })
  }
}
</script>

<style lang="stylus">
#search_key_word
  margin: 10px auto
  height: auto
  padding: 0 0 1px 0
  overflow-x: hidden
  box-shadow: 3px 3px 3px #777777
  background-color: white

  #btn_wrap
    cursor: pointer
    margin: 2px
    height: 30px

    #btn_style
      position: absolute
      right: 0

  #map_marker
    font-size: 24px
    text-align: center
    color: #27a033

    i
      position: relative
      top: 24px

  .selection_style
    padding: 18px 15px 0 0

  #filter_list
    cursor: pointer

</style>
