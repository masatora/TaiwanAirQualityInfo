<template>
  <div class="status_info">
    <p></p>
    <hr />
    <p></p>
    <hr />
    <p></p>
  </div>
</template>

<script>
export default {
  name: 'StatusInfo',
  methods: {
    init (chartId) {
      let timer = 0
      let chart = document.getElementById(chartId)
      let statusInfo = chart.querySelector('.status_info')
      let statusInfoP = statusInfo.getElementsByTagName('p')

      chart.on('plotly_hover', data => {
        if (data.points[0]) {
          clearTimeout(timer)
          let idx = data.points[0].pointIndex
          let siteData = data.points[0].data.countyData[idx]
          let x = data.event.pointerX
          let y = data.event.pointerY
          let xOffset = ((x + 180) > document.getElementById('bar_chart').offsetWidth) ? 150 : 0
          let yOffset = 157 + 150

          statusInfo.style.left = (x - xOffset) + 'px'
          statusInfo.style.top = (y + yOffset) + 'px'
          statusInfo.style.display = 'inline'
          statusInfoP[0].innerHTML = '<b>' + siteData.SiteName + '</b>'
          statusInfoP[1].innerHTML = '空氣品質 : ' + '<i><b>' + siteData.Status + '</b></i>'
          statusInfoP[2].innerHTML = '空氣污染指標物 : ' + '<i><b>' + (siteData.Pollutant || '無') + '</b></i>'
        }
      }).on('plotly_unhover', () => {
        timer = setTimeout(() => {
          if (timer > 0) {
            statusInfo.style.display = 'none'
          }
        }, 200)
      })

      statusInfo.onmouseover = () => {
        clearTimeout(timer)
      }
      statusInfo.onmouseout = () => {
        timer = setTimeout(() => {
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
  width: 180px
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
