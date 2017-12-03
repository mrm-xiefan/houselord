<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="bg-gray add-header text-black">
        <i class="fa fa-plus-circle"></i> ハウスを登録する
      </div>
      <div class="bg-gray-light add-body">
        <h4>1.ハウス情報を入力する</h4>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>ハウス名：</label>
          <div class="input-text">
            <input v-model="name" type="text" class="form-control" placeholder="入力">
          </div>
        </div>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>アドレス：</label>
          <div class="input-text">
            <input v-model="address" type="text" class="form-control" placeholder="入力">
          </div>
        </div>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>階層数：</label>
          <div class="input-text">
            <input v-model="floor" type="number" class="form-control" max="50" placeholder="入力">
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">備考：</label>
          <div class="input-text">
            <input v-model="note" type="text" class="form-control" placeholder="入力">
          </div>
        </div>

        <h4 class="margin-top">2.部屋情報を入力する</h4>
        <div class="input-group">
          <label class="input-label"><span class="text-red require">(＊)</span>部屋数：</label>
          <div class="input-text">
            <input v-model="room" type="number" class="form-control" max="30" placeholder="入力">
          </div>
        </div>

        <label class="input-label fee-title">費用：</label>
        <div class="fee-list">
          <div class="fee-item" v-for="(fee, index) in fees" v-on:click="editFee(fee)">
            <div class="fee-info">
              {{fee.name}}
            </div>
            <div class="fee-info">
              {{fee.price}}
            </div>
            <div class="fee-delete" v-on:click.stop="deleteFee(index)">
              <i class="fa fa-close"></i>
            </div>
          </div>
          <div class="fee-add" v-on:click="addFee">
            <i class="fa fa-plus-square-o"></i>
          </div>
        </div>

        <div class="house-action">
          <button type="button" class="btn btn-primary" :disabled="!isValid" v-on:click="saveHouse">
            <i class="fa fa-plus-circle"></i> 登録
          </button>
          <button type="button" class="btn btn-default text-blue" v-on:click="backward">
            <i class="fa fa-reply"></i> 戻る
          </button>
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
    data() {
      return {
        name: '',
        address: '',
        floor: 0,
        note: '',
        room: 0,
        fees: []
      }
    },
    mounted() {
      $('body').layout('fix')
    },
    computed: {
      isValid() {
        if (!this.name) return false
        if (!this.address) return false
        if (this.floor <= 0) return false
        if (this.room <= 0) return false
        return true
      }
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      addFee() {
        let self = this
        utils.event.$emit('FEE_DETAIL', null, (fee) => {
          self.fees.push(fee)
        })
      },
      editFee(fee) {
        let self = this
        utils.event.$emit('FEE_DETAIL', fee, (newfee) => {
          fee.type = newfee.type
          fee.name = newfee.name
          fee.price = newfee.price
          fee.day = newfee.day
        })
      },
      deleteFee(index) {
        this.fees.splice(index, 1)
      },
      saveHouse() {
        let self = this
        if (this.floor * this.room > 500) {
          utils.event.$emit('SHOW_MESSAGE', 'B006')
          return
        }
        let data = {
          lord: manager.user._id,
          name: this.name,
          address: this.address,
          floor: Number(this.floor),
          note: this.note,
          room: Number(this.room),
          fees: this.fees
        }
        utils.restPost('/api/addHouse', data).then(
          response => {
            if (response) {
              // manager.houses.push(new House(response))
              // manager.sortHouse()
              self.$router.push({name: 'house'})
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
    width: 120px;
    padding: 5px;
    margin: 0px;
  }
  .input-text {
    width: calc(100% - 120px);
    margin-right: 20px;
  }
  .fee-title {
    padding-right: 8px;
    margin-top: 10px;
  }
  .fee-list {
    width: 100%;
    padding: 20px;
    border: 1px solid #ccc;
    overflow: hidden;
  }
  .fee-item {
    float: left;
    height: 60px;
    width: 120px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-top: 4px solid #605ca8;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
  }
  .fee-info {
    padding: 5px 5px 0px 5px;
  }
  .fee-delete {
    position: absolute;
    right: 10px;
    top: 12px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 15px;
    background: #d2d6de;
  }
  .fee-delete:hover {
    background: #605ca8;
  }
  .fee-delete i {
    font-size: 25px;
    color: #fff;
  }
  .fee-add {
    height: 60px;
    width: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .fee-add i {
    font-size: 60px;
    cursor: pointer;
  }
  .fee-add i:hover {
    opacity: 0.7;
  }
  .house-action {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .house-action button {
    width: 120px;
  }
</style>
