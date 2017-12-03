import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import utils from './utils.js'

class OwnerService {
  constructor() {
  }
  getAllOwners(lord, next) {
    mongo.findAll(
      'owners',
      {lord: lord, deleted: {$ne: true}},
      {},
      {udate: -1},
      (error, owners) => {
        if (error) {
          next(error, null)
        }
        else {
          next(null, owners)
        }
      }
    )
  }
  insertOwner(user, owner, next) {
    owner.cuser = user._id
    owner.uuser = user._id
    let now = new Date()
    owner.cdate = now.valueOf()
    owner.udate = now.valueOf()
    mongo.insert(
      'owners',
      owner,
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

export default new OwnerService()
