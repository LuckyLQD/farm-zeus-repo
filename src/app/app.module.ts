import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WalletComponent } from './wallet/wallet.component';
import { BoardComponent } from './board/board.component';
import { WindowRef } from './window-ref';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgInitDirective } from './directives/ng-init.directive';



@NgModule({
  declarations: [
    AppComponent,
    WalletComponent,
    BoardComponent,
    NgInitDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ WindowRef ],
  bootstrap: [AppComponent]
})
export class AppModule { }
