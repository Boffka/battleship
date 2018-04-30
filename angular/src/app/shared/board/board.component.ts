import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector   : 'bs-board',
  templateUrl: './board.component.html',
  styleUrls  : ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input('boardName') name;
  @Input('board') board;
  @Input('move') move;
  @Output() cellAction = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  action(row, col) {
    this.cellAction.emit({y: row, x: col});
  }

}
