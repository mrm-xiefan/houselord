import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class Meter {
  constructor(data) {
    this._id = data._id
    this.lord = data.lord
    this.house = data.house
    this.room = data.room
    this.type = data.type
    this.name = data.name
    this.base = data.base
    this.price = data.price
    this.scales = data.scales || []
    this.sortScales()
  }
  lastDate() {
    if (this.scales.length <= 0) {
      return '-'
    }
    return utils.formatDate(this.scales[this.scales.length - 1].scaleDate)
  }
  lastRead() {
    if (this.scales.length <= 0) {
      return '-'
    }
    return this.scales[this.scales.length - 1].scaleRead
  }
  sortScales() {
    this.scales.sort((a, b) => {
      if (a.scaleDate > b.scaleDate) return 1
      if (a.scaleDate < b.scaleDate) return -1
      return 0
    })
  }
}

export default Meter
