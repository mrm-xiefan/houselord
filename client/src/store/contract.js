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
}

export default Contract
