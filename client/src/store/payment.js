import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class Payment {
  constructor(data) {
    this._id = data._id

    this.DRCR = data.DRCR
    this.type = data.type
    this.amount = data.amount
    this.plan = data.plan
    this.pay = data.pay
  }
  isUnpaid() {
    let now = new Date()
    return (!this.pay && this.plan < now.valueOf())
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
    if (this.type == 'keyMoney') {
      return '礼金'
    }
    else if (this.type == 'deposit') {
      return '敷金'
    }
    else if (this.type == 'rent') {
      return '家賃'
    }
    else if (this.type == 'other') {
      return '補正'
    }
  }
  getAmount() {
    return utils.formatMoney(Number(this.amount))
  }
  getPlan() {
    return utils.formatDate(this.plan)
  }
  getPay() {
    return utils.formatDate(this.pay)
  }
  getDate() {
    if (this.pay) {
      return utils.formatDate(this.pay)
    }
    else {
      return utils.formatDate(this.plan)
    }
  }
}

export default Payment