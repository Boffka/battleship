export class Board {
  defaultSize = 10;
  defaultSquadron = ['L', 'I', 'dot', 'dot'];
  size: number;
  field;
  squadron = [];

  constructor(ships?) {
    this.field = this.makeBoard(this.defaultSize);
    if (ships) {
      this.defaultSquadron.forEach(ship => {
        let coords = this.getCoordinatesDecks(this.shipsDefinition[ship].maxLength, ship, this.field);
        let resp = this.createShip(coords, this.field);
        this.field = resp.board;
        this.squadron.push(resp.ship);
      });
    }
  }

  shipsDefinition = {
    'L'  : {
      maxLength: 4,
      matrix   : [
        [[1, 1, 1, 1], [1]],
        [[[1], [1], [1], [1]], [1]]
      ]
    },
    'I'  : {
      maxLength: 4,
      matrix   : [
        [1, 1, 1, 1],
        [[1], [1], [1], [1]]
      ]
    },
    'dot': {
      maxLength: 1,
      matrix   : [1]
    }
  };

  makeRow(size) {
    let row = [];
    for (let i = 0; i < size; i++) {
      row.push({used: false, value: 0, status: ''})
    }
    return row;
  }

  makeBoard(size) {
    let board = [];
    for (let i = 0; i < size; i++) {
      board.push(this.makeRow(size));
    }
    return board
  }

  getCoordinatesDecks(decks, type, board) {
    let kx = this.getRandom(1),
        ky = (kx === 0) ? 1 : 0,
        x, y;
    if (kx === 0) {
      x = this.getRandom(9);
      y = this.getRandom(10 - decks);
    } else {
      x = this.getRandom(10 - decks);
      y = this.getRandom(9);
    }
    let result = this.checkLocationShip(x, y, kx, ky, decks, type, board);
    if (!result) return this.getCoordinatesDecks(decks, type, board);
    return {
      x    : x,
      y    : y,
      kx   : kx,
      ky   : ky,
      decks: decks,
      type : type
    };
  }

  getRandom(n) {
    return Math.floor(Math.random() * (n + 1));
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  checkLocationShip(x, y, kx, ky, decks, type, board) {
    let fromX, toX, fromY, toY;
    fromX = (x === 0) ? x : x - 1;
    if (x + kx * decks === 10 && kx === 1) toX = x + kx * decks;
    else if (x + kx * decks < 10 && kx === 1) toX = x + kx * decks + 1;
    else if (x === 9 && kx === 0) toX = x + 1;
    else if (x < 9 && kx === 0) toX = x + 2;
    fromY = (y === 0) ? y : y - 1;
    if (y + ky * decks === 10 && ky === 1) toY = y + ky * decks;
    else if (y + ky * decks < 10 && ky === 1) toY = y + ky * decks + 1;
    else if (y === 9 && ky === 0) toY = y + 1;
    else if (y < 9 && ky === 0) toY = y + 2;
    for (let i = fromX; i < toX; i++) {
      for (let j = fromY; j < toY; j++) {
        if (board[i][j].value === 1) return false;
      }
    }
    return true;
  }

  createShip(coords, board) {
    let ship = {
      live  : true,
      coords: new Map()
    };
    let k     = 0,
        x     = coords.x,
        y     = coords.y,
        kx    = coords.kx,
        ky    = coords.ky,
        decks = coords.decks;

    while (k < decks) {
      ship.coords.set(`${[x + k * kx]}:${[y + k * ky]}`, true);
      board[x + k * kx][y + k * ky].value = 1;
      if (coords.type === 'L' && k === decks - 1) {
        let _x = (board[(x + k * kx) + ky]) ? (x + k * kx) + ky : (x + k * kx) - ky;
        let _y = (board[_x][(y + k * ky) + kx]) ? (y + k * ky) + kx : (y + k * ky) - kx;
        board[_x][_y].value = 1;
        ship.coords.set(`${_x}:${_y}`, true);
      }
      k++;
    }
    return {board, ship};
  }

  setKilled(y?, x?) {
    let board = this.field;
    y = Number(y) - 1;
    x = Number(x) - 1;
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        if (board[y + i] && board[y + i][x + k] && board[y + i][x + k].value !== 1) board[y + i][x + k].used = true;
      }
    }
    this.field = board;
    return board;
  }

  shoot(x, y) {
    let result = {
      x,
      y,
      status   : 'used',
      coords   : [],
      value    : this.field[y][x],
      nextMovie: false
    };
    return new Promise((resolve, reject) => {
      if (this.field[y][x].value === 1) {
        result.nextMovie = true;
        let died = this.woundTest({x, y});
        if (died.length > 0) {
          result.coords = died;
          result.status = (this.checkSquadron()) ? 'died' : 'lost';
        } else {
          result.status = 'injured';
        }
      }
      this.setUsed(result);
      resolve(result);
    });
  }

  woundTest(coord) {
    let result = [];
    let key = `${coord.y}:${coord.x}`;
    this.squadron.forEach(ship => {
      let coords = ship.coords;
      if (coords.has(key)) {
        coords.set(key, false);
        let values = Array.from(coords.values());
        if (!values.includes(true)) {
          ship.live = false;
          result = Array.from(coords.keys());
        }
      }
    });
    return result;
  }

  checkSquadron() {
    let values = [];
    this.squadron.forEach(ship => {
      values.push(ship.live);
    });
    return values.includes(true);
  }

  setUsed(params: any) {
    this.field[params.y][params.x].used = true;
    switch (params.status) {
      case('used'):
        break;
      case('injured'):
        this.field[params.y][params.x].used = true;
        this.field[params.y][params.x].value = 1;
        break;
      default:
        this.field[params.y][params.x].used = true;
        this.field[params.y][params.x].value = 1;
        this.setDied(params);
        break;
    }
  }

  setDied(params) {
    params.coords.forEach(coord => {
      coord = coord.split(':');
      this.setKilled(...coord)
    });
  }

}
