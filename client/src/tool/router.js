import Vue from 'vue'
import Router from 'vue-router'
import loading from '@/components/loading'
import login from '@/components/login'
import register from '@/components/register'
import error from '@/components/error'
import house from '@/components/house'
import lord from '@/components/lord'
import publish from '@/components/publish'
import finance from '@/components/finance'

import CONST from '@/store/const.js'
import manager from '@/store/manager.js'
import utils from '@/tool/utils.js'

Vue.use(Router)

let preloadHouse = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}
let preloadLord = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}
let preloadPublish = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}
let preloadFinance = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}
let logout = (to, from, next) => {
  utils.restGet('/logout').then(
    response => {
      if (response) {
        utils.router.push({name: 'login'})
      }
    }
  )
}

export default new Router({
  routes: [
    {name: 'loading', path: '/', component: loading},
    {name: 'login', path: '/login', component: login},
    {name: 'register', path: '/register', component: register},
    {name: 'logout', path: '/logout', beforeEnter: logout},
    {name: 'error', path: '/error', component: error},
    {name: 'house', path: '/house', component: house, beforeEnter: preloadHouse},
    {name: 'lord', path: '/lord', component: lord, beforeEnter: preloadLord},
    {name: 'publish', path: '/publish', component: publish, beforeEnter: preloadPublish},
    {name: 'finance', path: '/finance', component: finance, beforeEnter: preloadFinance},
    {path: '*', redirect: '/'}
  ]
})