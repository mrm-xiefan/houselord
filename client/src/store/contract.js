import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class Contract {
  constructor(data) {
    this._id = data._id

    this.resident = null
    if (data.resident) {
      this.resident = new Resident(data.resident)
    }

    this.pays = []
    if (data.pays) {
      for (let i = 0; i < data.pays.length; i ++) {
        this.pays.push(data.pays[i])
      }
    }

  }
}

export default Contract
