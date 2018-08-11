<template>
  <div class="content-wrapper">
    <div class="add-info bg-teal">
      物件はまだ登録されていません。早速登録して、ReinsManageを使ってみましょう。
    </div>
    <section class="content" v-on:click="closeSide">
      <div class="add-house-guide">
        <div class="add-house-button" v-on:click="addCentralizedHouse()">
          <i class="fa fa-plus"></i> 集合住宅物件を登録する
        </div>
        <div class="add-house-button" v-on:click="addDistributedHouse()">
          <i class="fa fa-plus"></i> 分散住宅物件を登録する
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import 'jquery-ui-touch-punch/jquery.ui.touch-punch.js'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
      $(".add-house-button").draggable({
        containment: $('.add-house-guide')
      })
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      addCentralizedHouse() {
        this.$router.push({name: 'addCentralizedHouse'})
      },
      addDistributedHouse() {
        this.$router.push({name: 'addDistributedHouse'})
      }
    }
  }
</script>

<style scoped>
  .add-info {
    padding: 20px;
    font-size: 22px;
    color: #fff;
  }
  .add-house-guide {
    display: flex;
    flex-flow: wrap;
    justify-content: space-around;
    align-items: center;
    width: 300px;
    height: 300px;
    position: fixed;
    top: calc(50% - 100px);
    left: calc(50% - 150px);
  }
  .add-house-button {
    padding: 10px;
    font-size: 13px;
    color: #fff;
    background: #5855E8;
    border: solid 1px #5855E8;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
  }
  .add-house-button:hover {
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);
  }
  .add-house-button i {
    margin-right: 3px;
    font-size: 16px;
  }
</style>
