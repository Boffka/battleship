import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { GameActions } from '../../../core/actions/game';

@Injectable()
export class IOService {
  io;
  constructor(private actions: GameActions) {}

  init(){
    this.io = io('localhost:7777');
    this.initIO();
  }

  initIO() {
    /*this.io.on('errorsMessages', (msg) => {});*/
    this.io.on('connect', () => {
      this.io.on('disconnect', (msg) => {
        this.actions.signOut();
      });
    });

    this.io.on('action', (...msg) => {
      this.runAction(...msg)
    });
  }

  runAction(action?, payload?){
    this.actions[action as string](payload);
  }

  disconnect(){
    this.io.disconnect();
  }

}
