import {
    DISCONNECT_OPPONENT,
    PUSH_NOTIFICATION,
    RESET_NOTIFICATION,
    SET_GAME_FINAL,
    SET_JOINED, START_NEW_GAME,
    UPDATE_GAMELIST
} from "../constants/constants";

const initialState = {
    gameStarted     :false,
    canCreateNewGame:false,
    gamelist        :[],
    notification    :{
        open   :false,
        message:''
    }
};
export default function game(state = initialState, action){
    switch(action.type) {
        case(UPDATE_GAMELIST):
            return { ...state, gamelist:action.payload.gamelist };
        case(SET_JOINED):
            return { ...state, gameStarted:true };
        case(SET_GAME_FINAL):
            let message = (action.payload.status === 'won') ? 'You won the game!' : 'You lost the game!';
            return {
                ...state,
                gameStarted :false, canCreateNewGame:true,
                notification:{ open:true, message:message }
            };
        case(START_NEW_GAME):
            return { ...state, gameStarted:true, canCreateNewGame:false };
        case(DISCONNECT_OPPONENT):
            return {
                ...state, gameStarted:false, canCreateNewGame:false,
                notification         :{ open:true, message:'Opponent disconnected!' }
            };
        case(PUSH_NOTIFICATION):
            return { ...state, notification:{ open:true, message:action.message } };
        case(RESET_NOTIFICATION):
            return { ...state, notification:{ open:false, message:'' } };
        default:
            return state

    }
}