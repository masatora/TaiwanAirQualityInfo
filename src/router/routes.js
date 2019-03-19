
const routes = [
  {
    path: '/',
    component: () => import('layouts/Main.vue')
  },
  {
    path: '/*',
    component: () => import('pages/Error404.vue')
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
