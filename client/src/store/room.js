import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'
import Resident from '@/store/resident.js'

class Room {
  constructor(data) {
    this.number = data.number
    this.size = data.size
    this.floor = data.floor
    this.contract = Number(data.contract)
    this.rent = Number(data.rent)
    this.expenses = Number(data.expenses)

    this.resident = null
    if (data.resident) {
      this.resident = new Resident(data.resident)
    }
  }
  isValid() {
    if (!this.number || this.number == '') {
      return false
    }
    return true
  }
  getContract() {
    return utils.formatMoney(this.contract)
  }
  getRent() {
    return utils.formatMoney(this.rent)
  }
  getExpenses() {
    return utils.formatMoney(this.expenses)
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
      contract: Number(this.contract),
      rent: Number(this.rent),
      expenses: Number(this.expenses)
    }
  }
}

export default Room
