<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="bg-gray add-header text-black">
        <i class="fa fa-plus-circle"></i> ハウスを登録する
      </div>
      <div class="bg-gray-light add-body">
        <h4>1.ハウス情報を登録する</h4>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>ハウス名：</label>
          <div class="input-text">
            <input type="text" class="form-control" placeholder="入力">
          </div>
        </div>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>アドレス：</label>
          <div class="input-text">
            <input type="text" class="form-control" placeholder="入力">
          </div>
        </div>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>階層：</label>
          <div class="input-text">
            <input type="number" class="form-control" max="50" placeholder="入力">
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">備考：</label>
          <div class="input-text">
            <input type="text" class="form-control" placeholder="入力">
          </div>
        </div>

        <h4 class="margin-top">2.部屋情報を登録する</h4>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>部屋数：</label>
          <div class="input-text">
            <input type="number" class="form-control" max="30" placeholder="入力">
          </div>
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
  h4 {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .margin-top {
    margin-top: 40px;
  }
  .add-header {
    padding: 15px;
    border: 1px solid #aaa;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .add-body {
    padding: 15px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }
  .input-group {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
  }
  .input-label {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 110px;
    padding: 5px;
    margin: 0px;
  }
  .input-text {
    width: calc(100% - 110px);
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
