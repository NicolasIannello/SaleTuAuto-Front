import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactoComponent } from "../contacto/contacto.component";
import { ListaAutosComponent } from "../../autos/lista-autos.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, ListaAutosComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  number:string="+5491127605336";

  constructor(private scroller: ViewportScroller) {}
  
  wspW(){
    window.open('https://wa.me/'+this.number);
  }

  vehiculos(){
    this.scroller.scrollToAnchor('vehiculos');
  }
}
