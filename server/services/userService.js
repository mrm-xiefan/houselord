import path from 'path'
import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'

class UserService {
  constructor() {
  }
  recordLogin(user, next) {
    let self = this
    let now = new Date()
    mongo.update(
      'users',
      {_id: user._id},
      {$set: {udate: now.valueOf()}},
      {multi: false},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          self.getUser(user, (error, user) => {
            next(error, user)
          })
        }
      }
    )
  }
  insertUser(user, next) {
    mongo.find(
      'users',
      {_id: user._id},
      {},
      (error, result) => {
        if (error) {
          next(error)
        }
        else {
          if (result.length <= 0) {
            user.cuser = user._id
            user.uuser = user._id
            let now = new Date()
            user.cdate = now.valueOf()
            user.udate = now.valueOf()
            mongo.insert(
              'users',
              user,
              {},
              (error, inserted) => {
                if (error) {
                  next(error)
                }
                else {
                  next(null, inserted.ops[0])
                }
              }
            )
          }
          else {
            next('B003')
          }
        }
      }
    )
  }
  getUser(user, next) {
    mongo.find(
      'users',
      {_id: user._id, password: user.password},
      {},
      (error, result) => {
        if (error) {
          next(error)
        }
        else if (result.length <= 0) {
          next('S002')
        }
        else {
          next(null, result[0])
        }
      }
    )
  }
  authenticate(_id, password, next) {
    mongo.find(
      'users',
      {_id: _id, password: password},
      {},
      (error, result) => {
        if (error) {
          next(error)
        }
        else if (result.length <= 0) {
          next('B002')
        }
        else {
          next(null, result[0])
        }
      }
    )
  }
  selectHouse(user, selectedHouse, next) {
    let self = this
    user.selectedHouse = selectedHouse
    let now = new Date()
    mongo.update(
      'users',
      {_id: user._id},
      {$set: {selectedHouse: selectedHouse, udate: now.valueOf()}},
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

export default new UserService()
