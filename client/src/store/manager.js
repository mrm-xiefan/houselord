import CONST from './const.js'
import utils from '../tool/utils.js'
import Controller from './controller.js'
import User from './user.js'
import io from 'socket.io-client/dist/socket.io.js'
import House from './house.js'
import Owner from './owner.js'

class Manager {
  constructor() {
    this.user = new User()
    this.controller = new Controller()
    this.socket = null
    this.oldsocket = null
    this.locker = 'unlock'
    this.houses = []
    this.owners = []
  }

  login(data, next) {
    let self = this
    this.user.login(data.user)
    this.initSocket(() => {
      utils.restGet('/api/getInitData').then(
        response => {
          if (response) {
            self.refreshHouse(response.houses)
            self.refreshOwner(response.owners)
            next()
          }
        }
      )
    })
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
    this.sortHouse()
  }
  sortHouse() {
    this.houses.sort((a, b) => {
      if (a.udate > b.udate) return -1
      else if (a.udate < b.udate) return 1
      else return 0
    })
  }
  refreshOwner(owners) {
    this.owners.splice(0, this.owners.length)
    for (let i = 0; i < owners.length; i ++) {
      this.owners.push(new Owner(owners[i]))
    }
    this.sortOwner()
  }
  sortOwner() {
    this.owners.sort((a, b) => {
      if (a._id > b._id) return 1
      else if (a._id < b._id) return -1
      else return 0
    })
  }
  isNewOwner(owner) {
    for (let i = 0; i < this.owners.length; i ++) {
      if (this.owners[i]._id == owner) {
        return false
      }
    }
    return true
  }
}

export default new Manager()
