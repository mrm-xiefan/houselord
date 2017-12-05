import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'
import Contract from './contract.js'

class Room {
  constructor(data) {
    this._id = data._id
    this.lord = data.lord
    this.house = data.house
    this.number = data.number
    this.fees = data.fees
    this.udate = data.udate
    this.keyMoney = Number(data.keyMoney)
    this.rent = Number(data.rent)
    this.deposit = Number(data.deposit)
    this.contracts = []
    if (data.contracts) {
      for (let i = 0; i < data.contracts.length; i ++) {
        this.contracts.push(new Contract(data.contracts[i]))
      }
    }
  }
  getKeyMoney() {
    if (this.getCurrentContract()) {
      return utils.formatMoney(this.getCurrentContract().keyMoney) + ' 円'
    }
    else {
      return utils.formatMoney(this.keyMoney) + ' 円'
    }
  }
  getRent() {
    if (this.getCurrentContract()) {
      return utils.formatMoney(this.getCurrentContract().rent) + ' 円'
    }
    else {
      return utils.formatMoney(this.rent) + ' 円 / 月'
    }
  }
  getDeposit() {
    if (this.getCurrentContract()) {
      return utils.formatMoney(this.getCurrentContract().deposit) + ' 円'
    }
    else {
      return utils.formatMoney(this.deposit) + ' 円'
    }
  }
  getCurrentContract() {
    let now = new Date()
    now = now.valueOf()
    for (let i = 0; i < this.contracts.length; i ++) {
      if (this.contracts[i].start - 2592000000 <= now && now <= this.contracts[i].end) {
        return this.contracts[i]
      }
    }
    return null
  }
  getFutureContract() {
    let now = new Date()
    now = now.valueOf()
    for (let i = 0; i < this.contracts.length; i ++) {
      if (this.contracts[i].start - 2592000000 > now) {
        return this.contracts[i]
      }
    }
    return null
  }
  isRented() {
    if (this.getCurrentContract()) {
      return true
    }
    else {
      return false
    }
  }
  isUnpaid() {
    for (let i = 0; i < this.contracts.length; i ++) {
      let contract = this.contracts[i]
      if (contract) {
        if (contract.isUnpaid()) {
          return true
        }
      }
    }
    return false
  }
}

export default Room
