import {
    DISCONNECT_OPPONENT, PUSH_NOTIFICATION,
    RESET_NOTIFICATION, SET_BOARDS,
    SET_GAME_FINAL, SET_JOINED, SET_MOVE,
    START_NEW_GAME,
    UPDATE_GAMELIST, USER_SIGNIN, USER_SIGNOUT
} from '../constants/constants';

export const updateGamelist = data => ({type:UPDATE_GAMELIST, payload:(data.gamelist)? data : {gamelist:data}});
export const setGameFinal = data => ({type:SET_GAME_FINAL, payload:data});
export const startNewGame = (data) => dispatch => {
    dispatch({type:START_NEW_GAME, payload:data});
};

export const opponentDisconnected = (data) => dispatch => {
    dispatch({type:DISCONNECT_OPPONENT, payload:data});
};

/*Notifications*/
export const pushNotification = msg => ({type:PUSH_NOTIFICATION, message:msg});
export const resetNotification = () => ({type:RESET_NOTIFICATION});

/*Board*/
export const setBoards = (data) => ({ type:SET_BOARDS, payload:data});

/*Player*/
export const setMove = status => ({ type:SET_MOVE, payload:status.move });
export const signIn = credentials => ({ type:USER_SIGNIN, payload:credentials });
export const signOut = credentials => ({ type:USER_SIGNOUT, payload:credentials });
export const setJoinedStatus = (data) => dispatch =>{
    dispatch({ type:SET_JOINED, payload:data });
};
