import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class HouseService {
  constructor() {
  }
  getAllHouses(owner, next) {
    mongo.findAll(
      'houses',
      {owner: owner, deleted: {$ne: true}},
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
}
export default new HouseService()
