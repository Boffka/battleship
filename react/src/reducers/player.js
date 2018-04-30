import {SET_CREDENTIALS, SET_JOINED, SET_MOVE, USER_SIGNIN, USER_SIGNOUT} from "../constants/constants";

const initialState = {
  username: '',
  gameId  : '',
  avatar  : `http://www.designskilz.com/random-users/images/imageF${Math.floor(Math.random() * (50 - 1)) + 1}.jpg`,
  nextMove: false,
  logged  : false,
  joined  : false,
  gameRoom: '',
  opponent: {
    id  : '',
    name: ''
  }
};
export default function player(state = initialState, action){
    switch(action.type) {
        case(SET_MOVE):
            return {...state, nextMove: action.payload};
        case(SET_CREDENTIALS):
            //localStorage.setItem('username', action.payload.username);
            return { ...state, username:action.payload.username, gameId:action.payload.gameId }
        case(USER_SIGNIN):
            //localStorage.setItem('username', action.payload.username);
            return { ...state, username: action.payload.username, gameId:action.payload.gameId, logged:true }
        case(USER_SIGNOUT):
            localStorage.clear();
            return { ...state, ...initialState };
        case(SET_JOINED):
            return {
                ...state,
                joined  :action.payload.joined,
                opponent:action.payload.opponent,
                nextMove:action.payload.nextMove,
                gameRoom:action.payload.gameRoom
            };
        default:
            return state

    }

}