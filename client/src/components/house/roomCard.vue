<template>
  <div :class="['box', 'box-solid', room.isRented()? 'bg-rent-gradient': 'bg-not-rent-gradient', 'room-card']">
    <div class="box-header">
      {{room.number}}<span class="text-gray" v-if="room.size">（{{room.size}}）</span>
      <div class="pull-right box-tools">
        <button type="button" :class="['btn', room.isRented()? 'btn-success': 'btn-primary', 'btn-sm', 'daterange']" v-on:click="update(room)">
            <i class="glyphicon glyphicon-pencil"></i>
          </button>
        <button type="button" :class="['btn', room.isRented()? 'btn-success': 'btn-primary', 'btn-sm', 'daterange']" v-on:click="remove(room, index)">
          <i class="glyphicon glyphicon-remove"></i>
        </button>
      </div>
    </div>
    <div class="box-body">
      <div class="info-row">
        <div class="money-box">
          <div class="money-row">
            <div class="money-title">入室金：</div><div class="money-amount">{{room.getKeyMoney()}}</div>
          </div>
          <div class="money-row">
            <div class="money-title">家賃：</div><div class="money-amount">{{room.getRent()}}</div>
          </div>
          <div class="money-row">
            <div class="money-title">敷金：</div><div class="money-amount">{{room.getDeposit()}}</div>
          </div>
        </div>
        <div class="status-box">
          <div class="badge bg-green" v-if="room.isRented()">
            レンタル中
          </div>
          <div class="badge bg-blue" v-else>
            空室
          </div>
          <div class="badge bg-green" v-if="room.getFutureContract()">
            予約あり
          </div>
          <div class="badge bg-red" v-if="room.isUnpaid()">
            未払いあり
          </div>
        </div>
      </div>
      <div class="contract-row" v-if="!room.isRented()">
        <div class="info-row contract-blue">
          <div class="contract-box">
            <div class="contract-title"><i class="fa fa-user"></i></div><div class="contract-content">-</div>
          </div>
        </div>
      </div>
      <div class="contract-row" v-else>
        <div class="info-row contract-green" v-for="contract in room.contracts">
          <div class="contract-box">
            <div class="contract-title"><i class="fa fa-user"></i></div><div class="contract-content">{{contract.resident}}</div>
            <div class="contract-title"><i class="fa fa-calendar"></i></div><div class="contract-content">{{contract.getStart()}} ~ {{contract.getEnd()}}</div>
            <div class="contract-button"><i class="fa fa-money bg-green" v-on:click="pay(room, contract)"></i></div>
            <div class="contract-button"><i class="fa fa-eye bg-green" v-on:click="view(room, contract)"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-footer no-padding">
      <div class="room-button" v-on:click="deal(room)">
        契約
      </div>
      <div class="room-button" v-on:click="pay(room)">
        解約
      </div>
      <div class="room-button" v-on:click="pay(room)">
        延長
      </div>
      <div class="room-button" v-on:click="pay(room)">
        支払
      </div>
    </div>
  </div>
</template>

<script>
  import CONST from '@/store/const.js'
  import manager from '@/store/manager.js'
  import utils from '@/tool/utils.js'

  export default {
    props: ['manager', 'room', 'index'],
    methods: {
      deal(room) {
        manager.contract.query = {
          house: room.house,
          room: room._id,
          contract: null
        }
        this.$router.push({name: 'contract'})
      },
      update(room) {
        manager.room = {
          _id: room._id,
          number: room.number,
          keyMoney: room.keyMoney,
          rent: room.rent,
          deposit: room.deposit
        }
        this.$router.push({name: 'room'})
      },
      remove(room, index) {
        utils.event.$emit('SHOW_MESSAGE', 'I004', () => {
          utils.restPost('/api/deleteRoom', {room:{_id: room._id}}).then(
            response => {
              if (response) {
                manager.rooms.splice(index, 1)
              }
            }
          )
        })
      },
      pay(room, contract) {
        if (room.contracts.length > 0) {
          manager.payment.query = {
            house: room.house,
            room: room._id
          }
          if (contract) {
            manager.payment.contract = contract._id
          }
          else {
            manager.payment.contract = ''
          }
          this.$router.push({name: 'payment'})
        }
        else {
          utils.event.$emit('SHOW_MESSAGE', 'B007')
        }
      },
      view(room, contract) {
        manager.contract.query = {
          house: room.house,
          room: room._id,
          contract: contract._id
        }
        this.$router.push({name: 'contract'})
      }
    }
  }
</script>

<style scoped>
  .bg-rent-gradient {
    background: #00a65a;
    background: -webkit-linear-gradient(bottom, #00a65a, #00ca6d);
    background: linear-gradient(to top right, #00a65a, #00ca6d);
    background: -ms-linear-gradient(bottom, #00a65a, #00ca6d) !important;
    background: -moz-linear-gradient(center bottom, #00a65a 0%, #00ca6d 100%) !important;
    background: -o-linear-gradient(#00ca6d, #00a65a) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ca6d', endColorstr='#00a65a', GradientType=0) !important;
    color: #fff;
  }
  .bg-not-rent-gradient {
    background: #3c8dbc;
    background: -webkit-linear-gradient(bottom, #3c8dbc, #67a8ce);
    background: linear-gradient(to top right, #3c8dbc, #67a8ce);
    background: -ms-linear-gradient(bottom, #3c8dbc, #67a8ce) !important;
    background: -moz-linear-gradient(center bottom, #3c8dbc 0%, #67a8ce 100%) !important;
    background: -o-linear-gradient(#67a8ce, #3c8dbc) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#67a8ce', endColorstr='#3c8dbc', GradientType=0) !important;
    color: #fff;
  }
  .box-header {
    font-size: 20px;
  }
  .box-header span {
    font-size: 16px;
  }
  .info-row {
    display: flex;
    align-items: center;
  }
  .money-box {
    width: calc(70%);
  }
  .money-row {
    margin: 10px;
    display: flex;
  }
  .money-title {
    width: 70px;
  }
  .status-box {
    width: calc(30%);
    height: 100%;
  }
  .badge {
    margin: 5px;
  }
  .contract-green {
    margin-top:5px;
    margin-bottom: 5px;
    border-radius: 5px;
    border: 1px solid #00a65a;
  }
  .contract-blue {
    margin-top:5px;
    margin-bottom: 5px;
    border-radius: 5px;
    border: 1px solid #3c8dbc;
  }
  .contract-box {
    margin: 5px;
    width: 100%;
    overflow: hidden;
  }
  .contract-title {
    width: 20px;
    float: left;
  }
  .contract-content {
    min-width: 80px;
    float: left;
  }
  .contract-button {
    float: right;
    padding-right: 3px;
    padding-left: 3px;
    cursor: pointer;
  }
  .contract-button:hover {
    opacity: 0.6;
  }
  .contract-button i {
    padding: 2px;
    border-radius: 5px;
  }
  .box-footer {
    display: flex;
    justify-content: center;
  }
  .room-button {
    color: #555;
    font-size: 15px;
    padding: 15px;
    cursor: pointer;
    background: #eee;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .room-button:hover {
    box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.5);
  }
</style>
