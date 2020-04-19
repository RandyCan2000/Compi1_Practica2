import { Component } from '@angular/core';
import {Globales} from '../Globales';
import {Tokens} from '../TDA/Tokens';
import { Error } from '../TDA/Errores';
import { saveAs } from 'file-saver';
var require: any;
export class Metodos{
    TOKENS:Tokens[]=[];
    ContIdentacion;
    ContIdentacionHTML;
    Traduccion:string;
    Ciclo:string[]=[];
    TraduccionHTML:string;
    TraduccionJSON:string;
    constructor(){
        this.TOKENS=Globales.TOKENS;
        this.ContIdentacion=0;
        this.ContIdentacionHTML=0;
        this.Traduccion="";
        this.TraduccionHTML="";
        this.TraduccionJSON="";
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
            else if(Token=="//"){
                try {
                    this.Traduccion+=this.EI()+"#"+this.TOKENS[Indice+1].Lexema;Indice=Indice+1;
                } catch (error) {}
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
                                    if(Token=="void"&&this.TOKENS[Indice+1].Lexema=="main"&&this.TOKENS[Indice+2].Lexema=="("&&this.TOKENS[Indice+3].Lexema==")"){this.Ciclo.push("main");}
                                    else{this.Ciclo.push(Token.toString());}
                                    Indice=Aux+1;
                                    break;}
                                else{
                                    TP+=this.TOKENS[Aux].Lexema+" ";
                                }
                            }
                        }
                        else if(this.TOKENS[Indice+2].Lexema=="="){//variables
                            const tabla= <HTMLInputElement>document.getElementsByClassName("VARIABLES")[0];
                            const celda2=document.createElement("td");celda2.innerHTML=Token.toString();
                            this.Traduccion+=this.EI()+"var "+this.TOKENS[Indice+1].Lexema+this.TOKENS[Indice+2].Lexema+this.QuitaEspacios(this.TOKENS[Indice+3].Lexema.toString());
                            let Fila=document.createElement("tr");
                            let celda1=document.createElement("td");celda1.innerHTML=this.TOKENS[Indice+1].Lexema.toString();
                            let celda3=document.createElement("td");celda3.innerHTML=this.QuitaEspacios(this.TOKENS[Indice+3].Lexema.toString());
                            Fila.appendChild(celda1);Fila.appendChild(celda2);Fila.appendChild(celda3);
                            tabla.appendChild(Fila);
                            if(this.TOKENS[Indice+4].Lexema==";"){this.Traduccion+="\n";Indice=Indice+4;}
                            else if(this.TOKENS[Indice+4].Lexema==","){
                                for(let Aux:number=Indice+5;Aux<this.TOKENS.length;Aux++){
                                    if(this.TOKENS[Aux].Lexema==";"){this.Traduccion+="\n";Indice=Aux;break;}
                                    else {
                                        if(this.TOKENS[Aux+1].Lexema=="="){
                                            this.Traduccion+=","+this.TOKENS[Aux].Lexema+this.TOKENS[Aux+1].Lexema+this.QuitaEspacios(this.TOKENS[Aux+2].Lexema.toString());
                                            let Fila=document.createElement("tr");
                                            let celda1=document.createElement("td");celda1.innerHTML=this.TOKENS[Aux].Lexema.toString();
                                            let celda2=document.createElement("td");celda2.innerHTML=Token.toString();
                                            let celda3=document.createElement("td");celda3.innerHTML=this.QuitaEspacios(this.TOKENS[Aux+2].Lexema.toString());
                                            Fila.appendChild(celda1);Fila.appendChild(celda2);Fila.appendChild(celda3);
                                            tabla.appendChild(Fila);
                                            Aux=Aux+2;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {}
            }else if(Token=="}"){
                if(this.Ciclo.length!=0){
                    let text=this.Ciclo.pop();
                    if(text=="switch"){
                        this.ContIdentacion--;
                        this.Traduccion+=this.EI()+"}\n";
                    }
                    else if(text=="do"){
                        try {
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
                        } catch (error) {}
                    }
                    else if(text=="if"){
                        try {
                            if(this.TOKENS[Indice+1].Lexema=="else"){
                                if(this.TOKENS[Indice+2].Lexema=="{"){
                                    this.ContIdentacion--;
                                    this.Traduccion+=this.EI()+"else:\n";
                                    Indice=Indice+2;
                                    this.ContIdentacion=this.ContIdentacion+2;
                                }
                                else if(this.TOKENS[Indice+2].Lexema=="if"){
                                    if(this.TOKENS[Indice+3].Lexema=="("){
                                        this.ContIdentacion--;
                                        let TD=this.EI()+"elif";
                                        for(let i:number=Indice+4;i<this.TOKENS.length;i++){
                                            if(this.TOKENS[i].Lexema==")"){
                                                if(this.TOKENS[i+1].Lexema=="{"){
                                                    this.Ciclo.push("if");
                                                    TD+=this.EI()+":\n";this.Traduccion+=TD;
                                                    this.ContIdentacion=this.ContIdentacion+2;
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
                        } catch (error) {}
                    }
                    else if(text=="main"){
                        this.Traduccion+=this.EI()+"if __name__==\"__main__\":\n";
                        this.ContIdentacion++;
                        this.Traduccion+=this.EI()+"main()\n"
                        this.ContIdentacion--;
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
            else if(Token=="Console.Writeline"||Token=="Console.Write"){
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
                                this.HTML_JSON(Text);
                            }
                        }
                    }
                } catch (error) {}
            }else{
                try {
                    if(Token!=";"||Token!="}"||Token!="{"||Token!="("||Token!=")"){
                        if(this.TOKENS[Indice+1].Lexema=="="){
                            if(this.TOKENS[Indice+3].Lexema==";"){
                                this.Traduccion+=this.EI()+Token+"="+this.QuitaEspacios(this.TOKENS[Indice+2].Lexema.toString())+"\n";
                                Indice=Indice+3;
                            }
                        }
                    }
                } catch (error) {}
            }
            //Imprime en consola la traduccion
            if (Indice==this.TOKENS.length-1){
                const Texto= <HTMLInputElement>document.getElementsByClassName("CONSOLA")[0];Texto.value=this.Traduccion.toString();
                const Texto1= <HTMLInputElement>document.getElementsByClassName("HTML")[0];Texto1.value=this.TraduccionHTML;
                const Texto2= <HTMLInputElement>document.getElementsByClassName("JSON")[0];Texto2.value=this.TraduccionJSON;
            }
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
    EIHTML():string{//Espacio Identacion HTML
        let Espacio="";
        for(let Nespacios:number=0;Nespacios<this.ContIdentacionHTML;Nespacios++){
            Espacio+="\t";
        }
        return Espacio;
    }
    HTML_JSON(Texto:string):void{
        let Etiqueta:string="";
        let HTML:string[]=[];
        for(let i:number=0;i<Texto.length;i++){
            let letra:string=Texto.charAt(i);
            if(letra=="<"){
                for(let aux:number=i+1;aux<Texto.length;aux++){
                    if((Texto.charAt(aux)==" "||Texto.charAt(aux)==">")&& Etiqueta!=""){
                        if(Etiqueta=="body"||Etiqueta=="div"){
                            HTML.push(Etiqueta);
                            let style:string="";
                            for(let aux2:number=aux;aux2<Texto.length;aux2++){
                                if(Texto.charAt(aux2)==">"){
                                    HTML.push(style)
                                    aux=aux2;
                                    break;
                                }else{
                                    style+=Texto.charAt(aux2);
                                }
                            }
                        }else if(Etiqueta=="head"||Etiqueta=="br"||Etiqueta=="html"||Etiqueta=="input"||
                        Etiqueta=="/html"||Etiqueta=="/head"||Etiqueta=="/button"||Etiqueta=="/label"||Etiqueta=="/h1"||Etiqueta=="/h2"||
                        Etiqueta=="/h3"||Etiqueta=="/h4"||Etiqueta=="/title"||Etiqueta=="/body"||Etiqueta=="/div"||Etiqueta=="/p"){
                            HTML.push(Etiqueta);
                            for(let aux2:number=aux;aux2<Texto.length;aux2++){
                                if(Texto.charAt(aux2)==">"){
                                    aux=aux2;
                                    break;
                                }
                            }
                        }else if(Etiqueta=="title"||Etiqueta=="p"||Etiqueta=="h1"||Etiqueta=="h2"||Etiqueta=="h3"||Etiqueta=="h4"||
                        Etiqueta=="button"||Etiqueta=="label"){
                            HTML.push(Etiqueta);
                            for(let aux2:number=aux;aux2<Texto.length;aux2++){
                                if(Texto.charAt(aux2)==">"){
                                    let Tex:string="";
                                    for(let aux3:number=aux2+1;aux3<Texto.length;aux3++){
                                        console.log(Tex);
                                        if(Texto.charAt(aux3)=="<" && Texto.charAt(aux3+1)=="/" ){
                                            aux2=aux3-1;
                                            console.log(Tex+"ACEPTA");
                                            HTML.push(Tex);
                                            break;
                                        }
                                        else if(Texto.charAt(aux3)=="<" && Texto.charAt(aux3+1)=="b" && Texto.charAt(aux3+2)=="r" && Texto.charAt(aux3+3)==">"){
                                            aux3=aux3+3;
                                            Tex+="\n";
                                        }
                                        else{Tex+=Texto.charAt(aux3);}
                                    }
                                    aux=aux2;
                                    break;
                                }
                            }
                        }
                        Etiqueta="";
                        i=aux;
                        break;
                    }
                    else{
                        if(Texto.charAt(aux)==" "&& Etiqueta==""){}
                        else{Etiqueta+=Texto.charAt(aux);}
                    }
                }
            }
        }
        //traduccion HTML JSON
        for(let i=0;i<HTML.length;i++){
            let element=HTML[i];
            if(element=="html"){
                this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">\n";
                this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                this.ContIdentacionHTML++;
            }
            else if(element=="head"){
                this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">\n";
                this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                this.ContIdentacionHTML++;
            }
            else if(element=="body"||element=="div"){
                try {
                    let Html="",Json="";
                    Html+=this.EIHTML()+"<"+element.toUpperCase()+" ";
                    Json+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    if(this.QuitaEspacios(HTML[i+1])!="\"\""){
                        Html+=this.QuitaEspacios(HTML[i+1])+">\n";
                        Json+=this.EIHTML()+"\"STYLE\":"+this.QuitaEspacios(HTML[i+1]).split("=")[1]+"\n";
                        this.TraduccionHTML+=Html;
                        this.TraduccionJSON+=Json;
                    }else{
                        Html+=">\n";
                        this.TraduccionHTML+=Html;
                        this.TraduccionJSON+=Json;
                    }
                } catch (error) {}
            }
            else if(element=="title"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/title"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/TITLE"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }} catch (error) {}
            }
            else if(element=="p"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/p"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/P"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }
                    } catch (error) {}
            }
            else if(element=="h1"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/h1"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/H1"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }
                    } catch (error) {}
            }
            else if(element=="h2"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/h2"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/H2"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }
                    } catch (error) {}
            }
            else if(element=="h3"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/h3"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/H3"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }
                    } catch (error) {}
            }
            else if(element=="h4"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/h4"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/H4"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }
                    } catch (error) {}
            }
            else if(element=="button"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/button"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/BUTTON"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }
                    } catch (error) {}
            }
            else if(element=="label"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionHTML+=HTML[i+1];
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\""+HTML[i+1]+"\"\n";
                    this.ContIdentacionHTML--;
                    if(HTML[i+2]=="/label"){
                        this.TraduccionHTML+="<"+HTML[i+2].toUpperCase()+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+2;
                    }else{
                        this.TraduccionHTML+="<"+"/LABEL"+">\n";
                        this.TraduccionJSON+=this.EIHTML()+"}\n";
                        i=i+1;
                    }
                    } catch (error) {}
            }
            else if(element=="br"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\"\\n\"\n";
                    this.ContIdentacionHTML--;
                    this.TraduccionJSON+=this.EIHTML()+"}\n";
                    } catch (error) {}
            }
            else if(element=="/label"||element=="/button"||element=="/h1"||element=="/h2"||element=="/h3"||element=="/h4"||
            element=="/title"||element=="/p"||element=="/head"||element=="/html"||element=="/body"||element=="/div"){
                this.ContIdentacionHTML--;
                this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">\n";
                this.TraduccionJSON+=this.EIHTML()+"}\n";
            }else if(element=="input"){
                try {
                    this.TraduccionHTML+=this.EIHTML()+"<"+element.toUpperCase()+">\n";
                    this.TraduccionJSON+=this.EIHTML()+"\""+element.toUpperCase()+"\":{\n";
                    this.ContIdentacionHTML++;
                    this.TraduccionJSON+=this.EIHTML()+"\"TEXTO\":\"\"\n";
                    this.ContIdentacionHTML--;
                    this.TraduccionJSON+=this.EIHTML()+"}\n";
                    } catch (error) {}
            }
        }
    }

    HTML_ERRORES_TOKENS(){
        const TablaTokens=document.getElementsByClassName("TOKENS")[0];
        const TablaERRORES=document.getElementsByClassName("ERRORES")[0];
        Globales.TOKENS.forEach(element => {
            let Fila=document.createElement("tr");
            let ID=document.createElement("td");
            let Lexema=document.createElement("td");
            let fila=document.createElement("td");
            let columna=document.createElement("td");
            ID.innerHTML=element.Id.toString();
            Lexema.innerHTML=element.Lexema.toString();
            fila.innerHTML=element.Fila.toString();
            columna.innerHTML=element.Columna.toString();
            Fila.appendChild(ID);Fila.appendChild(Lexema);Fila.appendChild(fila);Fila.appendChild(columna);
            TablaTokens.appendChild(Fila);
        });
        Globales.ERRORES.forEach(element => {
            let Fila=document.createElement("tr");
            let ID=document.createElement("td");
            let Lexema=document.createElement("td");
            let fila=document.createElement("td");
            let columna=document.createElement("td");
            let tipo=document.createElement("td");
            let esperado=document.createElement("td");
            ID.innerHTML=element.Id.toString();
            Lexema.innerHTML=element.Lexema.toString();
            tipo.innerHTML=element.Tipo.toString();
            esperado.innerHTML=element.Esperado.toString();
            fila.innerHTML=element.Fila.toString();
            columna.innerHTML=element.Columna.toString();
            Fila.appendChild(ID);Fila.appendChild(Lexema);Fila.appendChild(tipo);Fila.appendChild(esperado);Fila.appendChild(fila);Fila.appendChild(columna);
            TablaERRORES.appendChild(Fila);
        });
    }

    CrearArchivo(Texto:string,Nombre:string){
        try {
          var Archivo:File=new File([Texto],Nombre);
          saveAs(Archivo);
        } catch (error) {
          alert("NO SE GUARDO EL ARCHIVO");
        }
    }

    HTML_Tokens():string{
        let HTML:string="";
        HTML+="<html>\n\t<body >";
        HTML+="<table  border=\"1\" style=\"position: absolute; left: 20%;right:20%; top: 5%;color: black;border-color: black;\">\n";
        HTML+="<tr>\n";
        HTML+="<th> ID </th>\n";
        HTML+="<th> LEXEMA </th>\n";
        HTML+="<th> FILA </th>\n";
        HTML+="<th> COLUMNA </th>\n";
        HTML+="</tr>\n";
        Globales.TOKENS.forEach(element => {
            HTML+="<tr>\n";
            HTML+="<td>"+element.Id+"</td>\n";
            HTML+="<td>"+element.Lexema+"</td>\n";
            HTML+="<td>"+element.Fila+"</td>\n";
            HTML+="<td>"+element.Columna+"</td>\n";
            HTML+="</tr>\n";
        });
        HTML+="</table>";
        HTML+="</html>\n\t</body>";
        return HTML;
    }
    HTML_Errores():string{
        let HTML:string="";
        HTML+="<html>\n\t<body >";
        HTML+="<table  border=\"1\" style=\"position: absolute; left: 5%; top: 5%;color: black;border-color: black;\">\n";
        HTML+="<tr>\n";
        HTML+="<th> ID </th>\n";
        HTML+="<th> LEXEMA </th>\n";
        HTML+="<th> TIPO </th>\n";
        HTML+="<th> ESPERADO </th>\n"; 
        HTML+="<th> FILA </th>\n";
        HTML+="<th> COLUMNA </th>\n";
        HTML+="</tr>\n";
        Globales.ERRORES.forEach(element => {
            HTML+="<tr>\n";
            HTML+="<td>"+element.Id+"</td>\n";
            HTML+="<td>"+element.Lexema+"</td>\n";
            HTML+="<td>"+element.Tipo+"</td>\n";
            HTML+="<td>"+element.Esperado+"</td>\n";
            HTML+="<td>"+element.Fila+"</td>\n";
            HTML+="<td>"+element.Columna+"</td>\n";
            HTML+="</tr>\n";
        });
        HTML+="</table>";
        HTML+="</html>\n\t</body>";
        return HTML;
    }
}
