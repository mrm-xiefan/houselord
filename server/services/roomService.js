import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class RoomService {
  constructor() {
  }
  getRoom(_id, next) {
    mongo.findAll(
      'rooms',
      {_id: ObjectId(_id),deleted: {$ne: true}},
      {},
      {},
      (error, result) => {
        if (error) {
          next(error, null)
        }
        else {
          next(null, result[0])
        }
      }
    )
  }
  getRooms(lord, house, next) {
    let self = this
    mongo.findAll(
      'rooms',
      {lord: lord, house: ObjectId(house), deleted: {$ne: true}},
      {},
      {udate: -1},
      (error, results) => {
        if (error) {
          next(error, null)
        }
        else {
          next(error, results)
        }
      }
    )
  }
  insertRooms(user, house, floor, room, keyMoney, rent, deposit, fees, next) {
    let documents = []
    for (let i = 0; i < floor; i ++) {
      for (let j = 0; j < room; j ++) {
        let now = new Date()
        documents.push({
          lord: user._id,
          house: ObjectId(house._id),
          number: '' + (i + 1) + ('00' + (j + 1)).slice(-2),
          keyMoney: keyMoney,
          rent: rent,
          deposit: deposit,
          fees: fees,
          cuser: user._id,
          uuser: user._id,
          cdate: now.valueOf(),
          udate: now.valueOf()
        })
      }
    }
    mongo.insert(
      'rooms',
      documents,
      {},
      (error, result) => {
        if (error) {
          next(error, null)
        }
        else {
          next(null, result.ops)
        }
      }
    )
  }
  updateRoom(user, room, next) {
    let id = room._id
    delete room._id
    delete room.house
    room.uuser = user._id
    let now = new Date()
    room.udate = now.valueOf()
    mongo.update(
      'rooms',
      {_id: ObjectId(id)},
      {$set: room},
      {multi: false},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          room._id = id
          next(null, room)
        }
      }
    )
  }

  deleteRoom(user, room, next) {
    let id = room._id
    delete room._id
    delete room.house
    room.uuser = user._id
    room.deleted = true
    let now = new Date()
    room.udate = now.valueOf()
    mongo.update(
      'rooms',
      {_id: ObjectId(id)},
      {$set: room},
      {multi: false},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          next(null)
        }
      }
    )
  }

}

export default new RoomService()
