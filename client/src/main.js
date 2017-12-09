import 'jquery-ui/themes/base/core.css'
import 'jquery-ui/themes/base/theme.css'
import 'jquery-ui/themes/base/selectable.css'
import 'jquery-ui/themes/base/draggable.css'
import 'jquery-ui/themes/base/resizable.css'
import 'jquery-ui/themes/base/sortable.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/_all-skins.min.css'
import 'bootstrap-fileinput/css/fileinput.min.css'

import 'es6-promise/auto'
import 'jquery/dist/jquery.min.js'
import 'jquery-ui/ui/core.js'
import 'jquery-ui/ui/widgets/selectable.js'
import 'jquery-ui/ui/widgets/draggable.js'
import 'jquery-ui/ui/widgets/droppable.js'
import 'jquery-ui/ui/widgets/resizable.js'
import 'jquery-ui/ui/widgets/sortable.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js'
import 'bootstrap-datepicker/dist/locales/bootstrap-datepicker.ja.min.js'
import 'admin-lte/dist/js/adminlte.min.js'
import 'bootstrap-fileinput/js/fileinput.min.js'

import manager from '@/store/manager.js'
import utils from '@/tool/utils.js'
import Vue from 'vue'
import router from '@/tool/router.js'
utils.init(manager.controller.cors, router)
import app from './app'
import {VueMasonryPlugin} from 'vue-masonry'
Vue.config.productionTip = false
Vue.use(VueMasonryPlugin)

utils.event.$on('LOCK_SCREEN', (locker) => {
  manager.locker = locker
})

router.beforeEach((to, from, next) => {
  manager.controller.setApp(to)
  next()
})

new Vue({
  el: '#app',
  data: () => {
    return {
      manager: manager
    }
  },
  router,
  template: '<app :manager="manager"></app>',
  components: {app}
})
