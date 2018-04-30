import React, {Component} from 'react';
import './App.css';
import {connect} from "react-redux";
import {RootActions} from "../actions";
import {bindActionCreators} from "redux";
import {Board} from "./Board";
import {AppBar, LinearProgress, RaisedButton, Snackbar, TextField} from "material-ui";
import {Logged} from "../components/Logged";
import {Aside} from "../components/Aside";

const io = require('socket.io-client')('localhost:7777');

class App extends Component {
    componentDidMount(){
        this.initIO();
    }

    initIO(){
        io.on('errorsMessages', (msg) =>{
            this.props.actions.pushNotification(msg);
        });

        io.on('action', (...msg) =>{
            let [action, payload] = msg;
            this.props.actions[action](payload);
        })
    }

    signIn(username){
        io.send('signIn', { username:username });
    }

    createGame(){
        let username = this.refs.myInput.input.value;
        this.signIn(username);
    }

    signOut(){
        this.props.actions.signOut();
        io.disconnect();
        this.props.actions.updateGamelist([]);
        io.connect();
    }

    joinGame(gameId){
        if(this.props.player.logged) {
            io.send('joinGame', { gameId:gameId, opponent:this.props.player.username })
        } else {
            this.props.actions.pushNotification('You must login first!')
        }

    }

    resetNotification(){
        this.props.actions.resetNotification();
    }

    handleClick(y, x, id){
        if(this.props.game.gameStarted && this.props.player.nextMove && id === 'opponent') {
            io.send('shoot', { x, y, gameRoom:this.props.player.gameRoom, opponent:this.props.player.opponent });
            this.props.actions.setMove(false);
        }
    }

    startNewGame(){
        io.send('startNewGame', { opponent:this.props.player.opponent.id });
    }

    render(){
        return (
            <div className="App">
                <Aside gamelist={this.props.game.gamelist} username={this.props.player.username}
                       onClick={(id) =>{this.joinGame(id)}}/>
                <section style={{ marginLeft:'256px' }}>
                    <AppBar title={'Battleship'}
                            iconElementLeft={<div></div>}
                            iconElementRight={this.props.player.logged ?
                                <Logged onClick={() => this.signOut()} profile={this.props.player}/> : <div></div>}/>
                    <section style={{ padding:'30px' }}>
                        {this.props.game.canCreateNewGame &&
                        <RaisedButton secondary={true} label="Start new game" fullWidth={true}
                                      onClick={this.startNewGame.bind(this)}/>
                        }
                        {this.props.player.logged && !this.props.game.gameStarted &&
                        <section>
                            <h4>Waiting for new opponent!</h4>
                            <LinearProgress mode="indeterminate"/>
                        </section>
                        }
                    </section>
                    {!this.props.player.logged &&
                    <div>
                        <TextField ref={'myInput'} floatingLabelText="Username"/>&nbsp;
                        <RaisedButton label="Create game!" onClick={this.createGame.bind(this)} primary={true}/>

                    </div>
                    }
                    <h2> {this.props.errors}</h2>
                    {this.props.boards.player.length > 0 &&
                    <div className={'thegame'}>
                        <Board nextMove={!this.props.player.nextMove} name={"My Board"} board={this.props.boards.player}
                               onClick={(row, col) => this.handleClick(row, col, 'player')}/>
                        <Board nextMove={this.props.player.nextMove} name={this.props.player.opponent.name}
                               board={this.props.boards.opponent}
                               onClick={(row, col) => this.handleClick(row, col, 'opponent')}/>
                    </div>
                    }
                    <Snackbar
                        open={this.props.notification.open}
                        message={this.props.notification.message}
                        autoHideDuration={4000}
                        onRequestClose={() => this.resetNotification()}
                    />
                </section>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    player      :state.player,
    errors      :state.errors,
    boards      :state.boards,
    game        :state.game,
    notification:state.game.notification
});
const mapDispatchToProps = dispatch => ({
    actions:bindActionCreators(RootActions, dispatch)
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

