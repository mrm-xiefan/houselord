import express from 'express'
import fs from 'fs'
import path from 'path'
import url from 'url'
import logger from './logger.js'
import conf from 'config'
import mongo from './mongo.js'
import houseService from './houseService.js'

let router = express.Router()

router.post('/addHouse', (req, res) => {
  logger.info('addHouse:', JSON.stringify(req.body.params))
  houseService.insertHouse(req.session.user, req.body.params, (error, house) => {
    res.json({error: error, data: house})
  })
})

module.exports = router
