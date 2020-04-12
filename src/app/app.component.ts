import { Component } from '@angular/core';
import {Globales} from '../Typescript/Globales';
import {Automata} from '../Typescript/Metodos/Automata';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  AU:Automata=new Automata();
  constructor(){}

    leerArchivo(Direccion:FileList) {
      let file:File;
      file=Direccion[0];  
      var reader = new FileReader();
        reader.onload = function (e) {
            let div = document.createElement("div");
            let CajaTexto = document.createElement("textarea");
            let Titulo = document.createElement("button");
            CajaTexto.setAttribute("rows", "25");
            CajaTexto.setAttribute("cols", "100");
            CajaTexto.style.position = "absolute";
            CajaTexto.setAttribute("id", Globales.ContadorPestania + ":" + file.name);
            CajaTexto.style.zIndex = Globales.ContadorCapaz.toString();
            Globales.ContadorCapaz++;
            CajaTexto.style.resize = "none";
            CajaTexto.style.overflow = "scroll";
            CajaTexto.textContent = e.target.result.toString(); //recupera el texto del archivo
            CajaTexto.setAttribute("class", "CajaTexto");
            Titulo.innerHTML = Globales.ContadorPestania + ":" + file.name;
            Globales.Seleccionado = Globales.ContadorPestania + ":" + file.name;
            document.getElementById("NombreSeleccion").innerHTML = Globales.ContadorPestania + ":" + file.name;
            Titulo.setAttribute("id", "Boton");
            Titulo.style.outline = "none";
            Titulo.onclick = function () {
              Globales.Seleccionado = Titulo.innerHTML;
              document.getElementById("NombreSeleccion").innerHTML = Titulo.innerHTML;
              document.getElementById(Titulo.innerHTML).style.zIndex = Globales.ContadorCapaz.toString();
              Globales.ContadorCapaz++;
              //tab 
              var el = <HTMLInputElement>document.getElementById(Titulo.innerHTML);
              el.onkeydown = function(e) {
              if (e.keyCode === 9) {
                  var val = el.value,start = el.selectionStart,end = el.selectionEnd;
                  el.value = val.substring(0, start) + '\t' + val.substring(end);
                  el.selectionStart = el.selectionEnd = start + 1;
              return false;}};
              //fin tab
            };

            document.getElementById("Botones").appendChild(Titulo);
            div.appendChild(CajaTexto);
            div.style.marginLeft = "20%";
            document.getElementById("CajasTexto").appendChild(div);
            Globales.ContadorPestania++;
            //tab 
            var el = <HTMLInputElement>document.getElementById(Titulo.innerHTML);
            el.onkeydown = function(e) {
            if (e.keyCode === 9) {
                var val = el.value,start = el.selectionStart,end = el.selectionEnd;
                el.value = val.substring(0, start) + '\t' + val.substring(end);
                el.selectionStart = el.selectionEnd = start + 1;
            return false;}};
            //fin tab
        };
        reader.readAsText(file);
    }

    Analizar() {
      if(Globales.Seleccionado.toString()==""){
        alert("NO HAY NADA QUE ANALIZAR");
      }else{
        const Texto= <HTMLInputElement>document.getElementById(Globales.Seleccionado.toString());
      this.AU.AnalisisLexico(Texto.value);
      }
    }
    MostarRep(Rep:String){
      if(Rep=="CONSOLA"){
        document.getElementById(Rep.toString()).style.zIndex = Globales.ContadorCapazRep.toString();
        Globales.ContadorCapazRep++;
      }else if(Rep=="JSON"){
        document.getElementById(Rep.toString()).style.zIndex = Globales.ContadorCapazRep.toString();
        Globales.ContadorCapazRep++;
      }
      else if(Rep=="HTML"){
        document.getElementById(Rep.toString()).style.zIndex = Globales.ContadorCapazRep.toString();
        Globales.ContadorCapazRep++;
      }
      else if(Rep=="VARIABLES"){
        document.getElementById(Rep.toString()).style.zIndex = Globales.ContadorCapazRep.toString();
        Globales.ContadorCapazRep++;
      }
    }
}
