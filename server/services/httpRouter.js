import express from 'express'
import fs from 'fs'
import path from 'path'
import url from 'url'
import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import {ObjectId} from 'mongodb'
import userService from './userService.js'
import houseService from './houseService.js'
import roomService from './roomService.js'
import meterService from './meterService.js'
import contractService from './contractService.js'
import paymentService from './paymentService.js'
import expenseService from './expenseService.js'

let router = express.Router()

router.get('/getHouseData', (req, res) => {
  logger.info('getHouseData:', JSON.stringify(req.session.passport.user))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.getHouses(req.session.passport.user._id, (error, houses) => {
        if (error) return reject(error)
        resolve(houses)
      })
    }),
    new Promise((resolve, reject) => {
      if (req.session.passport.user.selectedHouse) {
        roomService.getRooms(req.session.passport.user._id, req.session.passport.user.selectedHouse, (error, rooms) => {
          if (error) return reject(error)
          contractService.assignContractsToRooms(rooms, (error) => {
            if (error) return reject(error)
            resolve(rooms)
          })
        })
      }
      else {
        resolve([])
      }
    })
  ]).then((values) => {
    res.json({
      error: null,
      data: {
        houses: values[0],
        rooms: values[1]
      }
    })
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/addCentralizedHouse', (req, res) => {
  logger.info('addCentralizedHouse:', JSON.stringify(req.body.params))
  let document = {
    lord: req.body.params.lord,
    name: req.body.params.name,
    floor: req.body.params.floor,
    built: req.body.params.build,
    construction: req.body.params.construction,
    address: req.body.params.address,
    traffic: req.body.params.traffic,
    note: req.body.params.note,
    photos: req.body.params.photos
  }
  houseService.insertHouse(req.session.passport.user, document, (error, house) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      roomService.insertRooms(
        req.session.passport.user,
        house,
        req.body.params.floor,
        req.body.params.room,
        req.body.params.aspect,
        req.body.params.keyMoney,
        req.body.params.rent,
        req.body.params.deposit,
        req.body.params.management,
        req.body.params.fees,
        (error, rooms) => {
          if (error) {
            res.json({error: error, data: null})
          }
          else {
            meterService.insertMeters(req.session.passport.user, rooms, (error) => {
              if (error) {
                res.json({error: error, data: null})
              }
              else {
                userService.selectHouse(req.session.passport.user, house._id, (error) => {
                  if (error) {
                    res.json({error: error, data: null})
                  }
                  else {
                    res.json({error: error, data: {house: house, rooms, rooms}})
                  }
                })
              }
            })
          }
        }
      )
    }
  })
})
router.post('/addDistributedHouse', (req, res) => {
  logger.info('addDistributedHouse:', JSON.stringify(req.body.params))
  houseService.insertHouse(req.session.passport.user, req.body.params.house, (error, house) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      req.body.params.room.house = ObjectId(house._id)
      roomService.insertRoom(
        req.session.passport.user,
        req.body.params.room,
        (error, room) => {
          if (error) {
            res.json({error: error, data: null})
          }
          else {
            meterService.insertMeters(req.session.passport.user, [room], (error) => {
              if (error) {
                res.json({error: error, data: null})
              }
              else {
                userService.selectHouse(req.session.passport.user, house._id, (error) => {
                  if (error) {
                    res.json({error: error, data: null})
                  }
                  else {
                    res.json({error: error, data: {house: house, room, room}})
                  }
                })
              }
            })
          }
        }
      )
    }
  })
})
router.post('/updateHouse', (req, res) => {
  logger.info('updateHouse:', JSON.stringify(req.body.params))
  houseService.updateHouse(req.session.passport.user, req.body.params.house, (error, house) => {
    res.json({error: error, data: house})
  })
})
router.post('/deleteHouse', (req, res) => {
  logger.info('deleteHouse:', JSON.stringify(req.body.params))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.deleteHouse(req.session.passport.user, req.body.params.house, (error) => {
        if (error) return reject(error)
        resolve(null)
      })
    }),
    new Promise((resolve, reject) => {
      if (req.body.params.isSelect) {
        userService.selectHouse(req.session.passport.user, null, (error) => {
          if (error) return reject(error)
          resolve(null)
        })
      }
      else {
        resolve(null)
      }
    })
  ]).then((values) => {
    res.json({error: null, data: {}})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/saveRoom', (req, res) => {
  logger.info('saveRoom:', JSON.stringify(req.body.params))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.updateHouse(req.session.passport.user, req.body.params.house, (error) => {
        if (error) return reject(error)
        resolve(null)
      })
    }),
    new Promise((resolve, reject) => {
      roomService.updateRoom(req.session.passport.user, req.body.params.room, (error, room) => {
        if (error) return reject(error)
        resolve(null)
      })
    })
  ]).then((values) => {
    res.json({error: null, data: {}})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/updateRoom', (req, res) => {
  logger.info('updateRoom:', JSON.stringify(req.body.params))
  roomService.updateRoom(req.session.passport.user, req.body.params.room, (error, room) => {
    res.json({error: error, data: {room: room}})
  })
})
router.post('/deleteRoom', (req, res) => {
  logger.info('deleteRoom:', JSON.stringify(req.body.params))
  roomService.deleteRoom(req.session.passport.user, req.body.params.room, (error) => {
    res.json({error: error, data: {}})
  })
})
router.post('/selectHouseForRoom', (req, res) => {
  logger.info('selectHouseForRoom:', JSON.stringify(req.body.params))
  userService.selectHouse(req.session.passport.user, req.body.params._id, (error) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      roomService.getRooms(req.session.passport.user._id, req.body.params._id, (error, rooms) => {
        if (error) {
          res.json({error: error, data: null})
        }
        else {
          contractService.assignContractsToRooms(rooms, (error) => {
            res.json({error: error, data: rooms})
          })
        }
      })
    }
  })
})
router.get('/getRoomData', (req, res) => {
  let url_parts = url.parse(req.url, true)
  logger.info('getRoomData:', JSON.stringify(url_parts.query))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.getHouse(url_parts.query.house, (error, house) => {
        if (error) return reject(error)
        resolve(house)
      })
    }),
    new Promise((resolve, reject) => {
      roomService.getRoom(url_parts.query.room, (error, room) => {
        if (error) return reject(error)
        resolve(room)
      })
    })
  ]).then((values) => {
    res.json({
      error: null,
      data: {
        house: values[0],
        room: values[1]
      }
    })
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.get('/getContractData', (req, res) => {
  let url_parts = url.parse(req.url, true)
  logger.info('getContractData:', JSON.stringify(url_parts.query))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.getHouse(url_parts.query.house, (error, house) => {
        if (error) return reject(error)
        resolve(house)
      })
    }),
    new Promise((resolve, reject) => {
      roomService.getRoom(url_parts.query.room, (error, room) => {
        if (error) return reject(error)
        resolve(room)
      })
    }),
    new Promise((resolve, reject) => {
      if (url_parts.query.contract) {
        contractService.getContract(url_parts.query.contract, (error, contract) => {
          if (error) return reject(error)
          resolve(contract)
        })
      }
      else {
        resolve(null)
      }
    })
  ]).then((values) => {
    res.json({
      error: null,
      data: {
        house: values[0],
        room: values[1],
        contract: values[2]
      }
    })
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/saveContract', (req, res) => {
  logger.info('saveContract:', JSON.stringify(req.body.params))
  contractService.insertContract(req.session.passport.user, req.body.params.contract, (error, contract) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      paymentService.insertPayments(req.session.passport.user, contract, req.body.params.payments, (error, payments) => {
        res.json({error: error, data: {}})
      })
    }
  })
})
router.post('/updateContract', (req, res) => {
  logger.info('updateContract:', JSON.stringify(req.body.params))
  contractService.updateContract(req.session.passport.user, req.body.params, (error) => {
    res.json({error: error, data: {}})
  })
})
router.get('/getPaymentData', (req, res) => {
  let url_parts = url.parse(req.url, true)
  logger.info('getPaymentData:', JSON.stringify(url_parts.query))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.getHouse(url_parts.query.house, (error, house) => {
        if (error) return reject(error)
        resolve(house)
      })
    }),
    new Promise((resolve, reject) => {
      roomService.getRoom(url_parts.query.room, (error, room) => {
        if (error) return reject(error)
        contractService.assignContractsToRooms([room], (error) => {
          resolve(room)
        })
      })
    })
  ]).then((values) => {
    res.json({
      error: null,
      data: {
        house: values[0],
        room: values[1]
      }
    })
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/fixPayment', (req, res) => {
  logger.info('fixPayment:', JSON.stringify(req.body.params))
  Promise.all([
    new Promise((resolve, reject) => {
      let payment = {
        _id: req.body.params.payment,
        amount: req.body.params.amount,
        pay: req.body.params.pay,
        comment: req.body.params.comment
      }
      paymentService.updatePayment(req.session.passport.user, payment, (error) => {
        if (error) return reject(error)
        resolve()
      })
    }),
    new Promise((resolve, reject) => {
      if (req.body.params.over) {
        let contract = {
          _id: req.body.params.contract,
          over: req.body.params.over
        }
        contractService.updateContract(req.session.passport.user, contract, (error) => {
          if (error) return reject(error)
          resolve()
        })
      }
      else {
        resolve()
      }
    })
  ]).then((values) => {
    res.json({error: null, data: {}})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/addPayment', (req, res) => {
  logger.info('addPayment:', JSON.stringify(req.body.params))
  Promise.all([
    new Promise((resolve, reject) => {
      paymentService.insertPayments(req.session.passport.user, req.body.params.contract, req.body.params.payments, (error, payments) => {
        if (error) return reject(error)
        resolve(payments)
      })
    }),
    new Promise((resolve, reject) => {
      if (req.body.params.revive) {
        contractService.reviveContract(req.session.passport.user, req.body.params.contract._id, (error) => {
          if (error) return reject(error)
          resolve()
        })
      }
      else {
        resolve()
      }
    })
  ]).then((values) => {
    res.json({error: null, data: {payments: values[0]}})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/deletePayment', (req, res) => {
  logger.info('deletePayment:', JSON.stringify(req.body.params))
  Promise.all([
    new Promise((resolve, reject) => {
      paymentService.deletePayment(req.session.passport.user, req.body.params.payment, (error, payment) => {
        if (error) return reject(error)
        resolve(payment)
      })
    }),
    new Promise((resolve, reject) => {
      if (req.body.params.over) {
        let contract = {
          _id: req.body.params.contract,
          over: req.body.params.over
        }
        contractService.updateContract(req.session.passport.user, contract, (error) => {
          if (error) return reject(error)
          resolve()
        })
      }
      else {
        resolve()
      }
    })
  ]).then((values) => {
    res.json({error: null, data: {payment: values[0]}})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/cancelContract', (req, res) => {
  logger.info('cancelContract:', JSON.stringify(req.body.params))
  contractService.updateContract(req.session.passport.user, req.body.params, (error) => {
    res.json({error: error, data: {}})
  })
})
router.post('/recontract', (req, res) => {
  logger.info('recontract:', JSON.stringify(req.body.params))
  Promise.all([
    new Promise((resolve, reject) => {
      contractService.updateContract(req.session.passport.user, req.body.params.contract, (error) => {
        if (error) return reject(error)
        contractService.reviveContract(req.session.passport.user, req.body.params.contract._id, (error) => {
          if (error) return reject(error)
          resolve()
        })
      })
    }),
    new Promise((resolve, reject) => {
      paymentService.updatePayment(req.session.passport.user, req.body.params.deposit, (error) => {
        if (error) return reject(error)
        resolve()
      })
    }),
    new Promise((resolve, reject) => {
      paymentService.updatePayment(req.session.passport.user, req.body.params.management, (error) => {
        if (error) return reject(error)
        resolve()
      })
    }),
    new Promise((resolve, reject) => {
      let contract = req.body.params.contract
      contract.house = req.body.params.house
      contract.room = req.body.params.room
      paymentService.insertPayments(req.session.passport.user, contract, req.body.params.payments, (error, payments) => {
        if (error) return reject(error)
        resolve(payments)
      })
    })
  ]).then((values) => {
    res.json({error: null, data: {
      payments: values[3]
    }})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.get('/getMeterData', (req, res) => {
  logger.info('getMeterData:', JSON.stringify(req.session.passport.user))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.getHouses(req.session.passport.user._id, (error, houses) => {
        if (error) return reject(error)
        resolve(houses)
      })
    }),
    new Promise((resolve, reject) => {
      if (req.session.passport.user.selectedHouse) {
        roomService.getRooms(req.session.passport.user._id, req.session.passport.user.selectedHouse, (error, rooms) => {
          if (error) return reject(error)
          meterService.assignMetersToRooms(rooms, (error) => {
            if (error) return reject(error)
            resolve(rooms)
          })
        })
      }
      else {
        resolve([])
      }
    })
  ]).then((values) => {
    res.json({
      error: null,
      data: {
        houses: values[0],
        rooms: values[1]
      }
    })
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/selectHouseForMeter', (req, res) => {
  logger.info('selectHouseForMeter:', JSON.stringify(req.body.params))
  userService.selectHouse(req.session.passport.user, req.body.params._id, (error) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      roomService.getRooms(req.session.passport.user._id, req.body.params._id, (error, rooms) => {
        if (error) {
          res.json({error: error, data: null})
        }
        else {
          meterService.assignMetersToRooms(rooms, (error) => {
            res.json({error: error, data: rooms})
          })
        }
      })
    }
  })
})
router.post('/readMeter', (req, res) => {
  logger.info('readMeter:', JSON.stringify(req.body.params))
  Promise.all([
    new Promise((resolve, reject) => {
      meterService.readMeter(req.session.passport.user, req.body.params.meter._id, req.body.params.scale, (error) => {
        if (error) return reject(error)
        resolve()
      })
    }),
    new Promise((resolve, reject) => {
      contractService.getContractsUsingMeter(req.body.params.meter, (error, contracts) => {
        if (error) return reject(error)
        contractService.generatePayments(req.session.passport.user, contracts, req.body.params.meter, req.body.params.scale, (error, payments) => {
          if (error) return reject(error)
          if (payments.length > 0) {
            paymentService.insertMeterPayments(payments, (error) => {
              if (error) return reject(error)
              resolve()
            })
          }
          else {
            resolve()
          }
        })
      })
    }),
    // new Promise((resolve, reject) => {
    //   expenseService.insertExpense(req.session.passport.user, req.body.params.expense, (error) => {
    //     if (error) return reject(error)
    //     resolve()
    //   })
    // })
  ]).then((values) => {
    res.json({error: null, data: {}})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.get('/getExpenseData', (req, res) => {
  logger.info('getExpenseData:', JSON.stringify(req.session.passport.user))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.getHouses(req.session.passport.user._id, (error, houses) => {
        if (error) return reject(error)
        resolve(houses)
      })
    }),
    new Promise((resolve, reject) => {
      if (req.session.passport.user.selectedHouse) {
        roomService.getRooms(req.session.passport.user._id, req.session.passport.user.selectedHouse, (error, rooms) => {
          if (error) return reject(error)
          resolve(rooms)
        })
      }
      else {
        resolve([])
      }
    }),
    new Promise((resolve, reject) => {
      if (req.session.passport.user.selectedHouse) {
        expenseService.getExpenses(req.session.passport.user._id, req.session.passport.user.selectedHouse, (error, expenses) => {
          if (error) return reject(error)
          resolve(expenses)
        })
      }
      else {
        resolve([])
      }
    })
  ]).then((values) => {
    res.json({
      error: null,
      data: {
        houses: values[0],
        rooms: values[1],
        expenses: values[2]
      }
    })
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})
router.post('/selectHouseForExpense', (req, res) => {
  logger.info('selectHouseForExpense:', JSON.stringify(req.body.params))
  userService.selectHouse(req.session.passport.user, req.body.params._id, (error) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      Promise.all([
        new Promise((resolve, reject) => {
          roomService.getRooms(req.session.passport.user._id, req.body.params._id, (error, rooms) => {
            if (error) return reject(error)
            resolve(rooms)
          })
        }),
        new Promise((resolve, reject) => {
          expenseService.getExpenses(req.session.passport.user._id, req.body.params._id, (error, expenses) => {
            if (error) return reject(error)
            resolve(expenses)
          })
        })
      ]).then((values) => {
        res.json({
          error: null,
          data: {
            rooms: values[0],
            expenses: values[1]
          }
        })
      }, (reason) => {
        res.json({error: reason, data: null})
      })
    }
  })
})
router.post('/fixExpense', (req, res) => {
  logger.info('fixExpense:', JSON.stringify(req.body.params))
  expenseService.updateExpense(req.session.passport.user, req.body.params.expense, (error) => {
    res.json({error: error, data: {}})
  })
})
router.post('/deleteExpense', (req, res) => {
  logger.info('deleteExpense:', JSON.stringify(req.body.params))
  expenseService.deleteExpense(req.session.passport.user, req.body.params.expense, (error) => {
    res.json({error: error, data: {}})
  })
})
router.post('/addExpense', (req, res) => {
  logger.info('addExpense:', JSON.stringify(req.body.params))
  expenseService.insertExpense(req.session.passport.user, req.body.params.expense, (error, expense) => {
    res.json({error: error, data: expense})
  })
})

module.exports = router
