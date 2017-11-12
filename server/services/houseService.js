import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class HouseService {
  constructor() {
  }
  getLordHouses(lord, next) {
    mongo.findAll(
      'houses',
      {lord: lord, deleted: {$ne: true}},
      {sort: {'udate': -1}},
      (error, houses) => {
        if (error) {
          next(error, null)
        }
        else {
          next(null, houses)
        }
      }
    )
  }
  getHouse(_id, next) {
    mongo.findAll(
      'houses',
      {_id: ObjectId(_id), deleted: {$ne: true}},
      {},
      (error, results) => {
        if (error) {
          next(error, null)
        }
        else {
          next(null, results[0])
        }
      }
    )
  }
  insertHouse(user, house, next) {
    house.cuser = user._id
    house.uuser = user._id
    let now = new Date()
    house.cdate = now.valueOf()
    house.udate = now.valueOf()
    mongo.insert(
      'houses',
      house,
      {},
      (error, result) => {
        if (error) {
          next(error, null)
        }
        else {
          next(null, result.ops[0])
        }
      }
    )
  }
  updateHouse(user, house, next) {
    let id = house._id
    delete house._id
    house.uuser = user._id
    let now = new Date()
    house.udate = now.valueOf()
    mongo.update(
      'houses',
      {_id: ObjectId(id)},
      {$set: house},
      {multi: false},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          house._id = id
          next(null, house)
        }
      }
    )
  }
  deleteHouse(user, house, next) {
    let now = new Date()
    mongo.update(
      'houses',
      {_id: ObjectId(house._id)},
      {$set: {deleted: true, uuser: user._id, udate: now.valueOf()}},
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

export default new HouseService()
