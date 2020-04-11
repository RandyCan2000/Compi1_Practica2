import {Globales} from '../Globales';
export class Error{
    Id:number;
    Lexema:String;
    Tipo:String;
    Esperado:String;
    Fila:number;
    Columna:number;

    constructor(Tipo:String,Esperado:String,Fila:number,Columna:number){
        this.Id=Globales.ERRORES.length;
        this.Lexema="";
        this.Tipo=Tipo;
        this.Esperado=Esperado;
        this.Fila=Fila;
        this.Columna=Columna;
    }
    toString():String{
        return this.Id+":"+this.Lexema+":"+this.Tipo+":"+this.Esperado+":"+this.Fila+":"+this.Columna;
    }
    
}