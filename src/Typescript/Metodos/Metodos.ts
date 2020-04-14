import { Component } from '@angular/core';
import {Globales} from '../Globales';
import {Tokens} from '../TDA/Tokens';
import { Error } from '../TDA/Errores';
export class Metodos{
    
    TOKENS:Tokens[]=[];
    ContIdentacion;
    Traduccion:string;
    Ciclo:string[]=[];
    constructor(){
        this.TOKENS=Globales.TOKENS;
        this.ContIdentacion=0;
        this.Traduccion="";
    }

    Traducir(Viene:string,Ind:number){//varible Viene indica que sentencia es: if, switch, etc.
        for(let Indice:number=Ind;Indice<this.TOKENS.length;Indice++){
            let Token:String=this.TOKENS[Indice].Lexema;
            console.log(Token);
            if(Token=="/*"){
                this.Traduccion+=this.EI()+"'''"+this.TOKENS[Indice+1].Lexema;
                try {
                    if(this.TOKENS[Indice+2].Lexema=="*/"){this.Traduccion+="'''"+"\n";Indice=Indice+2;}
                    else{this.Traduccion+="'''"+"\n";Indice=Indice+1;}} catch (error) {}
            }
            else if(Token=="string" || Token=="int"||Token=="double"||Token=="char"||Token=="bool"||Token=="void"){
                try {
                    if(this.TOKENS[Indice+1].Lexema!=";"){
                        if(this.TOKENS[Indice+2].Lexema=="("){//funciones
                            let TP:string=this.EI()+"def "+this.TOKENS[Indice+1].Lexema+" "+this.TOKENS[Indice+2].Lexema;
                            for(let Aux:number=Indice+3;Aux<this.TOKENS.length;Aux++){
                                if(this.TOKENS[Aux].Lexema==";"){Indice=Aux;break;}
                                else if(this.TOKENS[Aux].Lexema=="{"){Indice=Aux;break;}
                                else if(this.TOKENS[Aux].Lexema=="("){Indice=Aux;break;}
                                else if(this.TOKENS[Aux].Lexema==")"){
                                    TP+=this.TOKENS[Aux].Lexema+":\n";
                                    this.Traduccion+=TP;
                                    this.ContIdentacion++;
                                    this.Ciclo.push(Token.toString());
                                    Indice=Aux+1;
                                    break;}
                                else{
                                    TP+=this.TOKENS[Aux].Lexema+" ";
                                }
                            }
                        }
                        else if(this.TOKENS[Indice+2].Lexema=="="){//variables
                            this.Traduccion+=this.EI()+"var "+this.TOKENS[Indice+1].Lexema+this.TOKENS[Indice+2].Lexema+this.QuitaEspacios(this.TOKENS[Indice+3].Lexema.toString());
                            if(this.TOKENS[Indice+4].Lexema==";"){this.Traduccion+="\n";}
                            else if(this.TOKENS[Indice+4].Lexema==","){
                                for(let Aux:number=Indice+5;Aux<this.TOKENS.length;Aux++){
                                    if(this.TOKENS[Aux].Lexema==";"){this.Traduccion+="\n";Indice=Aux;break;}
                                    else {
                                        if(this.TOKENS[Aux+1].Lexema=="="){
                                            this.Traduccion+=","+this.TOKENS[Aux].Lexema+this.TOKENS[Aux+1].Lexema+this.QuitaEspacios(this.TOKENS[Aux+2].Lexema.toString());
                                            Aux=Aux+2;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {}
            }else if(Token=="}"){
                if(this.Ciclo.length!=0){let text=this.Ciclo.pop();
                    if(text=="switch"){
                        this.ContIdentacion--;
                        this.Traduccion+=this.EI()+"}\n";
                    }
                    else if(text=="do"){
                        if(this.TOKENS[Indice+1].Lexema=="while"){
                            if(this.TOKENS[Indice+2].Lexema=="("){
                                let TD=this.EI()+"if";
                                for(let i:number=Indice+3;i<this.TOKENS.length;i++){
                                    if(this.TOKENS[i].Lexema==")"){
                                        if(this.TOKENS[i+1].Lexema==";"){
                                            TD+=":\n"+this.EI()+" break";this.Traduccion+=TD;
                                            Indice=i+1;break;
                                        }
                                    }else if(this.TOKENS[i].Lexema=="{"||this.TOKENS[i].Lexema==";"){
                                        Indice=i;
                                    }else{
                                        if(this.TOKENS[i].Lexema=="&&"){TD+=" "+"and";}
                                        else if(this.TOKENS[i].Lexema=="||"){TD+=" "+"or";}
                                        else if(this.TOKENS[i].Lexema=="!"){TD+=" "+"not";}
                                        else{TD+=" "+this.QuitaEspacios(this.TOKENS[i].Lexema.toString());
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.ContIdentacion--;
                }
            }else if(Token=="return"){
                try {
                    let Ciclo;
                    let perm=false;
                    for(let i:number=this.Ciclo.length-1;i>=0;i--){Ciclo=this.Ciclo[i]; 
                        if(Ciclo=="void"||Ciclo=="string"||Ciclo=="int"||Ciclo=="bool"||Ciclo=="double"||Ciclo=="char"){perm=true;break;}
                    }
                    try {
                        if(this.TOKENS[Indice+1].Lexema!=";" && perm==true){
                            if(Ciclo=="void"){
                                if(this.TOKENS[Indice+2].Lexema==";"){this.Traduccion+=this.EI()+Token+"\n";Indice=Indice+2;}
                            }
                            else{
                                if(this.TOKENS[Indice+2].Lexema==";"){
                                    this.Traduccion+=this.EI()+Token+" "+this.QuitaEspacios(this.TOKENS[Indice+1].Lexema.toString())+"\n";Indice=Indice+2;}
                            }
                        }
                    } catch (error) {}
                } catch (error) {}
            }else if(Token=="continue"){
                try {
                    let Ciclo;
                    let perm=false;
                    for(let i:number=this.Ciclo.length-1;i>=0;i--){Ciclo=this.Ciclo[i]; 
                        if(Ciclo=="for"||Ciclo=="while"||Ciclo=="do"){perm=true;break;}
                    }
                    try {
                        if(this.TOKENS[Indice+1].Lexema==";" && perm==true){
                            this.Traduccion+=this.EI()+Token+" "+this.QuitaEspacios(this.TOKENS[Indice+1].Lexema.toString())+"\n";Indice=Indice+2;  
                        }
                    } catch (error) {}
                } catch (error) {}
            }else if(Token=="break"){
                let Ciclo;
                let perm=false;
                for(let i:number=this.Ciclo.length-1;i>=0;i--){Ciclo=this.Ciclo[i]; 
                    if(Ciclo=="for"||Ciclo=="while"||Ciclo=="do"||Ciclo=="case"){perm=true;break;}
                }
                try {
                    if(this.TOKENS[Indice+1].Lexema==";" && perm==true && Ciclo!="case"){
                        this.Traduccion+=this.EI()+Token+"\n";
                        Indice=Indice+1;this.Ciclo.pop();
                    }else if(this.TOKENS[Indice+1].Lexema==";" && perm==true && Ciclo=="case"){
                        Indice=Indice+1;this.ContIdentacion--;this.Ciclo.pop();
                    }
                } catch (error) {}
            }
            else if(Token=="for"){//for ( int a = 0; a < 15 ; a ++){
                try {
                    if(this.TOKENS[Indice+1].Lexema=="("){
                        if(this.TOKENS[Indice+2].Lexema=="int"){
                            if(this.TOKENS[Indice+4].Lexema=="="){
                                if(this.TOKENS[Indice+6].Lexema==";"){
                                    if(this.TOKENS[Indice+10].Lexema==";"){
                                        if(this.TOKENS[Indice+12].Lexema=="++"||this.TOKENS[Indice+12].Lexema=="--"){
                                            if(this.TOKENS[Indice+13].Lexema==")"){
                                                if(this.TOKENS[Indice+14].Lexema=="{"){
                                                    this.Traduccion+=this.EI()+Token+" "+this.TOKENS[Indice+3].Lexema+" in range"+"("+this.TOKENS[Indice+5].Lexema+","+this.TOKENS[Indice+9].Lexema+"):\n";
                                                    this.Ciclo.push(Token.toString());
                                                    this.ContIdentacion++;
                                                    Indice=Indice+14;
                                                }
                                            }
                                        }
                                    }
                                }  
                            }
                        }
                    }
                } catch (error) {}
            }
            else if(Token=="switch"){
                try {
                    if(this.TOKENS[Indice+1].Lexema=="("){
                        if(this.TOKENS[Indice+3].Lexema==")"){
                            if(this.TOKENS[Indice+4].Lexema=="{"){
                                this.Traduccion+=this.EI()+"def switch("+this.QuitaEspacios(this.TOKENS[Indice+2].Lexema.toString())+"):\n";
                                this.ContIdentacion++;
                                this.Traduccion+=this.EI()+"switcher={\n";
                                this.Ciclo.push(Token.toString());
                                this.ContIdentacion++;Indice=Indice+4;
                            }
                        }
                    }
                } catch (error) {}
            }
            else if(Token=="case"){
                try {
                    if(this.TOKENS[Indice+2].Lexema==":"){
                        this.Traduccion+=this.EI()+this.QuitaEspacios(this.TOKENS[Indice+1].Lexema.toString())+":\n";
                        this.Ciclo.push(Token.toString());
                        this.ContIdentacion++;Indice=Indice+2;
                    }
                } catch (error) {}
            }
            else if(Token=="default"){
                try {
                    if(this.TOKENS[Indice+2].Lexema==":"){
                        this.Traduccion+=this.EI()+this.QuitaEspacios(this.TOKENS[Indice+1].Lexema.toString())+":\n";
                        this.Ciclo.push("case");
                        this.ContIdentacion++;Indice=Indice+2;
                    }
                } catch (error) {}
            }
            else if(Token=="while"){
                try {
                    let TD=this.EI()+"while";
                    if(this.TOKENS[Indice+1].Lexema=="("){
                        for(let i:number=Indice+2;i<this.TOKENS.length;i++){
                            if(this.TOKENS[i].Lexema==")"){
                                TD+=":\n";this.Traduccion+=TD;this.ContIdentacion++;this.Ciclo.push(Token.toString());
                                Indice=i;break;
                            }else if(this.TOKENS[i].Lexema=="{"||this.TOKENS[i].Lexema==";"){
                                Indice=i;
                            }else{
                                if(this.TOKENS[i].Lexema=="&&"){TD+=" "+"and";}
                                else if(this.TOKENS[i].Lexema=="||"){TD+=" "+"or";}
                                else if(this.TOKENS[i].Lexema=="!"){TD+=" "+"not";}
                                else{TD+=" "+this.QuitaEspacios(this.TOKENS[i].Lexema.toString());
                                }
                            }
                        }
                    }
                } catch (error) {}
            }
            else if(Token=="do"){
                try {
                    if(this.TOKENS[Indice+1].Lexema=="{"){
                        this.Traduccion+=this.EI()+"while true:\n";
                        this.Ciclo.push(Token.toString());
                        Indice=Indice+1;this.ContIdentacion++;
                    }
                } catch (error) {}
            }
            else if(Token=="if"){
                try {
                    if(this.TOKENS[Indice+1].Lexema=="("){
                        let TD=this.EI()+"if";
                        for(let i:number=Indice+2;i<this.TOKENS.length;i++){
                            if(this.TOKENS[i].Lexema==")"){
                                TD+=":\n";this.Traduccion+=TD;this.ContIdentacion++;this.Ciclo.push(Token.toString());
                                Indice=i;break;
                            }else if(this.TOKENS[i].Lexema=="{"||this.TOKENS[i].Lexema==";"){
                                Indice=i;
                            }else{
                                if(this.TOKENS[i].Lexema=="&&"){TD+=" "+"and";}
                                else if(this.TOKENS[i].Lexema=="||"){TD+=" "+"or";}
                                else if(this.TOKENS[i].Lexema=="!"){TD+=" "+"not";}
                                else{TD+=" "+this.QuitaEspacios(this.TOKENS[i].Lexema.toString());
                                }
                            }
                        }
                    }
                } catch (error) {
                    
                }
            }
            else if(Token=="Console.writeline"||Token=="Console.write"){
                try {
                    if(this.TOKENS[Indice+1].Lexema=="("){
                        if(this.TOKENS[Indice+3].Lexema==")"){
                            let Texto=this.TOKENS[Indice+2].Lexema;
                            let Text:string="";
                            let Permiso:boolean=false;
                            for(let Indice:number=0;Indice<Texto.length;Indice++){
                                if(Texto.charAt(Indice)=="\"" && Permiso==false){Text+=Texto.charAt(Indice);Permiso=true;}
                                else if(Texto.charAt(Indice)=="\"" && Permiso==true){Text+=Texto.charAt(Indice);Permiso=false;}
                                else if(Texto.charAt(Indice)==" " && Permiso==true){Text+=Texto.charAt(Indice);}
                                else if(Texto.charAt(Indice)==" " && Permiso==false){}
                                else{
                                    if(Texto.charAt(Indice)=="+" && Permiso==false){Text+=",";}
                                    else{Text+=Texto.charAt(Indice);}
                                }
                            }
                            if(Text==""){Text="\"\"";}
                            if(this.TOKENS[Indice+4].Lexema==";"){
                                this.Traduccion+=this.EI()+"print("+Text+")\n";
                                Indice=Indice+4;
                            }
                        }
                    }
                } catch (error) {}
            }
            //Imprime en consola la traduccion
            if (Indice==this.TOKENS.length-1){const Texto= <HTMLInputElement>document.getElementsByClassName("CONSOLA")[0];Texto.value=this.Traduccion.toString();}
        }
    }

    QuitaEspacios(Texto:string):string{//quita los esoacios vacios fuera de comillas
        let Text:string="";
        let Permiso:boolean=false;
        for(let Indice:number=0;Indice<Texto.length;Indice++){
            if(Texto.charAt(Indice)=="\"" && Permiso==false){Text+=Texto.charAt(Indice);Permiso=true;}
            else if(Texto.charAt(Indice)=="\"" && Permiso==true){Text+=Texto.charAt(Indice);Permiso=false;}
            else if(Texto.charAt(Indice)==" " && Permiso==true){Text+=Texto.charAt(Indice);}
            else if(Texto.charAt(Indice)==" " && Permiso==false){}
            else{Text+=Texto.charAt(Indice);}
        }
        if(Text==""){return "\"\"";}
        else{return Text;}
    }
    EI():string{//Espacio Identacion
        let Espacio="";
        for(let Nespacios:number=0;Nespacios<this.ContIdentacion;Nespacios++){
            Espacio+=" ";
        }
        return Espacio;
    }
}