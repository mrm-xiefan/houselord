<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div>{{manager.controller.currentApp}}</div>
    </section>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      }
    }
  }
</script>

<style scoped>
  section.content {
    height: 100%;
  }
</style>
