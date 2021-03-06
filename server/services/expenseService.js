import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import utils from './utils.js'

class ExpenseService {
  constructor() {
  }
  getExpenses(lord, house, next) {
    let self = this
    mongo.findAll(
      'expenses',
      {lord: lord, house: ObjectId(house), deleted: {$ne: true}},
      {},
      {cdate: 1},
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
  assignExpensesToRooms(rooms, next) {
    const roomMap = new Map(rooms.map((room) => {
      return [String(room._id), room]
    }))
    const roomIDs = rooms.map((room) => {
      return ObjectId(room._id)
    })
    mongo.findAll(
      'expenses',
      {room: {$in: roomIDs}, pay: {$ne: null}, deleted: {$ne: true}},
      null,
      {},
      (error, results) => {
        if (error) {
          next(error)
        }
        else {
          results.forEach((expense) => {
            const room = roomMap.get(String(expense.room))
            if (room.expenses) {
              room.expenses.push(expense)
            } else {
              room.expenses = [expense]
            }
          })
          next(null)
        }
      }
    )
  }
  insertExpense(user, expense, next) {
    expense.house = ObjectId(expense.house)
    if (expense.room) {
      expense.room = ObjectId(expense.room)
    }
    if (expense.meter) {
      expense.meter = ObjectId(expense.meter)
    }
    expense.cuser = user._id
    expense.uuser = user._id
    let now = new Date()
    expense.cdate = now.valueOf()
    expense.udate = now.valueOf()
    mongo.insert(
      'expenses',
      expense,
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
  updateExpense(user, expense, next) {
    let id = expense._id
    delete expense._id
    expense.uuser = user._id
    let now = new Date()
    expense.udate = now.valueOf()
    mongo.update(
      'expenses',
      {_id: ObjectId(id)},
      {$set: expense},
      {multi: false},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          expense._id = id
          next(null, expense)
        }
      }
    )
  }
  deleteExpense(user, expense, next) {
    let now = new Date()
    mongo.update(
      'expenses',
      {_id: ObjectId(expense._id)},
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

export default new ExpenseService()
