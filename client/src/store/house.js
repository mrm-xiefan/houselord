import manager from '@/store/manager.js'
import CONST from './const.js'
import utils from '@/tool/utils.js'
import Room from '@/store/room.js'

class House {
  constructor(data) {
    this._id = data._id
    this.isNew = data.isNew
    this.name = data.name
    this.address = data.address
    this.owner = data.owner
    this.note = data.note
    this.photo = data.photo
    this.rooms = []
    if (data.rooms) {
      for (let i = 0; i < data.rooms.length; i ++) {
        this.rooms.push(new Room(data.rooms[i]))
      }
    }
  }
  clearRoom() {
    for (let i = this.rooms.length - 1; i >= 0; i --) {
      if (!this.rooms[i].isValid()) {
        this.rooms.splice(i, 1)
      }
    }
  }
  toJSON() {
    let data = {
      name: this.name,
      address: this.address,
      owner: this.owner,
      note: this.note,
      photo: this.photo,
      rooms: []
    }
    for (let i = 0; i < this.rooms.length; i ++) {
      data.rooms.push(this.rooms[i].toJSON())
    }
    return data
  }
}

export default House
