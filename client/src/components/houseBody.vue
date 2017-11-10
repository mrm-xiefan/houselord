<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="button-top bg-purple">
        <button class="btn" type="button" v-on:click="addHouse()"><i class="fa fa-plus"></i>登録</button>
      </div>
      <div class="houses-area">
        <houseBox :manager="manager" :house="house" v-for="house in manager.houses" :key="house._id"></houseBox>
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

  import House from '@/store/house.js'
  import houseBox from '@/components/parts/houseBox'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
    },
    components: {
      houseBox: houseBox,
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
          lord: manager.user._id,
          owner: '',
          name: '',
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
  .houses-area {
    width: 100%;
    overflow: hidden;
  }
</style>
