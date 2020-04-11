import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Globales} from '../Typescript/Globales';
import { AppComponent } from './app.component';
import {Automata} from '../Typescript/Metodos/Automata';
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
