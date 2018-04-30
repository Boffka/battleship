import {
  DISCONNECT_OPPONENT, USER_SIGNOUT, SET_BOARDS
} from '../constants';

const initialState = {
  boardSize: 10,
  player   : [],
  opponent : [],
};

export function boardReducer(state = initialState, action) {
  switch (action.type) {
    case(SET_BOARDS):
      return Object.assign(state, {player: action.payload.player.field, opponent: action.payload.opponent.field})
    case(DISCONNECT_OPPONENT):
      return Object.assign(state,initialState);
    case(USER_SIGNOUT):
      return initialState;
    default:
      return state

  }
}



