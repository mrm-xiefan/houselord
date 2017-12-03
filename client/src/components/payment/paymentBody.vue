<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">

      <div class="bg-gray payment-header text-black">
        <i class="fa fa-money"></i> 支払 - {{manager.payment.house.name}} - {{manager.payment.room.number}}
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(payment, j) in contract.payments" :class="{'unpaid-row': payment.isUnpaid()}">
                    <td>
                      <span :class="{'label': true, 'bg-blue': payment.DRCR == 'DR', 'bg-yellow': payment.DRCR == 'CR'}">
                        {{payment.getDRCR()}}
                      </span>
                    </td>
                    <td>{{payment.getType()}}</td>
                    <td :class="{'unpay-input': !payment.pay, 'right-row': true}">
                      <template v-if="payment.pay">
                        {{payment.getAmount()}}
                      </template>
                      <template v-else>
                        <input v-model="payment.amount" type="number" step=1000 class="form-control">
                      </template>
                    </td>
                    <td :class="{'unpay-row': !payment.pay}">{{payment.getDate()}}</td>
                    <td :class="{'unpay-input': !payment.pay}">
                      <div class="btn btn-primary btn-minimum" v-if="!payment.pay" v-on:click="agreePayment(contract, payment)">
                        支払
                      </div>
                      <div class="badge bg-green" v-else>
                        済み
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="box-footer">
              <button class="btn btn-warning pull-right" v-on:click="addExpense(contract)">
                <i class="fa fa-plus-circle"></i> 支出補正
              </button>
              <button class="btn btn-primary pull-right" v-on:click="addIncome(contract)">
                  <i class="fa fa-plus-circle"></i> 収入補正
              </button>
            </div>
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
          type: 'other',
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
          type: 'other',
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
      backward() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .payment-header {
    padding: 15px;
    border: 1px solid #aaa;
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .payment-body {
    padding: 15px;
    border: 1px solid #aaa;
    border-radius: 3px;
  }

  thead {
    background: #eee;
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
  .btn-minimum {
    padding: 6px;
  }
  .box-footer .btn {
    margin-right: 10px;
  }
</style>
