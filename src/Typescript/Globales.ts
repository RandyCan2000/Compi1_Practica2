import {Injectable} from '@angular/core';
import {Tokens} from './TDA/Tokens';
import {Error} from './TDA/Errores';
@Injectable()
export class Globales{
    public static ContadorCapazRep:number=1;
    public static ContadorCapaz:number=0;
    public static ContadorPestania:number=0;
    public static Seleccionado:String="";
    public static Traduccion:String="";
    public static TOKENS:Tokens[]=[];
    public static ERRORES:Error[]=[];
}
