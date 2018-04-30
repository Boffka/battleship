import { NgModule } from '@angular/core';

import {
  MatButtonModule, MatCardModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatMenuModule, MatProgressBarModule,
  MatSidenavModule, MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';

const MODULES = [
  MatSnackBarModule,
  MatSidenavModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
  MatCardModule,
  MatProgressBarModule
];

@NgModule({
  imports     : [...MODULES],
  exports     : [...MODULES],
  providers:[]
})
export class BShipMaterialModule {
}
