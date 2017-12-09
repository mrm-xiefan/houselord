<template>
  <div class="modal fade in" id="contract-modal" tabindex="-1" role="dialog" aria-labelledby="feeModalLabel" aria-hidden="true" data-show="true" data-keyboard="true" data-backdrop="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">

        <div class="modal-header gradient-header">
          <button type="button" class="close" id="close-detail" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true"><i class="glyphicon glyphicon-remove"></i></span>
          </button>
          <h4 class="modal-title">契約延長 - {{manager.payment.house.name}} - {{manager.payment.room.number}}</h4>
        </div>

        <div class="modal-body" v-if="contract">
          <div class="row">
            <div class="col-md-6">
              <div class="input-group">
                <label class="input-label">居住者：</label>
                <label class="input-text label-border">{{contract.resident}}</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="input-group">
                <label class="input-label">電話番号：</label>
                <label class="input-text label-border">{{contract.phone}}</label>
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
            <div class="col-md-4">
              <div class="input-group">
                <label class="input-label">更新料：</label>
                <div class="input-text">
                  <input v-model="recontract" type="number" class="form-control" step="1000" placeholder="入力">
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <label class="input-label"><span class="text-red require">(＊)</span>家賃：</label>
                <div class="input-text">
                  <input v-model="rent" type="number" class="form-control" step="1000" placeholder="入力">
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <label class="input-label">敷金：</label>
                <label class="input-text label-border">{{contract.getDeposit()}}</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="input-group">
                <label class="input-label">開始日：</label>
                <label class="input-text label-border">{{start}}</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <label class="input-label">初回支払：</label>
                <label class="input-text label-border">{{first}}</label>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <label class="input-label"><span class="text-red require">(＊)</span>終了日：</label>
                <div class="input-text">
                  <input id="end-date" type="text" class="form-control" placeholder="選択">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" id="close-fee-detail" class="btn btn-cancel" data-dismiss="modal" aria-label="Close">キャンセル</button>
          <button type="button" id="save-fee-detail" class="btn btn-create" :disabled="!isValid" v-on:click="save">保存</button>
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
  import uuid from 'uuid'
  import Payment from '@/store/payment.js'
  export default {
    props: ['manager'],
    data() {
      return {
        contract: null,
        note: '',
        recontract: 0,
        rent: 0,
        start: '',
        first: '',
        end: ''
      }
    },
    mounted() {
      let self = this
      utils.event.$on('RECONTRACT', (contract, next) => {
        self.contract = contract
        self.note = contract.note
        self.recontract = contract.keyMoney
        self.rent = contract.rent
        self.$nextTick(() => {
          $('#contract-modal').modal('show')
          let end = moment(contract.end)
          self.start = moment(contract.end).add(1, 'days').format('YYYY/MM/DD')
          let i = 0
          while(true) {
            i ++
            let current = moment(contract.first).add(i, 'months')
            if (end < current) {
              self.first = current.format('YYYY/MM/DD')
              end = end.add(1, 'months')
              if (end < current) {
                end = current
              }
              $('#end-date').val(end.format('YYYY/MM/DD'))
              break
            }
          }
          self.pickDate()
        })
      })
    },
    beforeDestroy() {
      utils.event.$off('RECONTRACT')
    },
    computed: {
      isValid() {
        if (!this.contract) return false
        if (Number(this.recontract) < 0) return false
        if (Number(this.rent) <= 0) return false
        return true
      }
    },
    methods: {
      pickDate() {
        let options = {
          autoclose: true,
          language: 'ja',
          format: 'yyyy/mm/dd'
        }
        $('#end-date').datepicker(options)
      },
      checkDate() {
        let tmp = new Date($('#end-date').val())
        this.end = tmp.valueOf()
        if (!this.start) {
          return false
        }
        if (!this.end) {
          return false
        }
        if (!this.first) {
          return false
        }
        if (moment(new Date(this.start)) > moment(new Date(this.end))) {
          return false
        }
        if (moment(new Date(this.start)) > moment(new Date(this.first))) {
          return false
        }
        if (moment(new Date(this.first)) > moment(new Date(this.end))) {
          return false
        }
        return true
      },
      save() {
        let self = this
        if (self.checkDate()) {
          let contract = {
            _id: self.contract._id,
            note: self.note,
            rent: Number(self.rent),
            end: self.end
          }
          let deposit = null
          for (let i = 0; i < self.contract.payments.length; i ++) {
            if (self.contract.payments[i].type == 'deposit' && self.contract.payments[i].DRCR == 'CR') {
              deposit = {
                _id: this.contract.payments[i]._id,
                plan: this.end
              }
              break
            }
          }
          let payments = self.generatePayments()
          utils.restPost('/api/recontract', {
            contract: contract,
            deposit: deposit,
            payments: payments,
            house: manager.payment.house._id,
            room: manager.payment.room._id
          }).then(
            response => {
              if (response) {
                self.contract.over = null
                self.contract.note = self.note
                self.contract.rent = Number(self.rent)
                self.contract.end = self.end
                if (deposit) {
                  for (let i = 0; i < self.contract.payments.length; i ++) {
                    if (self.contract.payments[i]._id == deposit._id) {
                      self.contract.payments[i].plan = self.end
                      break
                    }
                  }
                }
                if (response.payments) {
                  for (let i = 0; i < response.payments.length; i ++) {
                    self.contract.payments.push(new Payment(response.payments[i]))
                  }
                }
                self.contract.sortPayments()
                $('#contract-modal').modal('hide')
              }
            }
          )
        }
        else {
          utils.event.$emit('SHOW_MESSAGE', 'B005')
        }
      },
      generatePayments() {
        let payments = []
        let now = new Date()
        now = now.valueOf()
        // recontract
        if (Number(this.recontract) > 0) {
          payments.push({
            DRCR: 'DR',
            type: '7',
            amount: Number(this.recontract),
            plan: new Date(this.start).valueOf(),
            pay: now
          })
        }
        // first rent
        payments.push({
          DRCR: 'DR',
          type: 'rent',
          amount: Number(this.rent),
          plan: new Date(this.first).valueOf()
        })
        this.generateFees(payments, moment(new Date(this.first)), moment(new Date(this.start)), moment(new Date(this.end)))
        // rents
        let end = moment(new Date(this.end))
        let i = 0
        while(true) {
          i ++
          let current = moment(new Date(this.first)).add(i, 'months')
          if (end < current) {
            break
          }
          payments.push({
            DRCR: 'DR',
            type: 'rent',
            amount: Number(this.rent),
            plan: current.toDate().valueOf()
          })
          this.generateFees(payments, current, moment(new Date(this.start)), moment(new Date(this.end)))
        }

        return payments
      },
      generateFees(payments, base, start, end) {
        for (let i = 0; i < this.contract.fees.length; i ++) {
          let fee = this.contract.fees[i]
          let plan = null
          if (moment([base.year(), base.month(), fee.day]).isValid()) {
            plan = moment([base.year(), base.month(), fee.day])
          }
          else if (moment([base.year(), base.month(), fee.day - 1]).isValid()) {
            plan = moment([base.year(), base.month(), fee.day - 1])
          }
          else if (moment([base.year(), base.month(), fee.day - 2]).isValid()) {
            plan = moment([base.year(), base.month(), fee.day - 2])
          }
          else if (moment([base.year(), base.month(), fee.day - 3]).isValid()) {
            plan = moment([base.year(), base.month(), fee.day - 3])
          }
          if (plan > start && plan <= end) {
            payments.push({
              DRCR: 'DR',
              type: fee.type,
              amount: CONST.feeTypes[fee.type].type == 'meter'? -1: fee.price,
              plan: plan.toDate().valueOf()
            })
          }
        }
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
  .gradient-header {
    background: #00B5ED;
    /* background: -webkit-linear-gradient(left, #00B5ED, #51DCE5);
    background: linear-gradient(to right, #00B5ED, #51DCE5); */
  }

  /* body */
  .modal-body {
    padding: 22px;
  }
  .input-group {
    display: flex;
    align-items: center;
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
    height: 44px;
  }
  .input-text {
    width: calc(100% - 120px);
    padding: 5px;
    margin: 0px;
  }
  .label-border {
    border-bottom: 1px solid #ccc;
    margin-left: 10px;
    margin-right: 5px;
    padding: 6px 12px 6px 12px;
    color: #777;
  }

  /* footer */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0;
    border: none;
    background: #2D2D2D;
  }
  .modal-footer .btn {
    display: block;
    margin: 0;
    padding: 13px 0;
    width: 200px;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    border: none;
    border-radius: 0;
  }
  .modal-footer .btn-create {
    background: #ced941;
  }
  .modal-footer .btn-cancel {
    background: #3e3e3e;
  }

  /* responsive */
  @media (max-width: 992px) {
    .modal-footer {
      display: flex;
      justify-content: space-between;;
    }
    .modal-footer .btn {
      width: 50%;
    }
  }
</style>
