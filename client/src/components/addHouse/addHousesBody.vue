<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="bg-blue add-header">
        <i class="fa fa-edit"></i> 集合住宅登録
      </div>

      <div class="bg-gray-light add-body">
        <h4>1.物件情報を入力する</h4>
        <div class="row">
          <div class="col-md-6">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>物件名：</label>
              <div class="input-text">
                <input v-model="name" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                <span class="dropdown-text" v-if="aspect == ''">取引態様</span>
                <span class="dropdown-text" v-else>{{aspectName}}</span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="aspect in manager.aspects" class="selection-item">
                  <a v-on:click="setAspect(aspect)">{{aspect.name}}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>階層数：</label>
              <div class="input-text">
                <input v-model="floor" type="number" class="form-control" max="50" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">築年月：</label>
              <div class="input-text">
                <input v-model="built" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">構造：</label>
              <div class="input-text">
                <input v-model="construction" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>アドレス：</label>
              <div class="input-text">
                <input v-model="address" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <label class="input-label">交通：</label>
              <div class="input-text">
                <input v-model="traffic" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <label class="input-label">備考：</label>
              <div class="input-text">
                <input v-model="note" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 upload-input">
            <uploadAttachment></uploadAttachment>
          </div>
        </div>

        <h4 class="margin-top">2.部屋情報を入力する</h4>
        <div class="row">
          <div class="col-md-6">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>部屋数：</label>
              <div class="input-text">
                <input v-model="room" type="number" class="form-control" max="30" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>家賃：</label>
              <div class="input-text">
                <input v-model="rent" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">礼金：</label>
              <div class="input-text">
                <input v-model="keyMoney" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">敷金：</label>
              <div class="input-text">
                <input v-model="deposit" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">管理費：</label>
              <div class="input-text">
                <input v-model="management" type="number" class="form-control" step="1000" placeholder="入力">
              </div>
            </div>
          </div>
        </div>

        <label class="input-label fee-title">定常費用：</label>
        <div class="fee-list">
          <div class="fee-item" v-for="(fee, index) in fees" v-on:click="editFee(fee)">
            <div class="fee-info">
              <div style="float: left;">
                {{fee.name}}
              </div>
              <div class="fee-blank"></div>
            </div>
            <div class="fee-info">
              <div style="float: left;">
                {{getFee(fee)}}
              </div>
              <div class="fee-blank"></div>
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
            <i class="fa fa-save"></i> 保存
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

  import uploadAttachment from '@/components/parts/uploadAttachment'
  export default {
    props: ['manager'],
    data() {
      return {
        name: '',
        aspect: '',
        construction: '',
        address: '',
        traffic: '',
        floor: 0,
        built: '',
        note: '',
        room: 0,
        keyMoney: 0,
        rent: 0,
        deposit: 0,
        management: 0,
        fees: []
      }
    },
    components: {
      uploadAttachment: uploadAttachment,
    },
    mounted() {
      $('body').layout('fix')

      $("input[type='number']").off("click").on("click", () => {
        $(this).select()
      })
    },
    computed: {
      isValid() {
        if (!this.name) return false
        if (!this.address) return false
        if (this.floor <= 0) return false
        if (this.room <= 0) return false
        if (this.rent <= 0) return false
        if (this.management <= 0) return false
        return true
      },
      aspectName() {
        if (this.aspect) {
          return CONST.aspects[this.aspect].name
        }
        return ''
      }
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      setAspect(aspect) {
        this.aspect = aspect.value
      },
      getFee(fee) {
        let text = ''
        if (fee.base > 0) {
          text += utils.formatMoney(fee.base) + '円'
        }
        if (fee.price > 0) {
          if (text != '') {
            text += ' ＋ '
          }
          text += utils.formatMoney(fee.price) + '円 ＊ 刻み'
        }
        return text
      },
      addFee() {
        let self = this
        utils.event.$emit('FEE_DETAIL', null, true, (fee) => {
          fee.read = 0
          if (CONST.feeTypes[fee.type].type == 'meter') {
            fee.meter = true
          }
          self.fees.push(fee)
        })
      },
      editFee(fee) {
        utils.event.$emit('FEE_DETAIL', fee, true, (newfee) => {
          fee.type = newfee.type
          fee.name = newfee.name
          fee.base = newfee.base
          fee.price = newfee.price
          if (CONST.feeTypes[newfee.type].type == 'meter') {
            fee.meter = true
          }
          else {
            delete fee.meter
          }
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
        if (this.room > 99) {
          utils.event.$emit('SHOW_MESSAGE', 'B008')
          return
        }
        utils.event.$emit('TRIGGER_UPLOAD', (photos) => {
          let data = {
            lord: manager.user._id,
            name: this.name,
            aspect: this.aspect,
            floor: Number(this.floor),
            built: this.built,
            construction: this.construction,
            address: this.address,
            traffic: this.traffic,
            note: this.note,
            room: Number(this.room),
            keyMoney: Number(this.keyMoney),
            rent: Number(this.rent),
            deposit: Number(this.deposit),
            management: Number(this.management),
            fees: this.fees,
            photos: photos
          }
          utils.restPost('/api/addHouse', data).then(
            response => {
              if (response) {
                manager.user.selectedHouse = response.house._id
                self.$router.push({name: 'house'})
              }
            }
          )
        })
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
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .add-body {
    padding: 15px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }
  .btn-primary {
    width: 160px;
  }
  .upload-input {
    padding-left: 35px;
    padding-right: 35px;
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
    width: auto;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-top: 4px solid #3c8dbc;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }
  .fee-info {
    padding: 5px 5px 0px 5px;
  }
  .fee-blank {
    width: 30px;
    height: auto;
    float: left;
  }
  .fee-delete {
    position: absolute;
    right: 2px;
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
    background: #3c8dbc;
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
