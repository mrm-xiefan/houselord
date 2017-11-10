<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="button-top">
        <button class="btn" type="button" v-on:click="addHouse()"><i class="fa fa-plus"></i>登録</button>
      </div>
      <div class="houses-area">
        <div class="house-area" v-for="house in manager.houses">
          <i class="glyphicon glyphicon-home"></i>{{house.name}}
        </div>
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
    position: absolute;
    top: 110px;
    right: 10px;
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
    min-height: 100px;
    border-bottom: solid 1px #aaaaaa;
  }
  .house-area {
    float: left;
    padding: 5px 10px 5px 10px;
    margin: 5px;
    color: #fff;
    font-size: 11px;
    font-weight: 100;
    background: #333;
    border-radius: 2px;
    cursor: pointer;
  }
  .house-area:hover {
    background: #444;
  }
  .house-area i {
    font-size: 14px;
    margin-right: 8px;
  }
</style>
