import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'
import Payment from './payment.js'

class Contract {
  constructor(data) {
    this._id = data._id

    this.resident = data.resident
    this.phone = data.phone
    this.note = data.note
    this.keyMoney = Number(data.keyMoney)
    this.rent = Number(data.rent)
    this.deposit = Number(data.deposit)

    this.start = data.start
    this.end = data.end
    this.first = data.first

    this.payments = []
    if (data.payments) {
      for (let i = 0; i < data.payments.length; i ++) {
        this.payments.push(new Payment(data.payments[i]))
      }
    }
  }
  isDateValid() {
    if (!this.start) {
      return false
    }
    if (!this.end) {
      return false
    }
    if (!this.first) {
      return false
    }
    if (this.start > this.end) {
      return false
    }
    if (this.start > this.first) {
      return false
    }
    if (this.first > this.end) {
      return false
    }
    return true
  }
  isValueValid() {
    if (!this.resident) {
      return false
    }
    if (this.keyMoney < 0) {
      return false
    }
    if (this.deposit < 0) {
      return false
    }
    if (this.rent <= 0) {
      return false
    }
    return true
  }
  isOver() {
    for (let i = 0; i < this.payments.length; i ++) {
      if (!this.payments[i].pay) {
        return false
      }
    }
    return 'finish'
  }
  isUnpaid() {
    let now = new Date()
    now = now.valueOf()
    for (let i = 0; i < this.payments.length; i ++) {
      if (this.payments[i].isUnpaid()) {
        return true
      }
    }
    return false
  }
  getStart() {
    return utils.formatDate(this.start)
  }
  getEnd() {
    return utils.formatDate(this.end)
  }
  getFirst() {
    return utils.formatDate(this.first)
  }
}

export default Contract
