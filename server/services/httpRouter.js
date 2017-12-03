import express from 'express'
import fs from 'fs'
import path from 'path'
import url from 'url'
import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import houseService from './houseService.js'
import roomService from './roomService.js'
import ownerService from './ownerService.js'
import contractService from './contractService.js'

let router = express.Router()

router.get('/getHouseData', (req, res) => {
  logger.debug('getHouseData:', JSON.stringify(req.session.passport.user))
  houseService.getLordHouses(req.session.passport.user._id, (error, houses) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      res.json({error: null, data: {houses: houses}})
    }
  })
})
router.post('/addHouse', (req, res) => {
  logger.info('addHouse:', JSON.stringify(req.body.params))
  let document = {
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
