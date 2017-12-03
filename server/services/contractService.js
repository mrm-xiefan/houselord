import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

import paymentService from './paymentService.js'
class ContractService {
  constructor() {
  }
  getContract(_id, next) {
    mongo.findAll(
      'contracts',
      {_id: ObjectId(_id)},
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
  assignContractsToRooms(rooms, next) {
    const roomMap = new Map(rooms.map((room) => {
      return [String(room._id), room]
    }))
    const roomIDs = rooms.map((room) => {
      return ObjectId(room._id)
    })
    mongo.findAll(
      'contracts',
      {room: {$in: roomIDs}, over: {$exists: false}, deleted: {$ne: true}},
      null,
      {start: 1},
      (error, results) => {
        if (error) {
          next(error)
        }
        else {
          paymentService.assignPaymentsToContracts(results, (error) => {
            if (error) return next(error)
            results.forEach((contract) => {
              const room = roomMap.get(String(contract.room))
              if (room.contracts) {
                room.contracts.push(contract)
              } else {
                room.contracts = [contract]
              }
            })
            next(null)
          })
        }
      }
    )
  }
  insertContract(user, contract, next) {
    contract.house = ObjectId(contract.house)
    contract.room = ObjectId(contract.room)
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
  reviveContract(user, _id, next) {
    let now = new Date()
    mongo.update(
      'contracts',
      {_id: ObjectId(_id)},
      {$set: {uuser: user._id, udate: now.valueOf()}, $unset: {over: 1}},
      {},
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
