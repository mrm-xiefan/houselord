import conf from 'config'
import logger from './logger.js'
import roomService from './roomService.js'

class SocketRouter {
  constructor() {
    this.io = null
  }
  init(server, session) {
    let self = this
    self.io = require('socket.io')(server, {path: conf.socketPath})
    // self.io.set('heartbeat interval', 1000)
    // self.io.set('heartbeat timeout', 5000)

    self.io.use((socket, next) => {
      session(socket.request, socket.request.res, next)
    })

    self.io.sockets.on('connection', (socket) => {
      logger.info('connected: ' + socket.id)
      if (socket.request && socket.request.session && socket.request.session.passport && socket.request.session.passport.user) {
        logger.info('socket session: ' + JSON.stringify(socket.request.session.passport.user))
      }
      let client = roomService.login(socket)
      roomService.spy()

      socket.on('reinit', (params) => {
        logger.info(socket.id + ' reinit: ' + JSON.stringify(params))
        roomService.recovery(client, params)
        socket.emit('reinited', {})
        roomService.spy()
      })

      socket.on('enterLobby', (params) => {
        logger.info('enterLobby: ' + socket.id)
        self.checkAuth(socket, () => {
          if (roomService.enterLobby(client)) {
            roomService.spy()
          }
        })
      })

      socket.on('enterChatRoom', (params) => {
        logger.info('enterChatRoom: ' + socket.id + '|' + JSON.stringify(params))
        self.checkAuth(socket, () => {
          if (roomService.enterChatRoom(client)) {
            // chatService.getChats((error, chats, count) => {
            //   if (error) {
            //     socket.emit('processError', error)
            //   }
            //   else {
            //     socket.emit('initChatRoom', {chats: chats, count: count})
            //   }
            // })
            roomService.spy()
          }
        })
      })

      socket.on('disconnect', () => {
        roomService.logout(client)
        roomService.spy()
      })
    })
    logger.debug('socket init ok!')
  }
  checkAuth(socket, next) {
    if (socket.request && socket.request.session && socket.request.session.passport && socket.request.session.passport.user) {
      next()
    }
    else {
      socket.emit('authenticateError', {})
    }
  }
}

export default new SocketRouter()



// // sending to sender-client only
// socket.emit('message', 'begin game')

// // sending to all clients, include sender
// io.emit('message', 'join game')

// // sending to all clients except sender
// socket.broadcast.emit('message', 'enemy comes in')

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game')

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game')

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game')

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg')

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only')
