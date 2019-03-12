import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

/*
import 'bootstrap-css-only/css/bootstrap.min.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faChartBar, faSearchLocation, faSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faChartBar, faSearchLocation, faSquare)
Vue.component('fa', FontAwesomeIcon)
Vue.config.productionTip = false
*/
Vue.use(VueRouter)
/*
new Vue({
  render: h => h(App)
}).$mount('#app')
*/
export default function () {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
