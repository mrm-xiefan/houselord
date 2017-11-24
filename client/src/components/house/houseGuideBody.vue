<template>
  <div class="content-wrapper">
    <div class="add-info bg-teal">
      ハウスはまだ登録されていません。早速登録して、HouseLordを使ってみましょう。
    </div>
    <section class="content" v-on:click="closeSide">
      <div class="add-house-guide">
        <div class="add-house-button">
          <i class="fa fa-plus"></i> ハウスを登録する
        </div>
      </div>
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
    height: 200px;
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
