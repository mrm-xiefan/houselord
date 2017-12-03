import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class ContractService {
  constructor() {
  }
  getRoomContracts(house, room, next) {
    let filter = {
      deleted: {$ne: true},
      finished: {$ne: true},
      house: house.toString(),
      room: room
    }
    mongo.findAll(
      'contracts',
      filter,
      {},
      {cdate: -1},
      (error, contracts) => {
        if (error) {
          next(error, null)
        }
        else {
          next(null, contracts)
        }
      }
    )
  }
  insertContract(user, contract, next) {
    contract.cuser = user._id
    contract.uuser = user._id
    let now = new Date()
    contract.cdate = now.valueOf()
    contract.udate = now.valueOf()
    mongo.insert(
      'contracts',
      contract,
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
  updateContract(user, contract, next) {
    let id = contract._id
    delete contract._id
    contract.uuser = user._id
    let now = new Date()
    contract.udate = now.valueOf()
    mongo.update(
      'contracts',
      {_id: ObjectId(id)},
      {$set: contract},
      {multi: false},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          contract._id = id
          next(null, contract)
        }
      }
    )
  }
  deleteContract(user, contract, next) {
    let now = new Date()
    mongo.update(
      'contracts',
      {_id: ObjectId(contract._id)},
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

export default new ContractService()
