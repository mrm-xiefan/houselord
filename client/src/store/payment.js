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
  getPlan() {
    return utils.formatDate(this.plan)
  }
  getPay() {
    return utils.formatDate(this.pay)
  }
}

export default Payment
