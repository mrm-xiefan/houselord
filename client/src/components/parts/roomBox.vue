<template>
  <div :class="['box', 'box-solid', room.isRented()? 'bg-rent-gradient': 'bg-not-rent-gradient', 'room-box']">
    <div class="box-header">
      {{room.number}}<span class="text-gray" v-if="room.size">（{{room.size}}）</span>
      <div class="pull-right box-tools">
        <button type="button" :class="['btn', room.isRented()? 'btn-success': 'btn-primary', 'btn-sm', 'daterange']">
          <i class="fa fa-calendar"></i>
        </button>
      </div>
    </div>
    <div class="box-body">
      <div class="info-row">
        <div class="money-box">
          <div class="money-row">
            <div class="money-title"><i class="fa fa-money"></i> 契約金：</div><div class="money-amount">{{room.getKeyMoney()}}</div>
          </div>
          <div class="money-row">
            <div class="money-title"><i class="fa fa-money"></i> 賃貸料：</div><div class="money-amount">{{room.getRent()}} / 月</div>
          </div>
          <div class="money-row">
            <div class="money-title"><i class="fa fa-money"></i> 保証金：</div><div class="money-amount">{{room.getDeposit()}}</div>
          </div>
        </div>
        <div class="status-box">
          <!-- <div class="badge bg-blue" v-if="room.isReserved()">
            予約中
          </div> -->
          <div class="badge bg-green" v-if="room.isRented()">
            レンタル中
          </div>
          <div class="badge bg-red" v-if="room.isUnpaid()">
            賃貸料未払い
          </div>
        </div>
      </div>
      <div class="resident-row">
        <div class="info-row">
          <div class="resident-box">
            <div class="resident-title"><i class="fa fa-user"></i> 居住者：</div><div class="resident-content">山田太郎</div>
          </div>
          <div class="resident-box">
            <div class="resident-title"><i class="fa fa-phone"></i> 連絡先：</div><div class="resident-content">08011112222</div>
          </div>
        </div>
        <div class="info-row">
          <div class="resident-note">
            <div class="resident-title"><i class="fa fa-sticky-note"></i> 備 考：</div><div class="resident-content">連絡取れにくい。留守が多い。やばい！とにかくやばい！お金持ち。摂取対象！</div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-footer no-padding">
      <div class="room-button" v-on:click="deal(room)">
        契約
      </div>
      <div class="room-button">
        解約
      </div>
      <div class="room-button">
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
    props: ['manager', 'room'],
    methods: {
      deal(room) {
        utils.event.$emit('CONTRACT_DETAIL', room)
      }
    }
  }
</script>

<style scoped>
  .room-box {
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
  }
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
    width: 80px;
  }
  .status-box {
    width: calc(30%);
    height: 100%;
  }
  .badge {
    margin: 5px;
  }
  .resident-row {
    padding: 10px 5px 10px 5px;
    border: 1px solid #00a65a;
    border-radius: 5px;
  }
  .resident-box {
    margin: 5px;
    width: calc(50%);
    overflow: hidden;
  }
  .resident-title {
    width: 80px;
    float: left;
  }
  .resident-content {
    float: left;
    width: calc(100% - 80px);
  }
  .resident-note {
    margin: 5px;
    overflow: hidden;
  }
  .box-footer {
    display: flex;
    justify-content: center;
  }
  .room-button {
    color: #333;
    font-size: 15px;
    padding: 15px;
    cursor: pointer;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    margin-left: 5px;
    margin-right: 5px;
  }
  .room-button:hover {
    box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.5);
  }
</style>
