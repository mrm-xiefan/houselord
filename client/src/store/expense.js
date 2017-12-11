import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class Expense {
  constructor(data) {
    this._id = data._id
    this.lord = data.lord
    this.house = data.house
    this.room = data.room
    this.meter = data.meter
    this.DRCR = data.DRCR
    this.type = data.type
    this.amount = data.amount
    this.pay = data.pay
  }
  isUnpaid() {
    return !this.pay
  }
  getDRCR() {
    if (this.DRCR == 'DR') {
      return '収入'
    }
    else {
      return '支出'
    }
  }
  getType() {
    if (CONST.expenseTypes[this.type]) {
      return CONST.expenseTypes[this.type].name
    }
    else {
      return null
    }
  }
  getAmount() {
    return utils.formatMoney(Number(this.amount))
  }
  getPay() {
    return this.pay? utils.formatDate(this.pay): ''
  }
}

export default Expense
