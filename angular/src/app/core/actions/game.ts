import {
  DISCONNECT_OPPONENT, PUSH_NOTIFICATION,
  RESET_NOTIFICATION, SET_BOARDS,
  SET_GAME_FINAL, SET_JOINED, SET_MOVE,
  START_NEW_GAME,
  UPDATE_GAMELIST, USER_SIGNIN, USER_SIGNOUT
} from '../constants';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class GameActions {

  // noinspection TypescriptExplicitMemberType
  constructor(@Inject(Store) private store) {}

  public updateGamelist(data) {
    this.store.select('player').subscribe(player => {
      if(data && data.gamelist){
        data.gamelist = data.gamelist.filter(g => g.name !== player.username)
      }
      this.store.dispatch({type: UPDATE_GAMELIST, payload: data})
    });

  }

  public signIn(credentials) {
    this.store.dispatch({type: USER_SIGNIN, payload: credentials});
  };

  public setJoinedStatus(data) {
    this.store.dispatch({type: SET_JOINED, payload: data});
  };

  public setMove(status) {
    this.store.dispatch({type: SET_MOVE, payload: status.move});
  };


  public signOut(credentials?) {
    this.store.dispatch({type: DISCONNECT_OPPONENT, payload: credentials});
    this.store.dispatch({type: USER_SIGNOUT, payload: credentials});
  };

  public setBoards(boards?) {
    this.store.dispatch({type: SET_BOARDS, payload: boards});
  }

  public opponentDisconnected(data) {
    this.store.dispatch({type: DISCONNECT_OPPONENT, payload: data});
  }

  public setGameFinal(data) {
    this.store.dispatch({type: SET_GAME_FINAL, payload: data});
  }

  public startNewGame(data) {
    this.store.dispatch({type: START_NEW_GAME, payload: data});
  };

  public resetNotification() {
    this.store.dispatch({type: RESET_NOTIFICATION});
  }
  public pushNotification(message) {
    this.store.dispatch({type: PUSH_NOTIFICATION, payload: message});
  }

}
