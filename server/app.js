import log4js from 'log4js'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import conf from 'config'
import http from 'http'
import fs from 'fs'
import url from 'url'
import cookieParser from 'cookie-parser'
import logger from './services/logger.js'
import mongo from './services/mongo.js'
import utils from './services/utils.js'
import compression from 'compression'
import httpRouter from './services/httpRouter.js'
import socketRouter from './services/socketRouter.js'
import userService from './services/userService.js'
import dataService from './services/dataService.js'

logger.info('NODE_ENV:', process.env.NODE_ENV)
logger.info('session mode:', conf.session.mode)
logger.info('authentication mode:', conf.authentication.mode)
logger.info('storagy mode:', conf.storagy.mode)

let app = express()
app.set('views', path.join(__dirname, '..', 'dist'))
app.use(
  compression({
    filter: (req, res) => {
      const contentType = res.get('Content-Type')
      if (contentType && contentType.indexOf("application/json") === -1) {
        return false
      }
      return compression.filter(req, res)
    }
  })
)
app.use(bodyParser.json({limit: '2gb'}))
app.use(bodyParser.urlencoded({limit: '2gb', extended: true}))
app.use(log4js.connectLogger(logger))




let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', conf.cors)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200)
  }
  else {
    next()
  }
}
app.all('*', allowCrossDomain)




import expressSession from 'express-session'
let expressRedisStore = require('connect-redis')(expressSession)
let expressMongoStore = require('connect-mongo')(expressSession)

let store = null
let session = null
if (conf.session.mode == 'mongo') {
  store = new expressMongoStore({
    url: 'mongodb://' + conf.mongo.server + ':' + conf.mongo.port + '/' + conf.mongo.db,
    clear_interval: 60 * 60
  })
  session = expressSession({
    store: store,
    cookie: {
      path: conf.session.path,
      httpOnly: false,
      maxAge: conf.session.cookieMaxAge
    },
    key: conf.session.key,
    secret: conf.session.secret,
    resave: false,
    saveUninitialized: false
  })
}
else {
  store = new expressRedisStore({
    host: conf.session.redisHost,
    port: conf.session.redisPort,
    db: conf.session.redisdb
  })
  session = expressSession({
    store: store,
    cookie: {
      path: conf.session.path,
      httpOnly: false,
      maxAge: conf.session.cookieMaxAge
    },
    key: conf.session.key,
    secret: conf.session.secret,
    resave: false,
    saveUninitialized: false
  })
}
app.use(session)
httpRouter.use(session)




import passport from 'passport'
import flash from 'connect-flash'
let LocalStrategy = require('passport-local').Strategy
let strategy = null
if (conf.authentication.mode == 'basic') {
  strategy = new LocalStrategy(
    (username, password, next) => {
      userService.authenticate(username, password, (error, user) => {
        if (error) {
          next(null, error)
        }
        else {
          next(null, user)
        }
      })
    }
  )
}
passport.use(strategy)
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())



if (conf.authentication.mode == 'basic') {
  app.post('/authenticate',
    passport.authenticate('local'),
    (req, res) => {
      if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user._id) {
        res.redirect('login')
      }
      else {
        if (req.session && req.session.passport && req.session.passport.user) {
          let error = req.session.passport.user
          req.session.passport.user = null
          res.json({error: error, data: null})
        }
        else {
          res.json({error: 'S002', data: null})
        }
      }
    }
  )
}




let checkAuth = (req, res, next) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    next()
  } else {
    logger.warn('miss session.')
    res.json({error: 'B900', data: null})
  }
}
app.use('/api', checkAuth, httpRouter)




import AWS from 'aws-sdk'
let s3 = new AWS.S3({signatureVersion: 'v2'})
let inspect = require('eyespect').inspector()
import knox from 'knox'

app.get('/static/*', (req, res) => {
  let url = decodeURI(req.url)
  if (url.indexOf('/static/s3') == 0) {
    let client = knox.createClient({
      key: conf.storagy.key,
      secret: conf.storagy.secret,
      bucket: conf.storagy.bucket
    })
    let s3path = url.substring(11, url.length)
    client.getFile(s3path, (err, s3res) => {
      if (err) {
        logger.error(err)
        res.send(404, 'Not found')
        return
      }
      s3res.pipe(res)
      s3res.on('error', (s3err) => {
        inspect(s3err, 'error downloading file from s3')
      })
      s3res.on('progress', (data) => {
        inspect(data, 's3 download progress')
      })
      s3res.on('end', () => {
        inspect(s3path, 'piped file to remote client successfully at s3 path')
      })
    })
  }
  else if (url.indexOf('/static/upload') == 0) {
    url = url.replace('/static/', '/')
    res.sendFile(path.join(__dirname, url))
  }
  else {
    res.sendFile(path.join(__dirname, '..', 'dist', url))
  }
})




app.post('/uploadFiles', (req, res, next) => {
  logger.info('uploadFiles')
  dataService.uploadFiles(req, (error, list, params) => {
    if (!error) {
      logger.info('upload end: ' + JSON.stringify(list))
      logger.info('params: '+JSON.stringify(params))
      let files = []
      for (let i = 0; i < list.length; i ++) {
        if (conf.storagy.mode == 'local') {
          files.push({
            file: conf.endpoint + 'static/upload/' + list[i].folder + '/' + list[i].name,
            thumbnail: list[i].thumbnail? (conf.endpoint + 'static/upload/' + list[i].folder + '/' + list[i].thumbnail): null,
            folder: list[i].folder,
            name: list[i].name,
            type: list[i].type,
            size: list[i].size
          })
        }
        else {
          files.push({
            file: '/static/s3/upload/' + list[i].folder + '/' + list[i].name,
            thumbnail: list[i].thumbnail? ('/static/s3/upload/' + list[i].folder + '/' + list[i].thumbnail): null,
            folder: list[i].folder,
            name: list[i].name,
            type: list[i].type,
            size: list[i].size
          })
        }
      }
      res.json({error: null, data: files})
    }
    else {
      res.json({error: error, data: null})
    }
  })
})




app.get('/login', (req, res) => {
  logger.info('login')
  if (!req.session || !req.session.passport || !req.session.passport.user) {
    res.json({error: null, data: {user: null}})
  }
  else {
    logger.info('user:', JSON.stringify(req.session.passport.user))
    userService.recordLogin(req.session.passport.user, (error, user) => {
      if (error) {
        res.json({error: error, data: null})
      }
      else {
        res.json({error: null, data: {user: user}})
      }
    })
  }
})
app.post('/register', (req, res) => {
  logger.info('register:' + JSON.stringify(req.body.params))
  userService.insertUser(req.body.params, (error, user) => {
    if (error) {
      res.json({error: error, data: null})
    }
    else {
      res.json({error: null, data: {user: user}})
    }
  })
})
app.get('/logout', (req, res) => {
  logger.info('logout')
  if (req.session && req.session.passport && req.session.passport.user) {
    logger.info('user:', req.session.passport.user._id)
  }
  if (req.session) {
    req.session.destroy((error) => {
      logger.debug('logouted:', error)
    })
  }
  req.logout()
  res.json({error: null, data: {}})
})




app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})




let server = http.createServer(app)
let onListening = () => {
  let addr = server.address()
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  logger.info('Listening on ' + bind)
}

mongo.init(() => {
  logger.debug('Begin listen...')

  server.listen(conf.port)
  server.on('listening', onListening)

  socketRouter.init(server, session)
})
