import React, {Component} from 'react';
import {Cell} from "../components/Cell";
import {Card, CardHeader, CardMedia} from "material-ui";

const classNames = require('classnames');

export class Board extends Component {
    render(){
        let classes = classNames({
            'move-board':this.props.nextMove
        });
        return (
            <Card className={classes}>
                <CardHeader
                    titleStyle={{ marginRight:'-90px' }}
                    title={this.props.name}
                    subtitleStyle={{ marginRight:'-90px' }}
                />
                <CardMedia>
                    <div className={'Board'}>
                        {this.props.board.map((row, Rindex) => (
                                <div key={Rindex} className="board-row">
                                    {row.map((cell, Cindex) => <Cell key={Cindex} used={cell.used} value={cell.value}
                                                                     onClick={() => this.props.onClick(Rindex, Cindex)}/>)}
                                </div>
                            )
                        )}
                    </div>
                </CardMedia>
            </Card>
        )
    }
}