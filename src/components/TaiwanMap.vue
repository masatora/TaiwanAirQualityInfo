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
import { map, pluck, pipe, filter, sort, descend, ascend, prop } from 'ramda'

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
      clickedArea: ''
    }
  },
  methods: {
    _getBaseLayer() {
      let mapSource = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      //let mapSource = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
      let baseLayer = L.tileLayer(mapSource, {
        attribution: '',
        maxZoom: 19,
        minZoom: 8,
        //id: 'mapbox.light'
      })

      return baseLayer
    },
    _getHeatmapLayer() {
      let heatmapLayer = new HeatmapOverlay({
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
      let _this = this
      let showInfo = this.$refs.MapFeatures.$refs.ShowInfo
      let defaultStyle = {
        weight: 1,
        opacity: .8,
        color: '#aaaaaa',
        fillOpacity: .2,
        fillColor: '#fafafa'
      }
      let changedStyle = {
        weight: 5,
        color: '#ffffff',
        fillOpacity: .7,
        fillColor: '#111111'
      }
      let geoLayer = L.geoJSON(feature(twCountyTopo, twCountyTopo.objects['layer1']), {
        style: defaultStyle,
        onEachFeature(feature, layer) {
          let props = feature.properties
          let countyName = props.name
          let countyData = filter(d => d.County === countyName)(_this.aqiData)

          layer.on({
            click() {
              if (_this.clickedArea === '') {
                _this.clickedArea = countyName
                this.setStyle(changedStyle)
                showInfo.updateComponent(countyData)
              } else {
                if (_this.clickedArea !== countyName) {
                  _this.clickedArea = countyName
                  geoLayer.setStyle(defaultStyle)
                  this.setStyle(changedStyle)
                  showInfo.updateComponent(countyData)
                } else {
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
      let shadowUrl = 'images/marker-shadow.png'
      let shadowAnchor = [20, 37]
      let iconAnchor = [24, 43]
      let tooltipAnchor = [14, -30]

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
      let _this = this,
          siteLayer = [],
          color,
          markerIcons = this._getMarkerIcons(),
          showInfo = this.$refs.MapFeatures.$refs.ShowInfo

      _this.aqiData.forEach(function(value) {
        color = _this.getColor(value.AQI)
        siteLayer.push(L.marker([value.Latitude, value.Longitude], {icon: markerIcons[color]}).on({
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
        }).bindTooltip(value.SiteName + ': ' + value.AQI))
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
    let _this = this

    _this._getAqiJsonData().then((res) => {
      if (res.length > 0) {
        _this.aqiData = res
        let baseLayer = _this._getBaseLayer()
        let countyLayer = _this._getCountyLayer()
        let siteLayer = _this._getSiteLayer(countyLayer)
        new L.map('map', {
          center: new L.LatLng(23.97361, 120.98064),
          zoom: 8,
          layers: [
            baseLayer,
            countyLayer,
            //_this._getHeatmapLayer()
          ].concat(siteLayer)
        })
      }
    }).catch((err) => {
      alert('服務暫時無法使用')
    })
  }
}
</script>

<style lang="stylus">
#wrap_map, #map
  height: 100%

</style>
