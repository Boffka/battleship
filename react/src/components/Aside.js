import React from 'react';
import {AppBar, Drawer, MenuItem} from "material-ui";
import Games from 'material-ui/svg-icons/av/games';

const classNames = require('classnames');

export function Aside(props){
    let gamelist = props.gamelist.filter(game => game.name !== props.username);
    let classes = (game) =>{
        return classNames({
            'icon-green':game.status === 'free',
            'icon-red'  :game.status === 'game'
        });
    };
    return (
        <Drawer open={true} docked={true}>
            <AppBar iconElementLeft={<div></div>} title={'Game Rooms'}
                    titleStyle={{ fontSize:'20px', fontWeight:'200' }}/>
            {gamelist.map((game, index) =>
                <MenuItem disabled={game.status === 'game'}
                          rightIcon={<Games className={classes(game)}/>}
                          key={index}
                          onClick={() =>{props.onClick(game.gameId)}}>{game.name}</MenuItem>
            )}
        </Drawer>
    )
}