import { Component, OnInit } from '@angular/core';
import { IOService } from './shared/services/io/io.service';
import { Store } from '@ngrx/store';
import { GameActions } from './core/actions/game';
import { MatSnackBar } from '@angular/material';
//import { IOService } from './shared/services/io/io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  usernameInput = '';
  player;
  game;
  boards;
  gamelist = [];
  constructor(
    private SocketClient:IOService,
    private store: Store<any> ,
    private actions:GameActions,
    public snackBar: MatSnackBar
  ) {
  }
  ngOnInit(): void {
    this.store.select('player').subscribe(player=>{
      this.player = player;
    });

    this.store.select('game').subscribe((game)=>{
      this.game = game;
      if(this.game.notification.open){
        this.showNotification(this.game.notification.message)
      }
    });
    this.store.select('boards').subscribe((board)=>{
      this.boards = board;
    })

  }
  showNotification(msg){
    this.snackBar.open(msg, 'Ok!', {duration: 2000}).afterDismissed().subscribe(()=>{
      this.actions.resetNotification()
      console.log('Dismissed')
    });
  }
  createGame(){
    let username = this.usernameInput;
    if(username){
      this.signIn(username);
    }
  }

  /*setGamelist(game){
    this.gamelist = game.gamelist.slice().filter(g => g.name !== this.player.username)
    console.log('Gamelist settings',this.gamelist)
  }*/
  signIn(username){
    this.SocketClient.init();
    this.SocketClient.io.send('signIn', { username:username });
  }
  signOut(){
    this.actions.signOut();
    this.SocketClient.disconnect();
    this.actions.updateGamelist([]);
  }
  joinGame(gameId, status){
    if(status === 'free'){
      if(this.player.logged){
        this.SocketClient.io.send('joinGame', { gameId:gameId, opponent:this.player.username})
      } else {
        this.actions.pushNotification('You must login first!')
      }
    } else {
      this.actions.pushNotification("Yo can't join this game! This game is busy.")
    }

  }
  cellAction(ev:any, id){
    if(this.player.nextMove && id === 'opponent'){
      this.SocketClient.io.send('shoot', { x: ev.x, y:ev.y, gameRoom:this.player.gameRoom, opponent: this.player.opponent});
      this.actions.setMove({status: false});
    }

  }
  startNewGame(){
    this.SocketClient.io.send('startNewGame', { opponent:this.player.opponent.id });
  }


}
