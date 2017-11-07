<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <button class="btn bg-purple pull-right" v-on:click="addHouse()"><i class="fa fa-plus"></i></button>
      <div>{{manager.controller.currentApp}}</div>
    </section>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import House from '@/store/house.js'
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
      },
      addHouse() {
        let house = {
          isNew: true,
          owner: manager.user._id,
          address: '',
          note: '',
          image: null
        }
        utils.event.$emit('HOUSE_DETAIL', new House(house))
      }
    }
  }
</script>

<style scoped>
  section.content {
    height: 100%;
  }
</style>
