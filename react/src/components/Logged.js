import React from 'react';
import {IconButton, IconMenu, MenuItem} from "material-ui";
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

export function Logged(props){
    return (
        <section style={{
            display       :'flex',
            alignItems    :'center',
            justifyContent:'center',
            color         :'#ffffff',
            cursor        :'pointer',
            fontWeight    :'bold'
        }}>
            <picture style={{
                width       :'30px',
                height      :'30px',
                overflow    :'hidden',
                borderRadius:'50%',
                marginRight :'10px'
            }}>
                <img style={{ width:'100%' }} src={props.profile.avatar} alt=""/>
            </picture>
            <span>{props.profile.username}</span>
            <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                targetOrigin={{ horizontal:'right', vertical:'top' }}
                anchorOrigin={{ horizontal:'right', vertical:'top' }}>
                <MenuItem onClick={props.onClick} primaryText="Sign out"/>
            </IconMenu>
        </section>
    )
}
