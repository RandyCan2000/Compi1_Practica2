import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Globales} from '../app/Typescript/Globales';
import { AppComponent } from './app.component';
import {Automata} from '../app/Typescript/Metodos/Automata';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [Globales,Automata],
  bootstrap: [AppComponent]
})
export class AppModule { }
