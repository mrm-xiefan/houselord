<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">

      <div class="contract-header bg-blue">
        <i class="fa fa-legal"></i> 契約 - {{manager.contract.house.name}} - {{manager.contract.room.number}}
      </div>

      <div class="bg-gray-light contract-body">
        <h4>1.居住者情報を入力する</h4>
        <div class="row">
          <div class="col-md-6">
            <div class="input-group">
              <label class="input-label"><span class="text-red require">(＊)</span>居住者：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.resident" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <label class="input-label">電話番号：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.phone" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="input-group">
              <label class="input-label">備考：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.note" type="text" class="form-control" placeholder="入力">
              </div>
            </div>
          </div>
        </div>

        <h4>2.契約情報を入力する</h4>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">礼金：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.keyMoney" type="number" class="form-control" step="1000" placeholder="入力" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require" v-if="manager.contract.contract.isNew">(＊)</span>家賃：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.rent" type="number" class="form-control" step="1000" placeholder="入力" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">敷金：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.deposit" type="number" class="form-control" step="1000" placeholder="入力" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">火災保険：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.fireInsurance" type="number" class="form-control" step="1000" placeholder="入力" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">クリニング費：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.clean" type="number" class="form-control" step="1000" placeholder="入力" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label">管理費：</label>
              <div class="input-text">
                <input v-model="manager.contract.contract.management" type="number" class="form-control" step="1000" placeholder="入力" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require" v-if="manager.contract.contract.isNew">(＊)</span>入居日：</label>
              <div class="input-text">
                <input id="start-date" type="text" class="form-control" placeholder="選択" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require" v-if="manager.contract.contract.isNew">(＊)</span>初回支払：</label>
              <div class="input-text">
                <input id="first-date" type="text" class="form-control" placeholder="選択" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <label class="input-label"><span class="text-red require" v-if="manager.contract.contract.isNew">(＊)</span>終了日：</label>
              <div class="input-text">
                <input id="end-date" type="text" class="form-control" placeholder="選択" :disabled="!manager.contract.contract.isNew">
              </div>
            </div>
          </div>
        </div>

        <h4>3.定常費用を確定する</h4>

        <div class="box box-solid box-primary">
          <div class="box-header">
            <h3 class="box-title">定常費用一覧</h3>
          </div>
          <div class="box-body table-responsive no-padding">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>種類</th>
                  <th>費用名</th>
                  <th>基本料金</th>
                  <th>単位料金</th>
                  <th>初回検針</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fee, index) in manager.contract.contract.fees">
                  <td>
                    <span class="label bg-blue">
                      {{getFeeTypeName(fee)}}
                    </span>
                  </td>
                  <td>{{fee.name}}</td>
                  <td class="input-column">
                    <input v-model="fee.base" type="number" step=1000 class="form-control" :disabled="!manager.contract.contract.isNew">
                  </td>
                  <td class="input-column">
                    <input v-model="fee.price" type="number" step=1000 class="form-control" v-if="isMeter(fee)" :disabled="!manager.contract.contract.isNew">
                  </td>
                  <td class="input-column">
                    <input v-model="fee.read" type="number" step=1 class="form-control" v-if="isMeter(fee)" :disabled="!manager.contract.contract.isNew">
                  </td>
                  <td class="input-column">
                    <div class="btn btn-danger btn-minimum pull-right" v-on:click="removeFee(index)" v-if="manager.contract.contract.isNew">
                      <i class="fa fa-close"></i> 削除
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="box-footer">
            <button class="btn btn-primary pull-right" v-on:click="addFee" v-if="manager.contract.contract.isNew">
              <i class="fa fa-plus-circle"></i> 追加
            </button>
          </div>
        </div>

        <div class="contract-action">
          <button type="button" class="btn btn-primary" :disabled="!isValid" v-on:click="saveContract">
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

  import moment from 'moment'
  import uuid from 'uuid'
  import Contract from '@/store/contract.js'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
      this.pickDate()
    },
    computed: {
      isValid() {
        return manager.contract.contract.isValueValid()
      }
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      getFeeTypeName(fee) {
        return CONST.feeTypes[fee.type].name
      },
      isMeter(fee) {
        return CONST.feeTypes[fee.type].type == 'meter'
      },
      pickDate() {
        let options = {
          autoclose: true,
          language: 'ja',
          format: 'yyyy/mm/dd'
        }
        $('#start-date').val('')
        if (manager.contract.contract.start) {
          $('#start-date').val(utils.formatDate(manager.contract.contract.start))
        }
        $('#start-date').datepicker(options)
        $('#end-date').val('')
        if (manager.contract.contract.end) {
          $('#end-date').val(utils.formatDate(manager.contract.contract.end))
        }
        $('#end-date').datepicker(options)
        $('#first-date').val('')
        if (manager.contract.contract.first) {
          $('#first-date').val(utils.formatDate(manager.contract.contract.first))
        }
        $('#first-date').datepicker(options)
      },
      addFee() {
        utils.event.$emit('FEE_DETAIL', null, false, (fee) => {
          fee.read = 0
          manager.contract.contract.fees.push(fee)
        })
      },
      removeFee(index) {
        manager.contract.contract.fees.splice(index, 1)
      },
      check() {
        let tmp = new Date($('#start-date').val())
        manager.contract.contract.start = tmp.valueOf()
        tmp = new Date($('#end-date').val())
        manager.contract.contract.end = tmp.valueOf()
        tmp = new Date($('#first-date').val())
        manager.contract.contract.first = tmp.valueOf()

        if (!manager.contract.contract.isDateValid()) {
          utils.event.$emit('SHOW_MESSAGE', 'B005')
          return false
        }
        if (manager.contract.contract.checkFee()) {
          utils.event.$emit('SHOW_MESSAGE', manager.contract.contract.checkFee())
          return false
        }
        return true
      },
      saveContract() {
        let self = this
        if (manager.contract.contract.isNew) {
          manager.contract.contract.keyMoney = Number(manager.contract.contract.keyMoney)
          manager.contract.contract.rent = Number(manager.contract.contract.rent)
          manager.contract.contract.deposit = Number(manager.contract.contract.deposit)
          manager.contract.contract.fireInsurance = Number(manager.contract.contract.fireInsurance)
          manager.contract.contract.clean = Number(manager.contract.contract.clean)
          manager.contract.contract.management = Number(manager.contract.contract.management)
          if (self.check()) {
            let contract = {
              lord: manager.user._id,
              house: manager.contract.house._id,
              room: manager.contract.room._id,
              resident: manager.contract.contract.resident,
              phone: manager.contract.contract.phone,
              note: manager.contract.contract.note,
              start: manager.contract.contract.start,
              end: manager.contract.contract.end,
              first: manager.contract.contract.first,
              keyMoney: manager.contract.contract.keyMoney,
              rent: manager.contract.contract.rent,
              deposit: manager.contract.contract.deposit,
              fireInsurance: manager.contract.contract.fireInsurance,
              clean: manager.contract.contract.clean,
              management: manager.contract.contract.management,
              fees: manager.contract.contract.fees
            }
            let payments = self.generatePayments()
            utils.restPost('/api/saveContract', {contract: contract, payments: payments}).then(
              response => {
                if (response) {
                  self.$router.push({name: 'house'})
                }
              }
            )
          }
        }
        else {
          utils.restPost('/api/updateContract', {
            _id: manager.contract.contract._id,
            resident: manager.contract.contract.resident,
            phone: manager.contract.contract.phone,
            note: manager.contract.contract.note
          }).then(
            response => {
              if (response) {
                self.$router.push({name: 'house'})
              }
            }
          )
        }
      },
      generatePayments() {
        let payments = []
        let now = new Date()
        now = now.valueOf()
        let contract = manager.contract.contract
        if (manager.contract.contract.keyMoney > 0) {
          payments.push({
            DRCR: 'DR',
            type: 'keyMoney',
            amount: manager.contract.contract.keyMoney,
            plan: contract.start,
            pay: now
          })
        }
        if (manager.contract.contract.deposit > 0) {
          payments.push({
            DRCR: 'DR',
            type: 'deposit',
            amount: manager.contract.contract.deposit,
            plan: contract.start,
            pay: now
          })
        }
        if (manager.contract.contract.fireInsurance > 0) {
          payments.push({
            DRCR: 'DR',
            type: 'fireInsurance',
            amount: manager.contract.contract.fireInsurance,
            plan: contract.start,
            pay: now
          })
        }
        if (manager.contract.contract.clean > 0) {
          payments.push({
            DRCR: 'DR',
            type: 'clean',
            amount: manager.contract.contract.clean,
            plan: contract.end
          })
        }

        payments.push({
          DRCR: 'DR',
          type: 'rent',
          amount: manager.contract.contract.rent,
          plan: contract.first
        })
        if (manager.contract.contract.management > 0) {
          payments.push({
            DRCR: 'DR',
            type: 'management',
            amount: manager.contract.contract.management,
            plan: contract.first
          })
        }
        this.generateFees(payments, contract.first)

        let end = moment(contract.end)
        let i = 0
        while(true) {
          i ++
          let current = moment(contract.first).add(i, 'months')
          if (end < current) {
            break
          }
          payments.push({
            DRCR: 'DR',
            type: 'rent',
            amount: manager.contract.contract.rent,
            plan: current.toDate().valueOf()
          })
          if (manager.contract.contract.management > 0) {
            payments.push({
              DRCR: 'DR',
              type: 'management',
              amount: manager.contract.contract.management,
              plan: current.toDate().valueOf()
            })
          }
          this.generateFees(payments, current.toDate().valueOf())
        }

        if (manager.contract.contract.deposit > 0) {
          payments.push({
            DRCR: 'CR',
            type: 'deposit',
            amount: manager.contract.contract.deposit,
            plan: contract.end
          })
        }
        return payments
      },
      generateFees(payments, plan) {
        for (let i = 0; i < manager.contract.contract.fees.length; i ++) {
          let fee = manager.contract.contract.fees[i]
          if (CONST.feeTypes[fee.type].type == 'meter') {
            fee.scales = [fee.read]
          }
          else {
            let payment = {
              DRCR: 'DR',
              type: fee.type,
              amount: fee.base,
              plan: plan
            }
            payments.push(payment)
          }
        }
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
