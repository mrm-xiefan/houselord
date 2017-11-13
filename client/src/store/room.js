import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'
import Resident from '@/store/resident.js'

class Room {
  constructor(data) {
    this.number = data.number
    this.size = data.size
    this.floor = data.floor
    this.keyMoney = Number(data.keyMoney)
    this.rent = Number(data.rent)
    this.deposit = Number(data.deposit)
  }
  isValid() {
    if (!this.number || this.number == '') {
      return false
    }
    return true
  }
  getKeyMoney() {
    return utils.formatMoney(this.keyMoney)
  }
  getRent() {
    return utils.formatMoney(this.rent)
  }
  getDeposit() {
    return utils.formatMoney(this.deposit)
  }
  isReserved() {
    return true
  }
  isRented() {
    return true
  }
  isUnpaid() {
    return true
  }
  toJSON() {
    return {
      number: this.number,
      size: this.size,
      floor: this.floor,
      keyMoney: Number(this.keyMoney),
      rent: Number(this.rent),
      deposit: Number(this.deposit)
    }
  }
}

export default Room
