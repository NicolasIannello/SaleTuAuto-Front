import { AfterViewInit, Component, Input } from '@angular/core';
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
export class AzulComponent implements AfterViewInit{
  activa:string='login';
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;
  menuOpen:boolean=false;
  menuOpen2:boolean=false;
  autos:boolean=false;
  users:boolean=false;

  constructor(public api: AdminService){ }

  ngAfterViewInit(): void {
    this.check();
  }

  check(){
    if(localStorage.getItem('token')){
      let dato={
        'token': localStorage.getItem('token'),
        'tipo': 1
      }
      this.api.checkTokenA(dato).subscribe({
        next: (value:any) => {
          if (value.ok) {
            this.users=value.users;
            this.autos=value.autos
          }
        },
        error(err:any) {
          localStorage.removeItem('token')
        },		
      });
    }
  }

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
  }
}
