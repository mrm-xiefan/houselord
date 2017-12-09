import express from 'express'
import fs from 'fs'
import path from 'path'
import url from 'url'
import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import userService from './userService.js'
import houseService from './houseService.js'
import roomService from './roomService.js'
import contractService from './contractService.js'
import paymentService from './paymentService.js'

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
router.post('/addHouse', (req, res) => {
  logger.info('addHouse:', JSON.stringify(req.body.params))
  let document = {
    lord: req.body.params.lord,
    name: req.body.params.name,
    address: req.body.params.address,
    floor: req.body.params.floor,
    note: req.body.params.note
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
        req.body.params.keyMoney,
        req.body.params.rent,
        req.body.params.deposit,
        req.body.params.fees,
        (error, rooms) => {
          userService.selectHouse(req.session.passport.user, house._id, (error) => {
            if (error) {
              res.json({error: error, data: null})
            }
            else {
              res.json({error: error, data: {house: house, rooms, rooms}})
            }
          })
        }
      )
    }
  })
})
router.post('/selectHouse', (req, res) => {
  logger.info('selectHouse:', JSON.stringify(req.body.params))
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
        pay: req.body.params.pay
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
      payments: values[2]
    }})
  }, (reason) => {
    res.json({error: reason, data: null})
  })
})






router.post('/updateHouse', (req, res) => {
  logger.info('updateHouse:', JSON.stringify(req.body.params))
  houseService.updateHouse(req.session.passport.user, req.body.params, (error, house) => {
    res.json({error: error, data: house})
  })
})
router.post('/deleteHouse', (req, res) => {
  logger.info('deleteHouse:', JSON.stringify(req.body.params))
  houseService.deleteHouse(req.session.passport.user, req.body.params, (error) => {
    res.json({error: error, data: {}})
  })
})
router.post('/addOwner', (req, res) => {
  logger.info('addOwner:', JSON.stringify(req.body.params))
  ownerService.insertOwner(req.session.passport.user, req.body.params, (error, owner) => {
    res.json({error: error, data: owner})
  })
})
router.get('/getHouseDetail', (req, res) => {
  let url_parts = url.parse(req.url, true)
  logger.info('getHouseDetail: ' + JSON.stringify(url_parts.query))
  houseService.getHouse(url_parts.query._id, (error, house) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      res.json({error: null, data: {house: house}})
    }
  })
})

module.exports = router
