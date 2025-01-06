import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../servicios/admin.service';

@Component({
  selector: 'app-azul',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './azul.component.html',
  styleUrl: './azul.component.css'
})
export class AzulComponent{
  activa:string='login';
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  menuOpen:boolean=false;
  menuOpen2:boolean=false;
  mail:string="";
  pass:string="";
  type:string="password";
  User:string="";

  constructor(public api: AdminService){ }

  activar(tab:string){
    this.activa=tab;
    this.menuOpen=false;
    this.menuOpen2=false;
  }

  cerrarMenus(){
    this.menuOpen=false;
    this.menuOpen2=false;
  }

  open(){
    this.menuOpen=!this.menuOpen;
    this.menuOpen2=false;
  }
  open2(){
    this.menuOpen=false;
    this.menuOpen2=!this.menuOpen2;
    this.activa= this.menuOpen2? "login" : '';
    this.mail=""; this.pass="";
  }
}
