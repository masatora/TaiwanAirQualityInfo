<template>
  <div class="status_info">
    <p></p>
    <hr/>
    <p></p>
    <hr/>
    <p></p>
  </div>
</template>

<script>
export default {
  name: 'StatusInfo',
  methods: {
    init(chartId) {
      let timer = 0
      let chart = document.getElementById(chartId)
      let statusInfo = chart.querySelector('.status_info')
      let statusInfoP = statusInfo.getElementsByTagName('p')

      chart.on('plotly_hover', function(data) {
        if (data.points[0]) {
          clearTimeout(timer)
          let idx = data.points[0].pointIndex
          let siteData = data.points[0].data.countyData[idx]
          let xOffset = 15 * idx
          let yOffset = 70 + 150

          statusInfo.style.left = (data.event.pointerX - xOffset) + 'px'
          statusInfo.style.top = (data.event.pointerY + yOffset) + 'px'
          statusInfo.style.display = 'inline'
          if (siteData.Status.length > 2 || siteData.Pollutant.length > 2) {
            statusInfo.style.width = (150 + (Math.max(siteData.Status.length, siteData.Pollutant.length) * 6)) + 'px'
          } else {
            statusInfo.style.width = '150px'
          }

          statusInfoP[0].innerHTML = '<b>' + siteData.SiteName + '</b>'
          statusInfoP[1].innerHTML = '空氣品質 : ' + '<i><b>' + siteData.Status + '</b></i>'
          statusInfoP[2].innerHTML = '空氣污染指標物 : ' + '<i><b>' + (siteData.Pollutant || '無') + '</b></i>'
        }
      }).on('plotly_unhover', function() {
        timer = setTimeout(function() {
          if (timer > 0) {
            statusInfo.style.display = 'none'
          }
        }, 200)
      })

      statusInfo.onmouseover = function() {
        clearTimeout(timer)
      }
      statusInfo.onmouseout = function() {
        timer = setTimeout(function() {
          if (timer > 0) {
            statusInfo.style.display = 'none'
          }
        }, 200)
      }
    }
  }
}
</script>

<style lang="stylus">
.status_info 
  display: none
  position: absolute
  top: 0
  left: 0
  width: 150px
  height: 110px
  padding: 10px
  opacity: 0.9
  background-color: #fafafa
  border: 3px solid #cccccc
  border-radius: 5px

  p 
    font-size: 12px
    line-height: 4px
    color: #555555

  p:first-child 
    text-align: center
    font-size: 16px
</style>