
const routes = [
  {
    path: '/',
    component: () => import('layouts/Main.vue')
    // component: () => import('components/LayerButtons.vue')
    /*
    children: [{
      path: 'layerButtons',
      component: () => import('components/LayerButtons.vue')
    }]
    */
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
