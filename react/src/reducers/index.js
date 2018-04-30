import {combineReducers} from "redux";
import boards from "./board";
import player from "./player";
import game from "./game";

export const Reducers = combineReducers({
    player,
    boards,
    game
});


