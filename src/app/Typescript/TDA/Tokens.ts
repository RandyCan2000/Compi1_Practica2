import {Globales} from '../Globales';
export class Tokens{
    Id:number;
    Lexema:String;
    Fila:number;
    Columna:number;

    constructor(Lexema:String,Fila:number,Columna:number){
        this.Id=Globales.TOKENS.length;
        this.Lexema=Lexema;
        this.Fila=Fila;
        this.Columna=Columna;
    }
    
}