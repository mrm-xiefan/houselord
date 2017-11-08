import express from 'express'
import fs from 'fs'
import path from 'path'
import url from 'url'
import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import houseService from './houseService.js'
import ownerService from './ownerService.js'

let router = express.Router()

router.get('/getInitData', (req, res) => {
  logger.debug('getInitData:', JSON.stringify(req.session.user))
  houseService.getLordHouses(req.session.user._id, (error, houses) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      ownerService.getAllOwners(req.session.user._id, (error, owners) => {
        if (error) {
          res.json({error: error, data: null})
        }
        else {
          res.json({error: null, data: {houses: houses, owners: owners}})
        }
      })
    }
  })
})
router.post('/addHouse', (req, res) => {
  logger.info('addHouse:', JSON.stringify(req.body.params))
  houseService.insertHouse(req.session.user, req.body.params, (error, house) => {
    res.json({error: error, data: house})
  })
})
router.post('/addOwner', (req, res) => {
  logger.info('addOwner:', JSON.stringify(req.body.params))
  ownerService.insertOwner(req.session.user, req.body.params, (error, owner) => {
    res.json({error: error, data: owner})
  })
})

module.exports = router
