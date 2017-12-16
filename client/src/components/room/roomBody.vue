<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
        <h4>ルーム情報を更新する</h4>
        <div class="row">
            <div class="col-md-4">
                <div class="input-group">
                  <label class="input-label">部屋番号：</label>
                  <div class="input-text">
                    <input v-model="manager.room.number" type="number" class="form-control" step="1" placeholder="入力">
                  </div>
                </div>
              </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">礼金：</label>
              <div class="input-text">
                <input v-model="manager.room.keyMoney" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>家賃：</label>
              <div class="input-text">
                <input v-model="manager.room.rent" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">敷金：</label>
              <div class="input-text">
                <input v-model="manager.room.deposit" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="contract-action">
          <button type="button" class="btn btn-primary" :disabled="!isValid" v-on:click="updateRoom(manager.room)">
              <i class="fa fa-save"></i> 保存
            </button>
          <button type="button" class="btn bg-red btn-minimum" v-on:click="deleteRoom(manager.room)">
            <i class="fa fa-save"></i> 削除
          </button>
          <button type="button" class="btn btn-default text-blue" v-on:click="backward">
            <i class="fa fa-reply"></i> 戻る
          </button>
        </div>
    </section>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import moment from 'moment'
  import uuid from 'uuid'
  import Contract from '@/store/contract.js'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
    },
    computed: {
      isValid() {
        if (Number(manager.room.rent) <= 0) return false
        return true
      }
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      updateRoom(room) {
          utils.restPost('/api/updateRoom', {room: room}).then(
            response => {
              if (response) {
                console.log(response)
                this.$router.push({name: 'room'})
              }
            }
          )
        },
        deleteRoom(room) {
          utils.restPost('/api/deleteRoom', {room: room}).then(
            response => {
              if (response) {
                console.log(response)
                this.$router.push({name: 'room'})
              }
            }
          )
        },
        backward() {
          this.$router.go(-1)
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
  .contract-header {
    padding: 15px;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .contract-body {
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
    width: 120px;
    padding: 5px;
    margin: 0px;
  }
  .input-text {
    width: calc(100% - 120px);
  }

  thead {
    background: #3c8dbc;
    opacity: 0.7;
    color: #fff;
  }
  .input-column {
    padding: 1px 5px 0px 5px;
    width: 120px;
  }
  .btn-minimum {
    padding: 6px;
  }

  .contract-action {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .contract-action button {
    width: 120px;
  }
</style>
