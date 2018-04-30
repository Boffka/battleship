import { BootScript } from '@mean-expert/boot-script';
import { Board } from '../helpers/board';

@BootScript()
class IO {

  constructor(private app: any) {
    this.initIo();
  }

  initIo() {
    this.app.io = require('socket.io').listen(7777, {
      transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
    });
    this.app.io.on('connection', (socket: any) => {
      this.ioEventsInit(socket);
    })
  }

  ioEventsInit(socket) {
    socket.on('disconnect', () => {
      this.broadcastGamelist();
      if (socket.opponent) {
        if (this.app.io.sockets.connected[socket.opponent]) {
          this.app.io.sockets.connected[socket.opponent].emit('action', 'opponentDisconnected', {});
        }
      }
    });
    socket.on('message', (...params) => {
      switch (params[0]) {
        case('signIn'):
          socket.username = params[1].username;
          socket.emit('action', 'signIn', {username: socket.username, gameId: socket.id});
          this.broadcastGamelist();
          break;
        case('signOut'):
          socket.disconnect(true);
          return this.broadcastGamelist();
        case('joinGame'):
          //todo Limit rooms
          socket.join(params[1].gameId);
          socket.opponent = params[1].gameId;
          this.app.io.sockets.connected[socket.opponent].opponent = socket.id;
          socket.emit('action', 'setJoinedStatus', {
            joined  : true,
            nextMove: true,
            gameRoom: params[1].gameId,
            opponent: {
              id  : this.app.io.sockets.connected[socket.opponent].id,
              name: this.app.io.sockets.connected[socket.opponent].username
            }
          });
          this.app.io.sockets.connected[socket.opponent].emit('action', 'setJoinedStatus', {
            joined  : true,
            nextMove: false,
            gameRoom: params[1].gameId,
            opponent: {
              id  : socket.id,
              name: socket.username
            }
          });
          this.createNewBoards(socket).then(() => {
            this.sendBoards(socket);
          });
          return this.broadcastGamelist();
        case('shoot'):
          this.shoot(params, socket);
          break;
        case('startNewGame'):
          this.createNewBoards(socket).then(() => {
            this.sendBoards(socket);
            this.app.io.sockets.connected[params[1].opponent].emit('action', 'startNewGame', {});
            this.app.io.sockets.connected[params[1].opponent].emit('action', 'setMove', {move: false});
            socket.emit('action', 'startNewGame', {});
            socket.emit('action', 'setMove', {move: true});
          });
          break;
        case('newGame'):
          socket.username = params[1].username;
          return this.broadcastGamelist();
      }
    })
  }

  createNewBoards(socket) {
    return new Promise((resolve, reject) => {
      socket.boards = {
        player  : new Board(true),
        opponent: new Board(false)
      };
      this.app.io.sockets.connected[socket.opponent].boards = {
        player  : new Board(true),
        opponent: new Board(false)
      };
      resolve(true);
    });
  }

  setNextMovie(me, oppo, socket) {
    this.app.io.sockets.connected[socket.opponent].emit('action', 'setMove', {move: oppo});
    socket.emit('action', 'setMove', {move: me});
  }

  shoot(params, socket) {
    this.app.io.sockets.connected[socket.opponent].boards.player.shoot(params[1].x, params[1].y).then((resp) => {
        socket.boards.opponent.setUsed(resp);
        this.sendBoards(socket);
        if (resp.status === 'lost') {
          this.emitGameover('me', 'opponent', socket)
        } else {
          this.setNextMovie(resp.nextMovie, !resp.nextMovie, socket);
        }

      }
    );
  }

  sendBoards(socket) {
    socket.emit('action', 'setBoards', socket.boards);
    this.app.io.sockets.connected[socket.opponent].emit('action', 'setBoards', this.app.io.sockets.connected[socket.opponent].boards);
  }

  emitGameover(won, lost, socket) {
    this.app.io.sockets.connected[socket.opponent].emit('action', 'setMove', {move: false});
    socket.emit('action', 'setMove', {move: false});
    socket.emit('action', 'setGameFinal', {status: 'won'});
    this.app.io.sockets.connected[socket.opponent].emit('action', 'setGameFinal', {status: 'lost'});
  }

  broadcastGamelist() {
    let games = [];
    let busy = [];
    let connected = this.app.io.sockets.connected;
    Object.keys(connected).forEach(id => {
      if (connected[id].username) {
        let status = (this.app.io.sockets.adapter.rooms[id].length < 2) ? 'free' : 'game';
        if (this.app.io.sockets.adapter.rooms[id].length > 1) {
          Object.keys(this.app.io.sockets.adapter.rooms[id].sockets).forEach(key => busy.push(key))
        }
        games.push({gameId: id, name: connected[id].username, status: status})

      }
    });
    games = games.map((game) => {
      game.status = (busy.includes(game.gameId)) ? 'game' : game.status;
      return game;
    });
    this.app.io.local.emit('action', 'updateGamelist', {gamelist: games});
  }
}

module.exports = IO;
