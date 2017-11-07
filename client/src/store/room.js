import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'

class Room {
  constructor(data) {
    this.number = data.number
    this.size = data.size
    this.floor = data.floor
    this.contract = data.contract
    this.rent = data.rent
    this.expenses = data.expenses
    this.photos = []
    if (data.photos) {
      for (let i = 0; i < data.photos.length; i ++) {
        this.photos.push(data.photos[i])
      }
    }
  }
  isValid() {
    if (!this.number || this.number == '') {
      return false
    }
    return true
  }
  toJSON() {
    return {
      number: this.number,
      size: this.size,
      floor: this.floor,
      contract: this.contract,
      rent: this.rent,
      expenses: this.expenses,
      photos: this.photos
    }
  }
}

export default Room
