import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class MeterService {
  constructor() {
  }
  insertMeters(user, rooms, next) {
    let now = new Date()
    let meters = []
    if (!rooms || rooms.length <= 0) {
      next(null, meters)
      return
    }
    for (let i = 0; i < rooms.length; i ++) {
      let room = rooms[i]
      for (let j = 0; j < room.fees.length; j ++) {
        let fee = room.fees[j]
        if (fee.meter) {
          meters.push({
            _id: fee.meter,
            lord: user._id,
            house: ObjectId(room.house),
            room: ObjectId(room._id),
            type: fee.type,
            name: fee.name,
            base: fee.base,
            price: fee.price,
            scales: [],
            cuser: user._id,
            uuser: user._id,
            cdate: now.valueOf(),
            udate: now.valueOf()
          })
        }
      }
    }
    mongo.insert(
      'meters',
      meters,
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
  assignMetersToRooms(rooms, next) {
    const roomMap = new Map(rooms.map((room) => {
      return [String(room._id), room]
    }))
    const roomIDs = rooms.map((room) => {
      return ObjectId(room._id)
    })
    mongo.findAll(
      'meters',
      {room: {$in: roomIDs}, deleted: {$ne: true}},
      null,
      {},
      (error, results) => {
        if (error) {
          next(error)
        }
        else {
          results.forEach((meter) => {
            const room = roomMap.get(String(meter.room))
            if (room.meters) {
              room.meters.push(meter)
            } else {
              room.meters = [meter]
            }
          })
          next(null)
        }
      }
    )
  }
  readMeter(user, id, scale, next) {
    let now = new Date()
    mongo.update(
      'meters',
      {_id: ObjectId(id)},
      {
        $set: {
          uuser: user._id,
          udate: now.valueOf()
        },
        $push: {
          scales: scale
        }
      },
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

export default new MeterService()
