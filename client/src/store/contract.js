import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class Contract {
  constructor(data) {
    this._id = data._id

    this.resident = data.resident
    this.phone = data.phone
    this.note = data.note

    this.start = data.start
    this.end = data.end
    this.first = data.first

    this.pays = []
    if (data.pays) {
      for (let i = 0; i < data.pays.length; i ++) {
        this.pays.push(data.pays[i])
      }
    }
  }
  isFinished() {
    for (let i = 0; i < this.pays.length; i ++) {
      if (!this.pays[i].payment) {
        return false
      }
    }
    return 'finish'
  }
  isUnpaid() {
    let now = new Date()
    now = now.valueOf()
    for (let i = 0; i < this.pays.length; i ++) {
      if (!this.pays[i].payment && this.pays[i].plan < now) {
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
