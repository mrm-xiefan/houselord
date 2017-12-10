<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">

      <div class="bg-blue payment-header">
        <i class="glyphicon glyphicon-pencil"></i> {{manager.payment.house.name}} - {{manager.payment.room.number}}
      </div>

      <div class="bg-gray-light payment-body">
        <div v-for="(contract, i) in manager.payment.room.contracts">

          <div class="box box-solid box-primary">
            <div class="box-header">
              <h3 class="box-title">支払明細 - {{contract.resident}} - {{contract.getStart()}} - {{contract.getEnd()}}</h3>
              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse">
                  <i class="fa fa-minus"></i>
                </button>
              </div>
            </div>
            <div class="box-body table-responsive no-padding">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>収支</th>
                    <th>科目</th>
                    <th class="right-row">金額(円)</th>
                    <th>支払日</th>
                    <th>支払</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(payment, j) in contract.payments" :class="{'unpaid-row': payment.isUnpaid() && contract.over != 'cancel'}">
                    <td>
                      <span :class="{'label': true, 'bg-blue': payment.DRCR == 'DR', 'bg-yellow': payment.DRCR == 'CR'}">
                        {{payment.getDRCR()}}
                      </span>
                    </td>
                    <td>{{payment.getType()}}</td>
                    <td :class="{'unpay-input': !payment.pay && contract.over != 'cancel' && !payment.meter, 'text-cancel': !payment.pay && contract.over == 'cancel', 'right-row': true}">
                      <template v-if="payment.meter">
                        未検針
                      </template>
                      <template v-else-if="payment.pay || contract.over == 'cancel'">
                        {{payment.getAmount()}}
                      </template>
                      <template v-else>
                        <input v-model="payment.amount" type="number" step=1000 class="form-control">
                      </template>
                    </td>
                    <td :class="{'unpay-row': !payment.pay}">{{payment.getDate()}}</td>
                    <td :class="{'unpay-input': !payment.pay && contract.over != 'cancel'}">
                      <div class="btn btn-primary btn-minimum" v-if="!payment.pay && contract.over != 'cancel'" v-on:click="agreePayment(contract, payment)">
                        支払
                      </div>
                      <div class="badge bg-red" v-else-if="!payment.pay && contract.over == 'cancel'">
                        取消
                      </div>
                      <div class="badge bg-green" v-else>
                        済み
                      </div>
                    </td>
                    <td :class="{'unpay-input': !payment.pay && contract.over != 'cancel'}">
                      <div class="btn btn-danger btn-minimum" v-if="!payment.pay && contract.over != 'cancel'" v-on:click="removePayment(contract, payment, j)">
                        削除
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="box-footer">
              <button class="btn btn-warning pull-left" v-on:click="addExpense(contract)" :disabled="contract.over == 'cancel'">
                <i class="fa fa-plus-circle"></i> 支出補正
              </button>
              <button class="btn btn-primary pull-left" v-on:click="addIncome(contract)" :disabled="contract.over == 'cancel'">
                  <i class="fa fa-plus-circle"></i> 収入補正
              </button>
              <button class="btn btn-primary pull-right" v-on:click="recontract(contract)" :disabled="contract.over == 'cancel'">
                <i class="fa fa-legal"></i> 契約延長
              </button>
              <button class="btn btn-danger pull-right" v-on:click="cancel(contract)" :disabled="contract.isOver()">
                <i class="glyphicon glyphicon-erase"></i> 契約解除
              </button>
            </div>
          </div>

        </div>
        <div class="payment-action">
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

  import Payment from '@/store/payment.js'
  export default {
    props: ['manager'],
    mounted() {
      $('body').layout('fix')
      $('.box').boxWidget()
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      addIncome(contract) {
        let now = new Date()
        now = now.valueOf()
        let payment = {
          DRCR: 'DR',
          type: '99',
          amount: 0,
          plan: now
        }
        let contractJson = {
          _id: contract._id,
          house: manager.payment.house._id,
          room: manager.payment.room._id
        }
        this.addPayment(contract, contractJson, [payment], contract.isOver())
      },
      addExpense(contract) {
        let now = new Date()
        now = now.valueOf()
        let payment = {
          DRCR: 'CR',
          type: '99',
          amount: 0,
          plan: now
        }
        let contractJson = {
          _id: contract._id,
          house: manager.payment.house._id,
          room: manager.payment.room._id
        }
        this.addPayment(contract, contractJson, [payment], contract.isOver())
      },
      addPayment(contract, contractJson, payments, revive) {
        utils.restPost('/api/addPayment', {payments: payments, contract: contractJson, revive: revive}).then(
          response => {
            if (response) {
              for (let i = 0; i < response.payments.length; i ++) {
                contract.payments.push(new Payment(response.payments[i]))
                contract.sortPayments()
              }
            }
          }
        )
      },
      agreePayment(contract, payment) {
        let self = this
        let now = new Date()
        now = now.valueOf()
        payment.pay = now
        utils.restPost('/api/fixPayment', {payment: payment._id, pay: payment.pay, contract: contract._id, over: contract.isOver()}).then(
          response => {
            if (response) {
            }
          }
        )
      },
      removePayment(contract, payment, j) {
        utils.restPost('/api/deletePayment', {payment: {_id: payment._id}, contract: contract._id, over: contract.willOver()}).then(
          response => {
            if (response) {
              contract.payments.splice(j, 1)
            }
          }
        )
      },
      recontract(contract) {
        utils.event.$emit('RECONTRACT', contract)
      },
      cancel(contract) {
        utils.event.$emit('SHOW_MESSAGE', 'I003', () => {
          utils.restPost('/api/cancelContract', {_id: contract._id, over: 'cancel'}).then(
            response => {
              if (response) {
                contract.over = 'cancel'
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
  .payment-header {
    padding: 15px;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .payment-body {
    padding: 15px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }

  thead {
    background: #3c8dbc;
    opacity: 0.7;
    color: #fff;
  }
  .unpaid-row {
    background: rgb(240, 197, 197);
  }
  .right-row {
    text-align: right;
  }
  .unpay-input {
    padding: 1px 5px 0px 5px;
    width: 120px;
  }
  .unpay-row {
    color: #aaa;
  }
  .text-cancel {
    text-decoration: line-through;
    color: #aaa;
  }
  .btn-minimum {
    padding: 6px;
  }
  .box-footer .btn {
    margin-right: 10px;
  }
  .payment-action {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .payment-action button {
    width: 120px;
  }
</style>
