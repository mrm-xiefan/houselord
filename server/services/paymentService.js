import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class PaymentService {
  constructor() {
  }
  getPayment(_id, next) {
    mongo.findAll(
      'payments',
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
  getPayments(lord, house, room, contract, next) {
    let self = this
    mongo.findAll(
      'payments',
      {lord: lord, house: ObjectId(house), room: ObjectId(room), contract: ObjectId(contract), deleted: {$ne: true}},
      {},
      {plan: 1},
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
  insertPayments(user, contract, documents, next) {
    let now = new Date()
    if (!contract || !documents || documents.length <= 0) {
      next(null, [])
      return
    }
    for (let i = 0; i < documents.length; i ++) {
      documents[i].lord = user._id
      documents[i].house = contract.house
      documents[i].room = contract.room
      documents[i].contract = contract._id
      documents[i].cuser = user._id
      documents[i].uuser = user._id
      documents[i].cdate = now.valueOf()
      documents[i].udate = now.valueOf()
    }
    mongo.insert(
      'payments',
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

export default new PaymentService()
