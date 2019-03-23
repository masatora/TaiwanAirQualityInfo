<template>
  <div id="LayerButtons">
    <ul>
      <li>
        <q-btn icon="mdi-map-marker"
               size="12px"
               :color="isMarkerRemoved ? 'negative' : 'primary'"
               @click="toggleMarker"
               round glossy />
      </li>
      <li>
        <q-btn icon="mdi-fire"
               size="12px"
               :color="isHeatmapRemoved ? 'negative' : 'primary'"
               @click="toggleHeatmap"
               round glossy />
      </li>
    </ul>
  </div>
</template>

<script>
import { map } from 'ramda'

export default {
  name: 'LayerButtons',
  data () {
    return {
      isMarkerRemoved: false,
      isHeatmapRemoved: true
    }
  },
  methods: {
    toggleMarker () {
      let method
      if (this.isMarkerRemoved) {
        method = d => {
          let cn = this.$parent.$refs.MapFeatures.$refs.BarChart.county
          d.addTo(this.$parent.map)
          if (cn !== '') {
            if (d._county === cn) {
              d._icon.style.opacity = 1
              d._shadow.style.opacity = 1
            } else {
              d._icon.style.opacity = 0.2
              d._shadow.style.opacity = 0.2
            }
          }
        }
      } else {
        method = d => d.remove()
      }
      this.isMarkerRemoved = !this.isMarkerRemoved
      map(method)(this.$parent.siteLayer)
    },
    toggleHeatmap () {
      if (this.isHeatmapRemoved) {
        this.$parent.heatmap.addTo(this.$parent.map)
      } else {
        this.$parent.heatmap.remove()
      }
      this.isHeatmapRemoved = !this.isHeatmapRemoved
    }
  }
}
</script>

<style lang="stylus">
#LayerButtons
  position: absolute
  top: 70px
  left: 0
  z-index: 999

  ul
    margin: 10px
    padding: 0
    list-style-type: none

    li
      margin: 20px 0

</style>
