import CONST from './const.js'
import utils from '../tool/utils.js'
import Controller from './controller.js'
import User from './user.js'
import io from 'socket.io-client/dist/socket.io.js'
import House from './house.js'
import Room from './room.js'
import Contract from './contract.js'
import Expense from './expense.js'

class Manager {
  constructor() {
    this.user = new User()
    this.controller = new Controller()
    this.socket = null
    this.oldsocket = null
    this.locker = 'unlock'

    this.feeTypes = CONST.feeTypes
    this.expenseTypes = CONST.expenseTypes

    // for list page
    this.houses = []
    this.rooms = []
    this.expenses = []

    // for house page
    this.house = {
      house: null
    }

    // for room page
    this.room = {
      house: null,
      room: null
    }

    // for contract page
    this.contract = {
      query: null,
      house: null,
      room: null,
      contract: null
    }

    // for payment page
    this.payment = {
      query: null,
      house: null,
      room: null
    }
  }

  login(data, next) {
    let self = this
    this.user.login(data.user)
    this.initSocket(next)
  }
  logout() {
    this.user.logout()
    if (this.socket) {
      this.socket.disconnect()
    }
  }
  initSocket(next) {
    let self = this
    if (self.controller.cors) {
      self.socket = io(CONST.developHost, {path: CONST.socketpath, forceNew: true})
    }
    else {
      self.socket = io(location.host, {path: CONST.socketpath, forceNew: true})
    }
    self.socket.on('connect', () => {
      utils.socket = self.socket
      if (self.oldsocket != null && self.oldsocket != self.socket.id) {
        utils.socketEmit('reinit', {oldsocket: self.oldsocket, user: self.user._id})
      }
      self.oldsocket = self.socket.id
      next()
    })
    self.socket.on('disconnect', () => {
      // utils.event.$emit('SHOW_MESSAGE', 'S005')
    })
    self.socket.on('processError', (error) => {
      utils.event.$emit('SHOW_MESSAGE', error)
    })
    self.socket.on('authenticateError', () => {
      utils.router.push({name: 'error'})
    })
    self.socket.on('reinited', () => {
      // utils.event.$emit('SHOW_MESSAGE', 'I001')
    })
  }

  refreshHouse(houses) {
    this.houses.splice(0, this.houses.length)
    for (let i = 0; i < houses.length; i ++) {
      this.houses.push(new House(houses[i]))
    }
  }
  sortHouse() {
    this.houses.sort((a, b) => {
      if (a.udate > b.udate) return -1
      else if (a.udate < b.udate) return 1
      else return 0
    })
  }
  refreshRoom(rooms) {
    this.rooms.splice(0, this.rooms.length)
    for (let i = 0; i < rooms.length; i ++) {
      this.rooms.push(new Room(rooms[i]))
    }
    this.sortRoom()
  }
  sortRoom() {
    this.rooms.sort((a, b) => {
      if (Number(a.number) > Number(b.number)) return 1
      else if (Number(a.number) < Number(b.number)) return -1
      else return 0
    })
  }
  refreshExpense(expenses) {
    this.expenses.splice(0, this.expenses.length)
    for (let i = 0; i < expenses.length; i ++) {
      this.expenses.push(new Expense(expenses[i]))
    }
  }
}

export default new Manager()
