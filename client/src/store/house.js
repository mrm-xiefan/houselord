import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class House {
  constructor(data) {
    this._id = data._id
    this.lord = data.lord
    this.name = data.name
    this.address = data.address
    this.traffic = data.traffic
    this.note = data.note
    this.photos = data.photos
    this.udate = data.udate
  }
}

export default House
