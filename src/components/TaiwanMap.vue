<template>
  <div id="wrap_map">
    <div class="map" id="map"></div>
    <MapFeatures ref="MapFeatures"/>
    <ColorInfo ref="ColorInfo" />
  </div>
</template>

<script>
import MapFeatures from './MapFeatures.vue'
import ColorInfo from './ColorInfo.vue'
import jsonp from 'jsonp'
import L from 'leaflet'
//import h337 from 'heatmap.js'
//import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap'
import 'leaflet/dist/leaflet.css'
import {feature} from 'topojson/dist/topojson.min.js'
import twCountyTopo from '../assets/twCountyTopo.json'
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
    ColorInfo
  },
  data() {
    return {
      aqiData: [],
      clickedArea: '',
      siteLayer: []
    }
  },
  methods: {
    _getBaseLayer() {
      const mapSource = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      //let mapSource = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
      const baseLayer = L.tileLayer(mapSource, {
        attribution: '',
        maxZoom: 19,
        minZoom: 8,
        //id: 'mapbox.light'
      })

      return baseLayer
    },
    _getHeatmapLayer() {
      const heatmapLayer = new HeatmapOverlay({
        radius: 20,
        maxOpacity: .5,
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
    _getCountyLayer() {
      const isEmptyCountyName = countyName => {
        const cn = countyName
        return d => {
          if (d._county !== cn) {
            d._icon.style.opacity = .2
            d._shadow.style.opacity = .2
          }
        }
      }
      const isSameCountyName = d => {
        d._icon.style.opacity = 1
        d._shadow.style.opacity = 1
      }
      const isDifferentCountyName = countyName => {
        const cn = countyName
        return d => {
          if (d._county === cn) {
            d._icon.style.opacity = 1
            d._shadow.style.opacity = 1
          } else {
            d._icon.style.opacity = .2
            d._shadow.style.opacity = .2
          }
        }
      }
      const _this = this
      const showInfo = this.$refs.MapFeatures.$refs.ShowInfo
      const defaultStyle = {
        weight: 1,
        opacity: .8,
        color: '#aaaaaa',
        fillOpacity: .2,
        fillColor: '#fafafa'
      }
      const changedStyle = {
        weight: 5,
        color: '#ffffff',
        fillOpacity: .7,
        fillColor: '#111111'
      }
      const geoLayer = L.geoJSON(feature(twCountyTopo, twCountyTopo.objects['layer1']), {
        style: defaultStyle,
        onEachFeature(feature, layer) {
          let props = feature.properties
          let countyName = props.name
          let countyData = filter(d => d.County === countyName)(_this.aqiData)

          layer.on({
            click() {
              if (_this.clickedArea === '') {
                map(isEmptyCountyName(countyName))(_this.siteLayer)
                _this.clickedArea = countyName
                this.setStyle(changedStyle)
                showInfo.updateComponent(countyData)
              } else {
                if (_this.clickedArea !== countyName) {
                  map(isDifferentCountyName(countyName))(_this.siteLayer)
                  _this.clickedArea = countyName
                  geoLayer.setStyle(defaultStyle)
                  this.setStyle(changedStyle)
                  showInfo.updateComponent(countyData)
                } else {
                  map(isSameCountyName)(_this.siteLayer)
                  _this.clickedArea = ''
                  geoLayer.setStyle(defaultStyle)
                  showInfo.updateComponent()
                }
              }
              _this.$refs.MapFeatures.defaultIsHideFeature()
            },
            mouseover() {
              if (_this.clickedArea === '') {
                this.setStyle(changedStyle)
                showInfo.updateComponent(countyData)
                _this.$refs.MapFeatures.defaultIsHideFeature()
              }
            },
            mouseout() {
              if (_this.clickedArea === '') {
                this.setStyle(defaultStyle)
                showInfo.updateComponent()
                _this.$refs.MapFeatures.defaultIsHideFeature()
              }
            }
          })
        }
      })

      return geoLayer
    },
    _getMarkerIcons() {
      const shadowUrl = 'images/marker-shadow.png'
      const shadowAnchor = [20, 37]
      const iconAnchor = [24, 43]
      const tooltipAnchor = [14, -30]

      return {
        green: L.icon({iconUrl: 'images/marker-green.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor}),
        yellow: L.icon({iconUrl: 'images/marker-yellow.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor}),
        darkOrange: L.icon({iconUrl: 'images/marker-darkOrange.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor}),
        red: L.icon({iconUrl: 'images/marker-red.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor}),
        purple: L.icon({iconUrl: 'images/marker-purple.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor}),
        darkred: L.icon({iconUrl: 'images/marker-darkred.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor}),
        gray: L.icon({iconUrl: 'images/marker-gray.png', shadowUrl, shadowAnchor, iconAnchor, tooltipAnchor})
      }
    },
    _getSiteLayer(countyLayer) {
      const _this = this
      const siteLayer = []
      const markerIcons = this._getMarkerIcons()
      const showInfo = this.$refs.MapFeatures.$refs.ShowInfo
      let color = ''
      let marker = {}

      _this.aqiData.forEach(function(value) {
        color = _this.getColor(value.AQI)
        marker = L.marker([value.Latitude, value.Longitude], {icon: markerIcons[color]}).on({
          click() {
            if (_this.clickedArea === '') {
              _this.clickedArea = value.SiteName
              showInfo.updateComponent([value])
            } else {
              if (_this.clickedArea !== value.SiteName) {
                _this.clickedArea = value.SiteName
                countyLayer.setStyle(countyLayer.options.style)
                showInfo.updateComponent([value])
              } else {
                _this.clickedArea = ''
                countyLayer.setStyle(countyLayer.options.style)
                showInfo.updateComponent()
              }
            }
            _this.$refs.MapFeatures.defaultIsHideFeature()
          }
        }).bindTooltip(value.SiteName + ': ' + value.AQI)

        siteLayer.push(Object.assign(marker, {_county: value.County}))
      })

      return siteLayer
    },
    getColor(value) {
      return value > 300 ? 'darkred' :// 危害
             value > 200 ? 'purple' :// 非常不健康
             value > 150 ? 'red' :// 對所有族群不健康
             value > 100 ? 'darkOrange' :// 對敏感族群不健康
             value > 50  ? 'yellow' :// 普通
             value > 0   ? 'green' :// 良好
                           'gray';
    },
    _getAqiJsonData() {
      return new Promise((resolve, reject) => {
        jsonp('https://opendata.epa.gov.tw/api/v1/AQI?$skip=0&$top=1000&$format=json', null, (err, res) => {
          if(err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    }
  },
  mounted() {
    const _this = this

    _this._getAqiJsonData().then((res) => {
      if (res.length > 0) {
        _this.aqiData = res
        const baseLayer = _this._getBaseLayer()
        const countyLayer = _this._getCountyLayer()
        _this.siteLayer = _this._getSiteLayer(countyLayer)
        new L.map('map', {
          center: new L.LatLng(23.97361, 120.98064),
          zoom: 8,
          layers: [
            baseLayer,
            countyLayer,
            //_this._getHeatmapLayer()
          ].concat(_this.siteLayer)
        })
      }
    }).catch((err) => {
      alert('Service Unavailable Temporarily')
    })
  }
}
</script>

<style lang="stylus">
#wrap_map, #map
  height: 100%

</style>