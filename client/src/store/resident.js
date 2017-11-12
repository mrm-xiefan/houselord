import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class Resident {
  constructor(data) {
    this._id = data._id
    this.phone = data.phone
    this.note = data.note
  }
  visible(text) {
    return this._id.indexOf(text) >= 0 || !text
  }
  toJSON() {
    let data = {
      _id: this._id,
      phone: this.phone,
      note: this.note
    }
    return data
  }
}

export default Resident
