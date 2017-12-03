import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class RoomService {
  constructor() {
  }
  getRoom(_id, next) {
    let self = this
    mongo.findAll(
      'rooms',
      {_id: ObjectId(_id), deleted: {$ne: true}},
      {},
      {},
      (error, results) => {
        if (error) {
          next(error, null)
        }
        else {
          // self.getRoomContract(results[0], 0, next)
        }
      }
    )
  }
  insertRooms(user, house, floor, room, fees, next) {
    let documents = []
    for (let i = 0; i < floor; i ++) {
      for (let j = 0; j < room; j ++) {
        let now = new Date()
        documents.push({
          lord: user._id,
          house: house._id,
          number: '' + (i + 1) + ('00' + (j + 1)).slice(-2),
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
