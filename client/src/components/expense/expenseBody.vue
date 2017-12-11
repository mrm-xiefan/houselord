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
          <h3 class="box-title">経費一覧</h3>
        </div>
        <div class="box-body table-responsive no-padding">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>部屋番号</th>
                <th>収支</th>
                <th>経費種類</th>
                <th class="right-column">金額</th>
                <th>支払日</th>
                <th>支払</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(expense, i) in manager.expenses">
                <td>{{expense.room.number}}</td>
                <td>
                  <span :class="{'label': true, 'bg-blue': expense.DRCR == 'DR', 'bg-yellow': expense.DRCR == 'CR'}">
                    {{expense.getDRCR()}}
                  </span>
                </td>
                <td>{{expense.getType()}}</td>
                <td :class="{'unpay-input': !expense.pay, 'right-column': true}">
                  <template v-if="expense.pay">
                    {{expense.getAmount()}}
                  </template>
                  <template v-else>
                    <input v-model="expense.amount" type="number" step=1000 class="form-control">
                  </template>
                </td>
                <td>{{expense.getPay()}}</td>
                <td :class="{'unpay-input': !expense.pay}">
                  <div class="btn btn-primary btn-minimum" v-if="!expense.pay" v-on:click="agreeExpense(expense)">
                    支払
                  </div>
                  <div class="badge bg-green" v-else>
                    済み
                  </div>
                </td>
                <td :class="{'unpay-input': !expense.pay}">
                  <div class="btn btn-danger btn-minimum" v-if="!expense.pay" v-on:click="removeExpense(expense, i)">
                    削除
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr></tr>
            </tfoot>
          </table>
        </div>
        <div class="box-footer">
          <button class="btn btn-primary pull-right" v-on:click="addExpense()">
            <i class="fa fa-plus-circle"></i> 経費追加
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
        utils.restPost('/api/selectHouseForExpense', {_id: house._id}).then(
          response => {
            if (response) {
              manager.user.selectedHouse = house._id
              manager.refreshRoom(response.rooms)
              manager.refreshExpense(response.expenses)
            }
          }
        )
      },
      agreeExpense(expense) {
        expense.amount = Number(expense.amount)
        if (expense.amount <= 0) {
          utils.event.$emit('SHOW_MESSAGE', 'B013')
          return
        }
        let now = new Date()
        now = now.valueOf()
        let expenseJson = {
          _id: expense._id,
          amount: expense.amount,
          pay: now
        }
        utils.restPost('/api/fixExpense', {expense: expenseJson}).then(
          response => {
            if (response) {
              expense.pay = now
            }
          }
        )
      },
      removeExpense(expense, i) {
        utils.restPost('/api/deleteExpense', {expense: {_id: expense._id}}).then(
          response => {
            if (response) {
              manager.expenses.splice(i, 1)
            }
          }
        )
      },
      addExpense() {

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
  thead {
    background: #3c8dbc;
    opacity: 0.7;
    color: #fff;
  }
  .right-column {
    text-align: right;
  }
  .unpay-input {
    padding: 1px 5px 0px 5px;
    width: 120px;
  }
  tfoot tr {
    height: 20px;
  }
</style>
