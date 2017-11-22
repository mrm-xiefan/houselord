<template>
  <div class="modal fade in" id="payment-modal" tabindex="-1" role="dialog" aria-labelledby="paymentModalLabel" aria-hidden="true" data-show="true" data-keyboard="true" data-backdrop="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">

        <div class="modal-header gradient-header">
          <button type="button" class="close" id="close-detail" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="glyphicon glyphicon-remove"></i></span></button>
          <h4 class="modal-title">支払 - {{manager.selectedHouse? manager.selectedHouse.name : ''}} - {{room? room.number: ''}}</h4>
        </div>

        <div class="modal-body" v-if="room">

          <div class="select-data" v-for="(contract, i) in room.contracts">

            <div class="data-row box-3column category">
              <div class="modal-item btn-group">
                <input :value="contract.resident" type="text" class="form-control" disabled>
                <span class="input-group-label">居住者:</span>
              </div>
              <div class="modal-item">
                <input :value="contract.getStart()" type="text" class="form-control" disabled>
                <span class="input-group-label">開始日:</span>
              </div>
              <div class="modal-item">
                <input :value="contract.getEnd()" type="text" class="form-control" disabled>
                <span class="input-group-label">終了日:</span>
              </div>
            </div>

            <div class="box box-solid box-primary collapsed-box">
              <div class="box-header">
                <h3 class="box-title">明細</h3>
                <div class="box-tools pull-right">
                  <div class="btn btn-sm" v-on:click="addIncome(contract)">
                    支出補正
                  </div>
                  <div class="btn btn-sm" style="margin-right: 20px;" v-on:click="addExpense(contract)">
                    収入補正
                  </div>
                  <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i>
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
                    <tr v-for="(pay, j) in contract.pays" :class="{'unpaid-row': isUnpaid(pay)}">
                      <td>
                        <span :class="{'label': true, 'bg-blue': pay.DRCR == 'DR', 'bg-yellow': pay.DRCR == 'CR'}">
                          {{getDRCR(pay.DRCR)}}
                        </span>
                      </td>
                      <td>{{getType(pay.type)}}</td>
                      <td :class="{'unpay-input': !pay.payment, 'right-row': true}">
                        <template v-if="pay.payment">
                          {{getAmount(pay.amount)}}
                        </template>
                        <template v-else>
                          <input v-model="pay.amount" type="number" step=1000 class="form-control">
                        </template>
                      </td>
                      <td :class="{'unpay-row': !pay.payment}">{{getDate(pay)}}</td>
                      <td :class="{'unpay-input': !pay.payment}">
                        <div class="btn btn-primary btn-minimum" v-if="!pay.payment" v-on:click="agreePayment(room, i, contract, j, pay)">
                          確定
                        </div>
                        <div class="badge bg-green" v-else>
                          済み
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  import moment from 'moment'
  import Contract from '@/store/contract.js'
  export default {
    props: ['manager'],
    data() {
      return {
        room: null
      }
    },
    mounted() {
      let self = this
      utils.event.$on('CONTRACT_PAY', (room) => {
        self.room = room
        self.$nextTick(() => {
          $('.box').boxWidget()
          $('#payment-modal').modal('show')
        })
      })
    },
    beforeDestroy() {
      utils.event.$off('CONTRACT_PAY')
    },
    methods: {
      getDRCR(DRCR) {
        if (DRCR == 'DR') {
          return '収入'
        }
        else {
          return '支出'
        }
      },
      getType(type) {
        if (type == 'keyMoney') {
          return '礼金'
        }
        else if (type == 'deposit') {
          return '敷金'
        }
        else if (type == 'rent') {
          return '家賃'
        }
        else if (type == 'other') {
          return '補正'
        }
      },
      getAmount(amount) {
        return utils.formatMoney(Number(amount))
      },
      getDate(pay) {
        if (pay.payment) {
          return utils.formatDate(pay.payment)
        }
        else {
          return utils.formatDate(pay.plan)
        }
      },
      isUnpaid(pay) {
        let now = new Date()
        now = now.valueOf()
        if (!pay.payment && pay.plan < now) {
          return true
        }
        else {
          return false
        }
      },
      addIncome(contract) {
        let now = new Date()
        now = now.valueOf()
        contract.pays.push({
          DRCR: 'DR',
          type: 'other',
          amount: 0,
          plan: now
        })
      },
      addExpense(contract) {
        let now = new Date()
        now = now.valueOf()
        contract.pays.push({
          DRCR: 'CR',
          type: 'other',
          amount: 0,
          plan: now
        })
      },
      agreePayment(room, i, contract, j, pay) {
        let self = this
        let now = new Date()
        now = now.valueOf()
        room.contracts[i].pays[j].payment = now

        utils.restPost('/api/fixPayment', {_id: contract._id, pays: contract.pays, finished: contract.isFinished()}).then(
          response => {
            if (response) {
              self.$forceUpdate()
              utils.event.$emit('REFRESH_ROOM')
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
  /* header */
  .modal-header {
    padding: 12px 22px 10px;
  }
  .modal-header h4 {
    color: #fff;
    font-size: 22px;
    font-weight: 700;
  }
  .modal-header .close {
    margin: 0;
    color: #fff;
    text-shadow: none;
    opacity: 1;
  }
  .modal-header .close i {
    font-size: 28px;
  }
  .modal-header .close:focus {
    outline: none;
  }

  /* body */
  .modal-body {
    padding: 10px;
  }
  .select-data {
    flex: 2 1 auto;
    margin-bottom: 20px;
    border-bottom: 1px solid #605ca8;
  }
  .data-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .data-row .modal-item {
    flex: 1 1 auto;
    margin: 0 5px;
    position: relative;
  }
  .data-row .modal-item .btn {
    height: 46px;
    border: none;
  }
  .modal-item input {
    padding-left: 70px;
  }
  .long-label input {
    padding-left: 85px;
  }
  .data-row .modal-item .btn:focus,
  .btn-group.open .dropdown-toggle {
    background: #e6e6e6;
    box-shadow: none;
  }
  .input-group-label {
    position: absolute;
    top: 13px;
    left: 5px;
    font-size: 14px;
    color: #aaa;
  }
  .data-row .modal-item label {
    display: none;
  }
  .data-row .modal-item input[type="text"],
  .data-row .modal-item input[type="number"] {
    height: 46px;
    background: #f4f4f4;
    border: none;
    border-radius: 4px;
  }
  .category {
    margin-bottom: 22px;
  }
  .category .modal-item {
    font-size: 18px;
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

  /* responsive */
  @media (max-width: 480px) {
    .data-row {
      flex-direction: column;
      margin: 0;
    }
    .data-row .modal-item {
      margin: 0 0 10px;
    }
  }
</style>
