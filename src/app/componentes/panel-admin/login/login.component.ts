import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit{
  alertas:Array<string>=['',''];
  campos:Array<string>=['',''];
  type:string='password';
  User:string="";

  constructor(public api:AdminService){}

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      let dato={
        'token': localStorage.getItem('token'),
        'tipo': 1
      }
      this.api.checkTokenA(dato).subscribe({
        next: (value:any) => {
          if (value.ok) {
            localStorage.setItem('token',value.token);
            this.User=value.user;
            //this.api.setUserAdmin(this.User);
          }else{
            localStorage.removeItem('token')
          }
        },
        error(err:any) {
          localStorage.removeItem('token')
        },		
      });
    }
  }

  ingresar(){    
    this.alertas[0] = this.campos[0]=="" ? "El campo es obligatorio" : "";
    this.alertas[1] = this.campos[1]=="" ? "El campo es obligatorio" : "";

    let datos={
      'user': this.campos[0],
      'pass': this.campos[1],
    }
    if(this.campos[0]!='' && this.campos[1]!=''){
      this.api.loginA(datos).subscribe({
        next: (value)=>{
          if(value.ok){
            localStorage.setItem('token',value.token)
            this.User=value.user
            //this.api.setUserAdmin(this.User);
          }
          if(!value.ok){
            localStorage.removeItem('token')
            Swal.fire({title:'Datos incorrectos', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          }
        },
        error: (err)=>{
          localStorage.removeItem('token')
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        }
      })
    }
  }

  mostrar(){
    this.type = this.type=="password" ? "text" : "password";
  }
  logout(){
    localStorage.removeItem('token');
    window.location.reload();
  }
}
