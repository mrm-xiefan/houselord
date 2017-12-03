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
  assignPaymentsToContracts(contracts, next) {
    const contractMap = new Map(contracts.map((contract) => {
      return [String(contract._id), contract]
    }))
    const contractIDs = contracts.map((contract) => {
      return ObjectId(contract._id)
    })
    mongo.findAll(
      'payments',
      {contract: {$in: contractIDs}, deleted: {$ne: true}},
      null,
      {plan: 1},
      (error, results) => {
        if (error) {
          next(error)
        }
        else {
          results.forEach((payment) => {
            const contract = contractMap.get(String(payment.contract))
            if (contract.payments) {
              contract.payments.push(payment)
            } else {
              contract.payments = [payment]
            }
          })
          next(null)
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
      documents[i].house = ObjectId(contract.house)
      documents[i].room = ObjectId(contract.room)
      documents[i].contract = ObjectId(contract._id)
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
  updatePayment(user, payment, next) {
    let id = payment._id
    delete payment._id
    payment.uuser = user._id
    let now = new Date()
    payment.udate = now.valueOf()
    mongo.update(
      'payments',
      {_id: ObjectId(id)},
      {$set: payment},
      {multi: false},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          payment._id = id
          next(null, payment)
        }
      }
    )
  }
  deletePayment(user, payment, next) {
    let now = new Date()
    mongo.update(
      'payments',
      {_id: ObjectId(payment._id)},
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

export default new PaymentService()
