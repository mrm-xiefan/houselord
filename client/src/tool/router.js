import Vue from 'vue'
import Router from 'vue-router'
import loading from '@/components/loading'
import login from '@/components/login'
import register from '@/components/register'
import error from '@/components/error'
import house from '@/components/house'
import room from '@/components/room'
import owner from '@/components/owner'
import publish from '@/components/publish'
import finance from '@/components/finance'

import CONST from '@/store/const.js'
import manager from '@/store/manager.js'
import utils from '@/tool/utils.js'
import House from '@/store/house.js'

Vue.use(Router)

let preloadHouse = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}
let preloadRoom = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  if (to.params.house) {
    utils.restGet('/api/getHouseDetail', {_id: to.params.house}).then(
      response => {
        if (response) {
          manager.selectedHouse = new House(response.house)
          next()
        }
      }
    )
  }
  else {
    manager.selectedHouse = null
    next()
  }
}
let preloadOwner = (to, from, next) => {
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
    {name: 'room', path: '/room/:house', component: room, beforeEnter: preloadRoom},
    {name: 'owner', path: '/owner', component: owner, beforeEnter: preloadOwner},
    {name: 'publish', path: '/publish', component: publish, beforeEnter: preloadPublish},
    {name: 'finance', path: '/finance', component: finance, beforeEnter: preloadFinance},
    {path: '*', redirect: '/'}
  ]
})
