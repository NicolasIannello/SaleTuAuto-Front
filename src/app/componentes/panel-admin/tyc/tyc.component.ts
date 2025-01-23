import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tyc',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tyc.component.html',
  styleUrl: '../usuarios/usuarios.component.css',
  encapsulation: ViewEncapsulation.None
})
export class TycComponent implements OnInit{
  tyc:string='';

  constructor(public api:AdminService) {}

  ngOnInit(): void {
    this.api.cargarTyc().subscribe({
      next:(value)=> {
          this.tyc=value.tyc
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});            
      },
    })
  }

  actualizarTyc(){
    let dato={
      "token":localStorage.getItem('token'),
      "tipo":1,
      "tyc": this.tyc
    }    
    this.api.editarTyc(dato).subscribe({
      next:(value)=> {
        if(value.ok) Swal.fire({title:'Terminos y condiciones actualizados con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }
}
