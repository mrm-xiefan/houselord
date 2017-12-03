import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class RoomService {
  constructor() {
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
          house: house._id,
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
}

export default new RoomService()
