<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="houses-area" v-masonry transition-duration="0.3s" item-selector=".house-box">
        <houseBox :manager="manager" :house="house" v-masonry-tile v-for="house in manager.houses" :key="house._id"></houseBox>
      </div>
      <div class="room-area row">
      </div>
    </section>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import houseBox from '@/components/house/houseBox'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
    },
    components: {
      houseBox: houseBox
    },
    created() {
      let self = this
      utils.event.$on('REFRESH_HOUSE', () => {
        self.$nextTick(() => {
          self.$redrawVueMasonry()
        })
      })
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      }
    },
    beforeDestroy() {
      utils.event.$off('REFRESH_HOUSE')
    }
  }
</script>

<style scoped>
  section.content {
    height: 100%;
  }
  .houses-area {
    width: 100%;
    overflow: hidden;
  }
</style>
