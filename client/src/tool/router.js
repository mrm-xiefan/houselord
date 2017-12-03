import Vue from 'vue'
import Router from 'vue-router'
import loading from '@/components/loading'
import login from '@/components/login'
import register from '@/components/register'
import error from '@/components/error'
import house from '@/components/house/house'
import addHouse from '@/components/addHouse/addHouse'
// import room from '@/components/room/room'
import meter from '@/components/meter/meter'
import report from '@/components/report/report'

import CONST from '@/store/const.js'
import manager from '@/store/manager.js'
import utils from '@/tool/utils.js'
import House from '@/store/house.js'

Vue.use(Router)

let preloadHouse = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  utils.restGet('/api/getHouseData').then(
    response => {
      if (response) {
        manager.refreshHouse(response.houses)
        manager.refreshRoom(response.rooms)
        next()
      }
    }
  )
}
let preloadAddHouse = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}
// let preloadRoom = (to, from, next) => {
//   if (!manager.controller.checkAuth(to)) {
//     return
//   }
//   if (to.params.house) {
//     utils.restGet('/api/getHouseDetail', {_id: to.params.house}).then(
//       response => {
//         if (response) {
//           manager.selectedHouse = new House(response.house)
//           next()
//         }
//       }
//     )
//   }
//   else {
//     manager.selectedHouse = null
//     next()
//   }
// }
let preloadMeter = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}
let preloadReport = (to, from, next) => {
  if (!manager.controller.checkAuth(to)) {
    return
  }
  next()
}

export default new Router({
  mode: 'history',
  routes: [
    {name: 'loading', path: '/loading', component: loading},
    {name: 'login', path: '/login', component: login},
    {name: 'register', path: '/register', component: register},
    {name: 'error', path: '/error', component: error},
    {name: 'house', path: '/', component: house, beforeEnter: preloadHouse},
    {name: 'addHouse', path: '/addHouse', component: addHouse, beforeEnter: preloadAddHouse},
    // {name: 'room', path: '/room/:room', component: room, beforeEnter: preloadRoom},
    {name: 'meter', path: '/meter', component: meter, beforeEnter: preloadMeter},
    {name: 'report', path: '/report', component: report, beforeEnter: preloadReport},
    {path: '*', redirect: '/loading'}
  ]
})
