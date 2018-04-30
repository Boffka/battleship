import { BrowserModule } from '@angular/platform-browser';
import { NgModule, TemplateRef } from '@angular/core';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BShipMaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { IOService } from './shared/services/io/io.service';
import { StoreModule } from '@ngrx/store';
import { boardReducer, gameReducer, playerReducer } from './core/reducers';
import { GameActions } from './core/actions/game';
import { BoardComponent } from './shared/board/board.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    BShipMaterialModule,
    FlexLayoutModule,
    StoreModule.forRoot({
      player      :playerReducer,
      boards      :boardReducer,
      game        :gameReducer,
    })
  ],
  providers: [IOService, GameActions],
  bootstrap: [AppComponent]
})
export class AppModule { }

