<template>
  <div class="add-wrapper">
    <div class="add-inner">
      <div class="add-button" v-on:click="addHouse()">
        <i class="fa fa-home"></i>
        <span>登録</span>
      </div>
    </div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import House from '@/store/house.js'
  export default {
    pros: ["manager"],
    methods: {
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
  .add-wrapper {
    position: fixed;
    right: 0;
    top: 110px;
    width: 335px;
    z-index: 1000;
    transform: translateX(335px);
    transition: all .2s;
  }
  .add-wrapper.active {
    transform: translateX(0);
  }
  .add-inner {
    position: relative;
  }
  .add-button {
    position: absolute;
    top: 0;
    left: -65px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 65px;
    height: 65px;
    color: #fff;
    font-size: 11px;
    font-weight: 100;
    background: #ED4163;
    border-radius: 10px 0 0 10px;
    transition: 0.1s;
    cursor: pointer;
    opacity: 0.4;
    overflow: hidden;
  }
  .active .add-button,
  .add-button:hover {
    opacity: 1;
  }
  .add-button i {
    font-size: 30px;
  }
</style>
