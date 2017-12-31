import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'
import Contract from './contract.js'
import Meter from './meter.js'

class Room {
  constructor(data) {
    this._id = data._id
    this.lord = data.lord
    this.house = data.house
    this.number = data.number
    this.aspect = data.aspect || ''
    this.layout = data.layout || ''
    this.area = data.area || ''
    this.direction = data.direction || ''
    this.fees = data.fees || []
    this.udate = data.udate
    this.keyMoney = Number(data.keyMoney || 0)
    this.rent = Number(data.rent || 0)
    this.deposit = Number(data.deposit || 0)
    this.management = Number(data.management || 0)
    this.photos = data.photos || []
    this.contracts = []
    if (data.contracts) {
      for (let i = 0; i < data.contracts.length; i ++) {
        this.contracts.push(new Contract(data.contracts[i]))
      }
    }
    this.meters = []
    if (data.meters) {
      for (let i = 0; i < data.meters.length; i ++) {
        this.meters.push(new Meter(data.meters[i]))
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
  getManagement() {
    if (this.getCurrentContract()) {
      return utils.formatMoney(this.getCurrentContract().management) + ' 円'
    }
    else {
      return utils.formatMoney(this.management) + ' 円 / 月'
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
