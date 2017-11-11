<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="room-area">
        <roomBox :manager="manager" :room="room" v-masonry-tile v-for="room in manager.rooms" :key="room._id"></roomBox>
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

  import Room from '@/store/room.js'
  import roomBox from '@/components/parts/roomBox'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
    },
    components: {
      roomBox: roomBox
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      addRoom() {
        console.log('add room')
      }
    }
  }
</script>

<style scoped>
  section.content {
    height: 100%;
  }
  .button-top {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
  .button-top .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 85px;
    font-size: 13px;
    color: #5855E8;
    background: #f0f1f6;
    border: solid 1px #5855E8;
    border-radius: 25px;
    margin-left: 10px;
  }
  .button-top .btn:hover {
    opacity: 0.7;
  }
  .button-top .btn:focus {
    outline: none;
  }
  .button-top .btn i {
    margin-right: 3px;
    font-size: 14px;
  }
  .rooms-area {
    width: 100%;
    overflow: hidden;
  }
</style>
