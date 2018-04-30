import React, {Component} from 'react';

const classNames = require('classnames');

export class Cell extends Component {
    render(){
        let classes = classNames({
            'square':true,
            'used'  :this.props.used,
            'ship'  :this.props.value === 1
        });
        return (
            <button className={classes} onClick={() => this.props.onClick()}></button>
        )
    }
}