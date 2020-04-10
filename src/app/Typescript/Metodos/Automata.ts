import { Component } from '@angular/core';
import {Globales} from '../Globales';
import {Tokens} from '../TDA/Tokens';
import { Error } from '../TDA/Errores';
export class Automata{
    ERR:Error;
    TOK:Tokens;
    AnalisisLexico(Texto:String){
        Globales.TOKENS=[];
        Globales.ERRORES=[];
        let PVoidID=false;
        let PVarFun=false;
        let Estado:number=0;
        let Fila:number=1;
        let Columna:number=0;
        let Letra:string="";
        let Token:string="";
        for(let Indice:number=0;Indice<Texto.length;Indice++){
            Letra=Texto.charAt(Indice);
            if(Letra=="\n"){Fila++;Columna=0;}
            else{Columna++;}
            switch (Estado) {
                //Redireccion a las demas estados
                case 0:
                    Token="";
                    let PosText:String="";
                    let Permiso:boolean=false;
                    for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                        if(Texto.charAt(Aux)==" "||Texto.charAt(Aux)=="="||Texto.charAt(Aux)==";"||Texto.charAt(Aux)=="("){
                            if(PosText=="int"||PosText=="char"||PosText=="double"||PosText=="string"||PosText=="bool"||PosText=="void"||PosText=="if"){
                                Permiso=true;break;}
                        }else{PosText+=Texto.charAt(Aux);}
                    }
                    if(Letra=="\n"||Letra=="\t"||Letra==" "){Estado=0;}
                    else if(Letra=="/"){Estado=1;Token=Letra;}//Cometarios
                    else if(Letra=="i" && Permiso==true){Estado=4;Token=Letra;}//Palabras con i (int, if)
                    else if(Letra=="d" && Permiso==true){Estado=5;Token=Letra;}//Palabras con d
                    else if(Letra=="c" && Permiso==true){Estado=6;Token=Letra;}//Palabras con c
                    else if(Letra=="b" && Permiso==true){Estado=7;Token=Letra;}//Palabras con b
                    else if(Letra=="s" && Permiso==true){Estado=8;Token=Letra;}//Palabras con s
                    else if(Letra=="v" && Permiso==true){Estado=13;Token=Letra;}//Palabras con v
                    else if(Letra=="}"){
                        this.TOK=new Tokens("}",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Estado=0;Token="";}//Fin Funcion }
                    else if((Letra.charCodeAt(0)>=33 && Letra.charCodeAt(0)<=64)||
                    (Letra.charCodeAt(0)>=91 && Letra.charCodeAt(0)<=94)||
                    (Letra.charCodeAt(0)==96)||
                    (Letra.charCodeAt(0)>=123 && Letra.charCodeAt(0)<=163)||
                    (Letra.charCodeAt(0)>=166 && Letra.charCodeAt(0)<=255)){
                        Token+=Letra;
                        this.ERR=new Error("LEXICO","NO VALIDO",Fila,Columna);
                        Estado=399;
                    }
                    else{//Variables a asisgnar valor
                        Token=Letra;
                        Estado=17;
                    }
                    break;
                case 1:
                    if(Letra=="/"){Estado=2;Token+=Letra;}
                    else if(Letra=="*"){Estado=3;Token+=Letra;}
                    else{Estado=400;Token+=Letra;
                        this.ERR=new Error("SINTACTICO","* o /",Fila,Columna);
                    }
                    break;
                case 2:
                    this.TOK=new Tokens(Token,Fila,Columna);
                    Globales.TOKENS.push(this.TOK);
                    Token="";
                    for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                        if(Texto.charAt(Aux)=="\n"||Aux==Texto.length-1){
                            Token+=Texto.charAt(Aux);
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=0;
                            Fila++;Columna=0;
                            Indice=Aux;
                            break;
                        }
                        else{
                            Token+=Texto.charAt(Aux);
                        }
                    }
                    break;
                case 3:
                    this.TOK=new Tokens(Token,Fila,Columna);
                    Globales.TOKENS.push(this.TOK);
                    Token="";
                    for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                        try {
                            if(Texto.charAt(Aux)=="*" && Texto.charAt(Aux+1)=="/"){
                                this.TOK=new Tokens(Token,Fila,Columna);
                                Globales.TOKENS.push(this.TOK);
                                this.TOK=new Tokens("*/",Fila,Columna+1);
                                Globales.TOKENS.push(this.TOK);
                                Token="";
                                Estado=0;
                                Indice=Aux+1;
                                Columna=Columna+1;
                                break;
                            }
                            else if(Aux==Texto.length-1){
                                this.ERR=new Error("SINTACTICO","*/",Fila,Columna);
                                Indice--;
                                Estado=400;
                                break;
                                }
                            else{
                                if(Texto.charAt(Aux)=="\n"){Fila++;Columna=0;}
                                else{Columna++;}
                                Token+=Texto.charAt(Aux);
                            }
                        } catch (error) {
                            this.ERR=new Error("SINTACTICO","*/",Fila,Columna);
                            Indice--;
                            Estado=400;
                            break;
                        }
                    }
                    break;
                case 4:
                    if(Letra=="n"){Token+=Letra;}
                    else if(Letra=="t"){
                        Token+=Letra;
                        if(Token=="int"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=9;
                        }else{
                            this.ERR=new Error("SINTACTICO","int",Fila,Columna);
                            Estado=400;
                        }
                    }//acepta int
                    else if(Letra=="f"){
                        Token+=Letra;
                        if(Token=="if"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=19;
                        }else{
                            this.ERR=new Error("SINTACTICO","if",Fila,Columna);
                            Estado=400;
                        }
                    }
                    else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","int",Fila,Columna);
                        Estado=400;
                    }//error lexico
                    break;
                case 5://reconociemiento de double
                    if(Letra=="o"){Token+=Letra;}
                    else if(Letra=="u"){Token+=Letra;}
                    else if(Letra=="b"){Token+=Letra;}
                    else if(Letra=="l"){Token+=Letra;}
                    else if(Letra=="e"){
                        Token+=Letra;
                        if(Token=="double"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=9;
                        }else{
                            this.ERR=new Error("SINTACTICO","double",Fila,Columna);
                            Estado=400;
                        }
                    }//acepta double
                    else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","double",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 6:
                    if(Letra=="h"){Token+=Letra;}
                    else if(Letra=="a"){Token+=Letra;}
                    else if(Letra=="r"){
                        Token+=Letra;
                        if(Token=="char"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=9;
                        }else{
                            this.ERR=new Error("SINTACTICO","char",Fila,Columna);
                            Estado=400;
                        }
                    }//aceptacion char
                    else{
                        this.ERR=new Error("SINTACTICO","char",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 7:
                    if(Letra=="o"){Token+=Letra;}
                    else if(Letra=="l"){
                        Token+=Letra;
                        if(Token=="bool"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=9;
                        }else{
                            this.ERR=new Error("SINTACTICO","bool",Fila,Columna);
                            Estado=400;
                        }
                    }
                    else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","bool",Fila,Columna);
                        Estado=400;
                    }   
                    break;
                case 8:
                    if(Letra=="t"){Token+=Letra;}
                    else if(Letra=="r"){Token+=Letra;}
                    else if(Letra=="i"){Token+=Letra;}
                    else if(Letra=="n"){Token+=Letra;}
                    else if(Letra=="g"){
                        Token+=Letra;
                        if(Token=="string"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=9;
                        }else{
                            this.ERR=new Error("SINTACTICO","string",Fila,Columna);
                            Estado=400;
                        }
                    }else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","string",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 9://Nombre Varibles primer letra
                    if((Letra.charCodeAt(0)>=65 && Letra.charCodeAt(0)<=90)||
                        (Letra.charCodeAt(0)>=97 && Letra.charCodeAt(0)<=122)||
                        (Letra.charCodeAt(0)==95)){
                            Token=Letra;Estado=10;
                    }
                    else if(Letra==" "||Letra=="\t"){if(Token!=""){Estado=10;}}
                    else if(Letra.charCodeAt(0)>=48 && Letra.charCodeAt(0)<=57){
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","Letra o Guion Bajo",Fila,Columna);
                        Estado=400;
                    }
                    else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","Letra o Guion Bajo",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 10://reconocimiento de nombre variable
                    if((Letra.charCodeAt(0)>=65 && Letra.charCodeAt(0)<=90)||
                        (Letra.charCodeAt(0)>=97 && Letra.charCodeAt(0)<=122)||
                        (Letra.charCodeAt(0)>=48 && Letra.charCodeAt(0)<=57)||
                        (Letra.charCodeAt(0)==95)){
                            Token+=Letra;
                            Estado=10;
                    }else if(Letra==" "){
                        /*if(PVarFun==true){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Estado=15;PVarFun=false;Token="";}
                        else{
                            Estado=11;
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                        }*/
                        for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                            if(Texto.charAt(Aux)==" "||Texto.charAt(Aux)=="\t"){}
                            else{Indice=Aux-1;break;}
                        }
                    }else if(Letra==" " && PVoidID==true){//Id de una funcion
                        this.TOK=new Tokens(Token,Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=14;
                    }else if(Letra=="("){//Id de una funcion
                        this.TOK=new Tokens(Token,Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=14;
                        Indice--;
                    }else if(Letra==")" && PVarFun==true){
                        Estado=16;
                        this.TOK=new Tokens(Token,Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        this.TOK=new Tokens(")",Fila,Columna+1);
                        Globales.TOKENS.push(this.TOK);
                        PVarFun=false;
                        Token="";
                    }else if(Letra=="=" && PVoidID==false && PVarFun==false){
                        Estado=11;Indice--;
                        this.TOK=new Tokens(Token,Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                    }else if(Letra=="," && PVoidID==false){
                        if(PVarFun==true){
                            this.TOK=new Tokens(Token,Fila,Columna);//variable
                            Globales.TOKENS.push(this.TOK);
                            Estado=15;PVarFun=false;Token="";}
                        else{
                            Estado=9;
                            this.TOK=new Tokens(Token,Fila,Columna);//variable
                            Globales.TOKENS.push(this.TOK);
                            this.TOK=new Tokens("=",Fila,Columna);//igual
                            Globales.TOKENS.push(this.TOK);
                            this.TOK=new Tokens("",Fila,Columna);//valor
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                        }
                    }else if(Letra==";" && PVoidID==false){
                        this.TOK=new Tokens(Token,Fila,Columna);//variable
                        Globales.TOKENS.push(this.TOK);
                        this.TOK=new Tokens("=",Fila,Columna);//igual
                        Globales.TOKENS.push(this.TOK);
                        this.TOK=new Tokens("",Fila,Columna);//valor
                        Globales.TOKENS.push(this.TOK);
                        this.TOK=new Tokens(";",Fila,Columna);//punto y coma
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=0;
                    }else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","VARIABLES",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 11://reconocimiento de igual
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra=="="){
                        this.TOK=new Tokens("=",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=12;
                    }else if(Letra==","){
                        this.TOK=new Tokens("=",Fila,Columna);//igual
                        Globales.TOKENS.push(this.TOK);
                        this.TOK=new Tokens("",Fila,Columna);//valor
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=9;
                    }else if(Letra==";"){
                        this.TOK=new Tokens("=",Fila,Columna);//igual
                        Globales.TOKENS.push(this.TOK);
                        this.TOK=new Tokens("",Fila,Columna);//valor
                        Globales.TOKENS.push(this.TOK);
                        this.TOK=new Tokens(";",Fila,Columna);//punto y coma
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=0;
                    }
                    break;
                case 12://valor de la variable
                    for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                        if(Texto.charAt(Aux)==","){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=9;
                            Indice=Aux;
                            break;
                        }else if(Texto.charAt(Aux)==";"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            this.TOK=new Tokens(";",Fila,Aux);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=0;
                            Indice=Aux;
                            break;
                        }else if(Texto.charAt(Aux)=="\n"){
                            Token+=Letra;
                            this.ERR=new Error("SINTACTICO",";",Fila,Columna);
                            Estado=400;
                        }
                        else{Token+=Texto.charAt(Aux);}
                    }
                    break;
                case 13://reconocimiento de void
                    if(Letra=="o"){Token+=Letra;}
                    else if(Letra=="i"){Token+=Letra;}
                    else if(Letra=="d"){Token+=Letra;
                        if(Token=="void"){
                            this.TOK=new Tokens(Token,Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Estado=9;
                            Token="";
                            PVoidID=true;
                        }
                        else{
                            this.ERR=new Error("SINTACTICO","void",Fila,Columna);
                            Estado=400;
                        }
                    }else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","void",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 14:
                    PVoidID=false;
                    if(Letra=="("){
                        this.TOK=new Tokens("(",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=15;
                    }
                    else if(Letra==" "|| Letra=="\t"){}
                    else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","(",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 15:
                    if(Letra=="i"){Estado=4;Token=Letra;PVarFun=true;}//Palabras con i
                    else if(Letra=="d"){Estado=5;Token=Letra;PVarFun=true;}//Palabras con d
                    else if(Letra=="c"){Estado=6;Token=Letra;PVarFun=true;}//Palabras con c
                    else if(Letra=="b"){Estado=7;Token=Letra;PVarFun=true;}//Palabras con b
                    else if(Letra=="s"){Estado=8;Token=Letra;PVarFun=true;}//Palabras con s
                    else if(Letra==" "||Letra=="\t"){}
                    else if(Letra==")"){
                        this.TOK=new Tokens(")",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=16;}
                    break;
                case 16://Llaves de funcion
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra=="{"){
                        this.TOK=new Tokens("{",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=0;}
                    else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","{",Fila,Columna);
                        Estado=400;
                        }
                    break;
                case 17:
                    if(Letra=="="){
                        this.TOK=new Tokens(Token,Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Indice--;
                        Estado=18;
                    }else if(Letra==" "||Letra=="\t"){
                        this.TOK=new Tokens(Token,Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        Estado=18;
                    }
                    else{Token+=Letra;}
                    break;
                case 18:
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra=="="){
                        this.TOK=new Tokens("=",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Token="";
                        for(let Aux:number=Indice+1;Aux<Texto.length;Aux++){
                            if(Texto.charAt(Aux)=="\n"){
                                Token+=Letra;
                                this.ERR=new Error("SINTACTICO",";",Fila,Columna);
                                Estado=400;
                                Indice=Aux;                                
                                break;
                            }else if(Texto.charAt(Aux)==";"){
                                this.TOK=new Tokens(Token,Fila,Columna);
                                Globales.TOKENS.push(this.TOK);
                                this.TOK=new Tokens(";",Fila,Columna);
                                Globales.TOKENS.push(this.TOK);
                                Token="";
                                Estado=0;
                                Indice=Aux;
                                break;
                            }else{Token+=Texto.charAt(Aux);}
                        }
                        Estado=0;
                    }
                    break;
                case 19://parentesis con deciciones
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra=="("){
                        this.TOK=new Tokens("(",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);
                        Estado=20;
                        Token="";
                    }
                    else{
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","(",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 20:
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra==")" ||Letra=="!"||Letra=="&"||Letra=="|"||Letra=="<"||Letra==">"||Letra=="="){
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","Operacion Logica",Fila,Columna);
                        Estado=400;
                    }
                    else{Token="";
                        for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                            if(Texto.charAt(Aux)=="\t"||Texto.charAt(Aux)==" "||Texto.charAt(Aux)==">"||Texto.charAt(Aux)=="<"
                            ||Texto.charAt(Aux)=="="||Texto.charAt(Aux)=="!"){
                                Indice=Aux-1;
                                Estado=21;
                                this.TOK=new Tokens(Token,Fila,Columna);
                                Globales.TOKENS.push(this.TOK);
                                Token="";
                                break;
                            }
                            else{Token+=Texto.charAt(Aux);}
                        }
                    }
                    break;
                case 21:
                    try {
                        if(Letra==">" && Texto.charAt(Indice+1)=="="){
                            this.TOK=new Tokens(">=",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);Token="";Estado=22;Indice++;
                        }
                        else if(Letra=="<" && Texto.charAt(Indice+1)=="="){
                            this.TOK=new Tokens("<=",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);Token="";Estado=22;Indice++;
                        }
                        else if(Letra==">"&& Texto.charAt(Indice+1)!="="){
                            this.TOK=new Tokens(">",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);Token="";Estado=22;
                        }
                        else if(Letra=="<"&& Texto.charAt(Indice+1)!="="){
                            this.TOK=new Tokens("<",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);Token="";Estado=22;
                        }
                        else if(Letra=="!" && Texto.charAt(Indice+1)=="="){
                            this.TOK=new Tokens("!=",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);Token="";Estado=22;Indice++;
                        }
                        else if(Letra=="=" && Texto.charAt(Indice+1)=="="){
                            this.TOK=new Tokens("==",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);Token="";Estado=22;Indice++;
                        }else if(Letra==" "||Letra=="\t"){}
                        else{
                            Token+=Letra;
                            this.ERR=new Error("SINTACTICO","Operacion Logica",Fila,Columna);
                            Estado=400;
                        }
                    } catch (error) {
                        Token+=Letra;
                        Indice--;
                        this.ERR=new Error("SINTACTICO","Operacion Logica",Fila,Columna);
                        Estado=400;
                    }
                    break;
                case 22:
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra==")"){
                        Token+=Letra;
                        this.ERR=new Error("SINTACTICO","Operacion Logica",Fila,Columna);
                        Estado=400;
                    }
                    else {
                        Token="";
                        for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                            if(Texto.charAt(Aux)=="\t"||Texto.charAt(Aux)==" "||Texto.charAt(Aux)==")"||Texto.charAt(Aux)=="&"
                            ||Texto.charAt(Aux)=="|"||Texto.charAt(Aux)=="!"){
                                Indice=Aux-1;
                                Estado=23;
                                this.TOK=new Tokens(Token,Fila,Columna);
                                Globales.TOKENS.push(this.TOK);
                                Token="";
                                break;
                            }
                            else{Token+=Texto.charAt(Aux);}
                        }
                    }
                    break;
                case 23:
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra==")"){
                        this.TOK=new Tokens(")",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);Token="";Estado=24;}
                    else if(Letra=="&"&& Texto.charAt(Indice+1)=="&"){
                        this.TOK=new Tokens("&&",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);Token="";Estado=20;Indice++;
                    }
                    else if(Letra=="|"&& Texto.charAt(Indice+1)=="|"){
                        this.TOK=new Tokens("||",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);Token="";Estado=20;Indice++;
                    }
                    else if(Letra=="!"&& Texto.charAt(Indice+1)!="&"&& Texto.charAt(Indice+1)!="|"&& Texto.charAt(Indice+1)!="="){
                        this.TOK=new Tokens("!",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);Token="";Estado=20;
                    }
                    break;
                case 24://Corchete o punto y coma
                    if(Letra==" "||Letra=="\t"){}
                    else if(Letra=="{"){
                        this.TOK=new Tokens("{",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);Token="";Estado=0;
                    }
                    else if(Letra==";"){
                        this.TOK=new Tokens(";",Fila,Columna);
                        Globales.TOKENS.push(this.TOK);Token="";Estado=0;
                    }
                    break;
                case 399://Errores Lexicos
                        for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                            if(Texto.charAt(Aux)==";"||Texto.charAt(Aux)=="\n"||Texto.charAt(Aux)=="\t"||Texto.charAt(Aux)==" "||Aux==Texto.length-1){
                                Token+=Texto.charAt(Aux);
                                this.ERR.Lexema=Token;
                                Globales.ERRORES.push(this.ERR);
                                Token="";
                                Estado=0;
                                Indice=Aux;
                                break;
                            }else{
                                Token+=Texto.charAt(Aux);
                            }
                        }
                        Estado=0;
                    break;
                case 400://estado de error sintactico
                    for(let Aux:number=Indice;Aux<Texto.length;Aux++){
                        if(Texto.charAt(Aux)==";"||Aux==Texto.length-1){
                            Token+=Texto.charAt(Aux);
                            Indice=Aux;
                            this.ERR.Lexema=Token;
                            Globales.ERRORES.push(this.ERR);
                            Token="";
                            Estado=0;
                            this.TOK=new Tokens(";",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            break;
                        }else if(Texto.charAt(Aux)=="}"){
                            Indice=Aux;
                            this.ERR.Lexema=Token;
                            Globales.ERRORES.push(this.ERR);
                            this.TOK=new Tokens("}",Fila,Columna);
                            Globales.TOKENS.push(this.TOK);
                            Token="";
                            Estado=0;
                        }
                        else{Token+=Texto.charAt(Aux);}
                    }
                    Estado=0;
                    break;
            }
        }
        //Imprimir
        this.Imprimir();
    }
    Imprimir(){
        for(let i:number=0;i<Globales.ERRORES.length;i++){
            console.log(Globales.ERRORES[i]);
        }
        for(let i:number=0;i<Globales.TOKENS.length;i++){
            console.log(Globales.TOKENS[i]);
        }
    }
}