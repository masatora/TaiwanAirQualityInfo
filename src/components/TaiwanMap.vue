<template>
  <div id="wrap_map">
    <div class="map" id="map"></div>
    <MapFeatures ref="MapFeatures"/>
    <ColorInfo ref="ColorInfo" />
    <LayerButtons ref="LayerButtons" />
  </div>
</template>

<script>
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "h337" }] */
import MapFeatures from './MapFeatures.vue'
import ColorInfo from './ColorInfo.vue'
import LayerButtons from './LayerButtons.vue'
import jsonp from 'jsonp'
import L from 'leaflet'
import h337 from 'heatmap.js'
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap'
import 'leaflet/dist/leaflet.css'
import { feature } from 'topojson/dist/topojson.min.js'
import twCountyTopo from '../statics/twCountyTopo.json'
import { map, filter } from 'ramda'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
  name: 'TaiwanMap',
  components: {
    MapFeatures,
    ColorInfo,
    LayerButtons
  },
  data () {
    return {
      aqiData: [],
      clickedArea: '',
      siteLayer: [],
      countyLayer: [],
      heatmap: [],
      map: {},
      defaultCountyStyle: {
        weight: 1,
        opacity: 0.8,
        color: '#aaaaaa',
        fillOpacity: 0.2,
        fillColor: '#fafafa'
      },
      changeCountyStyle: {
        weight: 5,
        color: '#ffffff',
        fillOpacity: 0.7,
        fillColor: '#111111'
      }
    }
  },
  methods: {
    _getBaseLayer () {
      const mapSource = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      const baseLayer = L.tileLayer(mapSource, {
        attribution: '',
        maxZoom: 19,
        minZoom: 8
      })

      return baseLayer
    },
    _getHeatmapLayer () {
      const heatmapLayer = new HeatmapOverlay({
        radius: 20,
        maxOpacity: 0.5,
        scaleRadius: false,
        useLocalExtrema: true,
        latField: 'Latitude',
        lngField: 'Longitude',
        valueField: 'AQI'
      })

      heatmapLayer.setData({
        min: 0,
        max: 500,
        data: this.aqiData
      })

      return heatmapLayer
    },
    _isEmptyCountyName (countyName) {
      return d => {
        if (d._county !== countyName) {
          d._icon.style.opacity = 0.2
          d._shadow.style.opacity = 0.2
        }
      }
    },
    _isSameCountyName (d) {
      d._icon.style.opacity = 1
      d._shadow.style.opacity = 1
    },
    _isDifferentCountyName (countyName) {
      return d => {
        if (d._county === countyName) {
          d._icon.style.opacity = 1
          d._shadow.style.opacity = 1
        } else {
          d._icon.style.opacity = 0.2
          d._shadow.style.opacity = 0.2
        }
      }
    },
    _getCountyLayer () {
      const _this = this
      const showInfo = this.$refs.MapFeatures.$refs.ShowInfo
      const barChart = this.$refs.MapFeatures.$refs.BarChart
      const geoLayer = L.geoJSON(feature(twCountyTopo, twCountyTopo.objects['layer1']), {
        style: _this.defaultCountyStyle,
        onEachFeature (feature, layer) {
          let props = feature.properties
          let countyName = props.name
          let countyData = filter(d => d.County === countyName)(_this.aqiData)
          let lb = _this.$refs.LayerButtons

          layer.on({
            click () {
              if (_this.clickedArea === '') {
                if (!lb.isMarkerRemoved) {
                  map(_this._isEmptyCountyName(countyName))(_this.siteLayer)
                }
                _this.clickedArea = countyName
                this.setStyle(_this.changeCountyStyle)
                showInfo.updateComponent(countyData)
                barChart.county = countyData[0].County
              } else {
                if (_this.clickedArea !== countyName) {
                  if (!lb.isMarkerRemoved) {
                    map(_this._isDifferentCountyName(countyName))(_this.siteLayer)
                  }
                  _this.clickedArea = countyName
                  geoLayer.setStyle(_this.defaultCountyStyle)
                  this.setStyle(_this.changeCountyStyle)
                  showInfo.updateComponent(countyData)
                  barChart.county = countyData[0].County
                } else {
                  if (!lb.isMarkerRemoved) {
                    map(_this._isSameCountyName)(_this.siteLayer)
                  }
                  _this.clickedArea = ''
                  geoLayer.setStyle(_this.defaultCountyStyle)
                  showInfo.updateComponent()
                  barChart.county = ''
                }
              }
              _this.$refs.MapFeatures.defaultIsHideFeature()
            },
            mouseover () {
              if (_this.clickedArea === '') {
                this.setStyle(_this.changeCountyStyle)
                showInfo.updateComponent(countyData)
                barChart.county = countyData[0].County
                _this.$refs.MapFeatures.defaultIsHideFeature()
              }
            },
            mouseout () {
              if (_this.clickedArea === '') {
                this.setStyle(_this.defaultCountyStyle)
                showInfo.updateComponent()
                barChart.county = ''
                _this.$refs.MapFeatures.defaultIsHideFeature()
              }
            }
          })
        }
      })

      return geoLayer
    },
    setCountyLayer (type, county) {
      const countyLayer = Object.values(filter(d => d.feature.properties.COUNTYNAME === county)(this.countyLayer._layers))

      if (countyLayer.length === 1) {
        const lb = this.$refs.LayerButtons

        if (!lb.isMarkerRemoved) {
          if (type === 1) {
            map(this._isEmptyCountyName(county))(this.siteLayer)
            countyLayer[0].setStyle(this.changeCountyStyle)
          } else if (type === 2) {
            map(this._isDifferentCountyName(county))(this.siteLayer)
            this.countyLayer.setStyle(this.defaultCountyStyle)
            countyLayer[0].setStyle(this.changeCountyStyle)
          } else {
            map(this._isSameCountyName)(this.siteLayer)
            this.countyLayer.setStyle(this.defaultCountyStyle)
          }
        }
      }
    },
    _getMarkerIcons () {
      const shadowUrl = 'statics/images/marker-shadow.png'
      const shadowAnchor = [20, 37]
      const iconAnchor = [24, 43]
      const tooltipAnchor = [14, -30]

      return {
        green: L.icon({ iconUrl: 'statics/images/marker-green.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor }),
        yellow: L.icon({ iconUrl: 'statics/images/marker-yellow.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor }),
        darkOrange: L.icon({ iconUrl: 'statics/images/marker-darkOrange.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor }),
        red: L.icon({ iconUrl: 'statics/images/marker-red.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor }),
        purple: L.icon({ iconUrl: 'statics/images/marker-purple.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor }),
        darkred: L.icon({ iconUrl: 'statics/images/marker-darkred.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor }),
        gray: L.icon({ iconUrl: 'statics/images/marker-gray.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor })
      }
    },
    _getSiteLayer () {
      const _this = this
      const siteLayer = []
      const markerIcons = this._getMarkerIcons()
      const showInfo = this.$refs.MapFeatures.$refs.ShowInfo
      let color = ''
      let marker = {}

      _this.aqiData.forEach(value => {
        color = _this.getColor(value.AQI)
        marker = L.marker([value.Latitude, value.Longitude], { icon: markerIcons[color] }).on({
          click () {
            if (_this.clickedArea === '') {
              _this.clickedArea = value.SiteName
              _this.setCountyLayer(1, value.County)
              showInfo.updateComponent([value])
            } else {
              if (_this.clickedArea !== value.SiteName) {
                _this.clickedArea = value.SiteName
                _this.setCountyLayer(2, value.County)
                showInfo.updateComponent([value])
              } else {
                _this.clickedArea = ''
                _this.setCountyLayer(3, value.County)
                showInfo.updateComponent()
              }
            }
          }
        }).bindTooltip(value.SiteName + ': ' + (value.AQI || 0))

        siteLayer.push(Object.assign(marker, { _county: value.County }))
      })

      return siteLayer
    },
    getColor (value) {
      let result = 'gray'

      if (value > 300) {
        result = 'darkred'// 危害
      } else if (value > 200) {
        result = 'purple'// 非常不健康
      } else if (value > 150) {
        result = 'red'// 對所有族群不健康
      } else if (value > 100) {
        result = 'darkOrange'// 對敏感族群不健康
      } else if (value > 50) {
        result = 'yellow'// 普通
      } else if (value > 0) {
        result = 'green'// 良好
      }

      return result
    },
    _getAqiJsonData () {
      return new Promise((resolve, reject) => {
        jsonp('https://opendata.epa.gov.tw/api/v1/AQI?$skip=0&$top=1000&$format=json', null, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    }
  },
  mounted () {
    const _this = this
    this.$q.loading.show()
    _this._getAqiJsonData().then(res => {
      if (res.length > 0) {
        _this.aqiData = res
        const baseLayer = _this._getBaseLayer()
        _this.countyLayer = _this._getCountyLayer()
        _this.siteLayer = _this._getSiteLayer()
        _this.heatmap = _this._getHeatmapLayer()
        _this.map = new L.Map('map', {
          center: new L.LatLng(23.97361, 120.98064),
          zoom: 8,
          layers: [
            baseLayer,
            _this.countyLayer
          ].concat(_this.siteLayer)
        })
        this.$q.loading.hide()
      }
    }).catch(() => {
      alert('Service Unavailable Temporarily')
      this.$q.loading.hide()
    })
  }
}
</script>

<style lang="stylus">
#wrap_map, #map
  height: 100%

</style>
