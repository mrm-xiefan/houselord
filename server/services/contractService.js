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
    for (let i = 0; i < contract.fees.length; i ++) {
      if (contract.fees[i].meter) {
        contract.fees[i].meter = ObjectId(contract.fees[i].meter)
      }
    }
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
  getContractsUsingMeter(meter, next) {
    let now = new Date()
    now = now.valueOf()
    let filter = {
      lord: meter.lord,
      house: ObjectId(meter.house),
      room: ObjectId(meter.room),
      start: {$lte: now},
      over: {$ne: true},
      fees: {$elemMatch: {meter: ObjectId(meter._id)}}
    }
    mongo.findAll(
      'contracts',
      filter,
      {},
      {},
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
  generatePayments(user, contracts, meter, scale, next) {
    let self = this
    Promise.all(contracts.map((contract) => {
      return new Promise((resolve , reject) => {
        for (let i = 0; i < contract.fees.length; i ++) {
          let fee = contract.fees[i]
          if (fee.meter == meter._id && fee.scales.length > 0 && fee.scales[fee.scales.length - 1] < scale.scaleRead) {
            let now = new Date()
            let payment = {
              DRCR: 'DR',
              type: fee.type,
              amount: fee.price * (scale.scaleRead - fee.scales[fee.scales.length - 1]) + fee.base,
              plan: now.valueOf(),
              lord: contract.lord,
              house: ObjectId(contract.house),
              room: ObjectId(contract.room),
              contract: ObjectId(contract._id),
              cuser: user._id,
              cdate: now.valueOf(),
              uuser: user._id,
              udate: now.valueOf()
            }
            fee.scales.push(scale.scaleRead)
            self.updateContractScale(user, contract, fee, (error) => {
              if (error) return reject(error)
              return resolve(payment)
            })
            return
          }
        }
        return resolve(null)
      })
    })).then((values) => {
      let payments = []
      for (let i = 0; i < values.length; i ++) {
        if (values[i]) {
          payments.push(values[i])
        }
      }
      next(null, payments)
    }, (reason) => {
      next(reason)
    })
  }
  updateContractScale(user, contract, fee, next) {
    let now = new Date()
    mongo.update(
      'contracts',
      {
        _id: ObjectId(contract._id),
        'fees.meter': ObjectId(fee.meter)
      },
      {$set: {'fees.$.scales': fee.scales, uuser: user._id, udate: now.valueOf()}},
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
