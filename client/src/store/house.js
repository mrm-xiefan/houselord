import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class House {
  constructor(data) {
    this._id = data._id
    this.lord = data.lord
    this.name = data.name
    this.built = data.built
    this.construction = data.construction
    this.distributed = data.distributed || false
    this.address = data.address
    this.traffic = data.traffic
    this.note = data.note
    this.photos = data.photos
    this.udate = data.udate
  }
}

export default House
