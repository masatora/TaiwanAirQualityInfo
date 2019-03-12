<template>
  <div id="color_info" class="mobile-hide absolute-bottom-left">
    <div id="color_info_container">
      <ul>
        <li v-for="(value, key, index) in condition" :key="index">
          <span :class="key">
            <q-icon name="mdi-square" />
          </span>&nbsp;
          <span>{{value}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorInfo',
  data () {
    return {
      condition: {
        green: '良好 (0~50)',
        yellow: '普通 (51~100)',
        darkOrange: '對敏感族群不健康 (101~150)',
        red: '對所有族群不健康 (151~200)',
        purple: '非常不健康 (201~300)',
        darkred: '危害 (301~500)',
        gray: '設備維修'
      }
    }
  }
}
</script>

<style lang="stylus">
#color_info
  width: 280px
  height: 220px
  font-size: 14px
  border: 2px solid #aaaaaa
  background-color: #dddddd
  z-index: 1000

  #color_info_container
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    margin: auto
    width: 240px
    height: 200px
    border-radius: 5px
    box-shadow: 3px 3px 3px #777777
    background-color: #fafafa

    ul
      list-style-type: none
      margin: 0
      padding: 10px

      li
        margin: 5px
        font-weight: bolder
        color: #555555

        span:nth-child(1)
          width: 30px
          height: 30px

</style>
