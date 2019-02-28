<template>
  <div class="input-group">
    <input type="text" class="form-control" ref="keyWord" placeholder="insert a city" @input="search" />
    <div class="input-group-append">
      <button type="button" class="btn btn-outline-secondary" @click="submit">submit</button>
      <div :class="['dropdown-menu', {active: isActive}]">
        <a class="dropdown-item" v-for="(city, index) in searchCities" @click="selectedCity(city)" :key="index">{{city}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchKeyword',
  inject: ['pm25Data'],
  data() {
    return {
      cities: this.pm25Data.citiesName,
      searchCities: [],
      isActive: false
    }
  },
  methods: {
    search() {
      this.isActive = false
      let keyword = this.$refs.keyword

      if (keyword.value !== '') {
        let reg = new RegExp(keyword.value + '+')
        this.searchCities = this.cities.filter((value) => reg.test(value))

        if (this.searchCities.length > 0) {
          this.isActive = true
        }
      }
    },
    selectedCity(city) {
      this.$refs.keyword.value = city
      this.isActive = false
    },
    _isLegalKeyword(keyword) {
      let isLegal = false
      let msg = ''

      if (this.isActive) {
        msg += 'please select dropdown menu' + '\n'
      }

      if (keyword === '') {
        msg += 'please insert a city' + '\n'
      }

      if (!this.pm25Data.citiesName.includes(keyword)) {
        msg += 'no result'
      }

      if (msg === '') {
        isLegal = true
      } else {
        alert(msg)
      }

      return isLegal
    },
    submit() {
      let keyword = this.$refs.keyword.value

      if (this._isLegalKeyword(keyword)) {
        if (this.pm25Data.formatData[keyword] !== undefined) {
          console.log(this.pm25Data.formatData[keyword])
        } else {
          /*
          Object.values(this.pm25Data.formatData).some(function(value, index) {
            if (value[keyword] !== undefined) {
              console.log(value[keyword], index)
              return true
            }
          })
          */
        }
      }
    }

  }
}
</script>

<style scoped>
.active {
  display: inline;
}
</style>
