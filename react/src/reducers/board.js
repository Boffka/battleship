import {DISCONNECT_OPPONENT, USER_SIGNOUT, SET_BOARDS} from '../constants/constants';

const initialState = {
    boardSize:10,
    player   :[],
    opponent :[]
};

export default function board(state = initialState, action){
    switch(action.type) {
        case(SET_BOARDS):
            return {...state, player:action.payload.player.field, opponent:action.payload.opponent.field };
        case(DISCONNECT_OPPONENT):
            return { ...initialState };
        case(USER_SIGNOUT):
            return initialState;
        default:
            return state
    }
}



