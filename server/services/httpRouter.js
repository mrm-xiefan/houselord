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

let router = express.Router()

router.get('/getHouseData', (req, res) => {
  logger.debug('getHouseData:', JSON.stringify(req.session.passport.user))
  Promise.all([
    new Promise((resolve, reject) => {
      houseService.getLordHouses(req.session.passport.user._id, (error, houses) => {
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
    })
  ]).then((values) => {
    res.json({error: null, data: {
      houses: values[0],
      rooms: values[1]
    }})
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
        req.body.params.fees,
        (error, rooms) => {
          res.json({error: error, data: {house: house, rooms, rooms}})
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
        res.json({error: error, data: rooms})
      })
    }
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
router.post('/addContract', (req, res) => {
  logger.info('addContract:', JSON.stringify(req.body.params))
  contractService.insertContract(req.session.passport.user, req.body.params, (error, contract) => {
    res.json({error: error, data: contract})
  })
})
router.post('/fixPayment', (req, res) => {
  logger.info('fixPayment:', JSON.stringify(req.body.params))
  contractService.updateContract(req.session.passport.user, req.body.params, (error, contract) => {
    res.json({error: error, data: contract})
  })
})

module.exports = router
