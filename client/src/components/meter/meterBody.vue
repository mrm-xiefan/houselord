<template>
  <div class="content-wrapper">
    <section class="content" v-on:click="closeSide">
      <div class="houses-area">
        <div class="house-items">
          <ul>
            <li :class="{'house-item': true, 'house-item-selected': manager.user.selectedHouse && house._id == manager.user.selectedHouse}" v-for="house in manager.houses" v-on:click="selectHouse(house)">
              {{house.name}}
            </li>
          </ul>
        </div>
      </div>

      <div class="box box-solid box-primary">
        <div class="box-header">
          <h3 class="box-title">メーター一覧</h3>
        </div>
        <div class="box-body table-responsive no-padding">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>部屋番号</th>
                <th>メーター</th>
                <th>料金種類</th>
                <th>基本料金</th>
                <th>単位料金</th>
                <th>前回検針日</th>
                <th>前回刻み</th>
                <th>検針</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(room, i) in manager.rooms">
                <tr v-for="meter in room.meters" :class="{'double': i % 2 == 1}">
                  <td>{{room.number}}</td>
                  <td>{{meter.name}}</td>
                  <td>{{getFeeType(meter.type)}}</td>
                  <td>{{meter.base}}</td>
                  <td>{{meter.price}}</td>
                  <td>{{meter.lastDate()}}</td>
                  <td>{{meter.lastRead()}}</td>
                  <td class="input-column">
                    <input :id="meter._id" type="number" class="form-control" @keyup.enter="readMeter(meter)">
                  </td>
                  <td class="input-column">
                    <div class="btn btn-primary btn-minimum pull-right" v-on:click="readMeter(meter)">
                      確定
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr></tr>
            </tfoot>
          </table>
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
    mounted() {
      $('body').layout('fix')
    },
    methods: {
      closeSide() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
          $('.control-sidebar').removeClass('control-sidebar-open')
        }
      },
      selectHouse(house) {
        utils.restPost('/api/selectHouseForMeter', {_id: house._id}).then(
          response => {
            if (response) {
              manager.user.selectedHouse = house._id
              manager.refreshRoom(response)
            }
          }
        )
      },
      getFeeType(type) {
        return CONST.feeTypes[type].name
      },
      readMeter(meter) {
        if ($('#' + meter._id).val() == '') {
          utils.event.$emit('SHOW_MESSAGE', 'B012')
          return
        }
        let scaleRead = Number($('#' + meter._id).val())
        if (scaleRead < 0) {
          utils.event.$emit('SHOW_MESSAGE', 'B012')
          return
        }
        if (meter.lastRead() != '-' && meter.lastRead() >= scaleRead) {
          utils.event.$emit('SHOW_MESSAGE', 'B012')
          return
        }
        let now = new Date()
        now = now.valueOf()
        let scale = {
          scaleDate: now,
          scaleRead: scaleRead
        }
        let meterJson = {
          _id: meter._id,
          lord: meter.lord,
          house: meter.house,
          room: meter.room
        }
        let amount = 0
        if (meter.lastRead() != '-') {
          amount = Math.round(parseInt(meter.price) * (parseInt(scale.scaleRead) - parseInt(meter.lastRead())) + parseInt(meter.base))
        }
        else {
          amount = Math.round(parseInt(meter.price) * parseInt(scale.scaleRead) + parseInt(meter.base))
        }
        let expense = {
          lord: meter.lord,
          house: meter.house,
          room: meter.room,
          meter: meter._id,
          DRCR: 'CR',
          type: meter.type,
          amount: amount
        }
        utils.restPost('/api/readMeter', {meter: meterJson, scale: scale, expense: expense}).then(
          response => {
            if (response) {
              meter.scales.push(scale)
              $('#' + meter._id).val('')
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
  .houses-area {
    width: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
  .house-items {
    width: 100%;
  }
  .house-items ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .house-items li {
    margin: 3px;
    padding: 5px;
    color: #333;
    font-size: 12px;
    font-weight: 100;
    text-align: center;
    list-style: none;
    background: #d4d4d4;
    border-radius: 2px;
    cursor: pointer;
  }
  .house-item-selected {
    color: #fff !important;
    background: #3c8dbc !important;
  }
  .input-column {
    padding: 1px 5px 0px 5px;
    width: 120px;
  }
  thead {
    background: #3c8dbc;
    opacity: 0.7;
    color: #fff;
  }
  .double {
    background: #eee;
  }
  tfoot tr {
    height: 20px;
  }
</style>
