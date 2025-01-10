import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CrearAutoComponent } from './crear-auto/crear-auto.component';
import { VerAutoComponent } from './ver-auto/ver-auto.component';
import { EditarAutoComponent } from './editar-auto/editar-auto.component';
import { ServiciosService } from '../../../servicios/servicios.service';

@Component({
  selector: 'app-autos',
  standalone: true,
  imports: [CommonModule, CrearAutoComponent, VerAutoComponent, FormsModule, EditarAutoComponent],
  templateUrl: './autos.component.html',
  styleUrl: '../usuarios/usuarios.component.css'
})
export class AutosComponent implements OnInit{
  crear:boolean=false;
  ver:boolean=false;
  editar:boolean=false;
  error:boolean=false;
  Autos:Array<any>=[];
  total:number=-1;
  pagina:number=0;
  ordenar:string="_id";
  orden:string="1";
  autoModal:Array<any>=[];
  @ViewChild(VerAutoComponent)verComp!:VerAutoComponent;
  @ViewChild(EditarAutoComponent)editComp!:EditarAutoComponent;
  datoBuscar:string="";
  tipoBuscar:string="marca";
  pagU:number=0;

  constructor(public api:AdminService, public api2:ServiciosService) {}

  ngOnInit(): void {
    this.cargarAutos();
  }

  handleMessage(message: boolean, tipo:string) {    
    switch (tipo) {
      case 'crear': 
        this.crear=message;
        this.error=false;
        this.cargarAutos(); 
      break;
      case 'ver': 
        this.ver=message;
        this.autoModal=[];
      break;
      case 'editar': 
        this.editar=message;
        this.autoModal=[];
        this.cargarAutos(); 
      break;
    }
  }

  cargarAutos(){
    this.api.cargarAutos(this.pagina*20,this.ordenar,this.orden).subscribe({
      next:(value)=> {
          if(value.ok) {
            this.Autos=value.autos;
            this.total=value.total;
            this.pagU=Math.ceil(this.total/20)            
          }else{
            this.error=true;
          }
      },
      error:(err)=> {
        this.error=true;
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  verAuto(id:string,tipo:number){
    if(tipo==1) this.ver=!this.ver;
    if(tipo==2) this.editar=!this.editar;
    this.autoModal=[];
    let datos={
      'uuid':id,
      'token':localStorage.getItem('token'),
      'tipo':1
    }
    this.api2.cargarAuto(datos).subscribe({
      next:(value)=> {
        this.autoModal=value.auto[0];        
        if(tipo==1) this.verComp.cargarImagenes(value.auto[0].img, value.auto[0].pdf);
        if(tipo==2) this.editComp.cargarImagenes(value.auto[0].img, value.auto[0].pdf);
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  eliminar(id:string){
    Swal.fire({
      title: "Esta por borrar un auto",
      text: '¿Desea borrar el auto?',
      showCancelButton: true,
      confirmButtonText: "Borrar",
      confirmButtonColor: "red",
      cancelButtonText: "Atras",
    }).then((result) => {
      if (result.isConfirmed) {
        let dato={
          "_id":id,
          "token":localStorage.getItem('token'),
          "tipo":1,
        }        
        this.api.borrarAuto(dato).subscribe({
          next:(value)=> {
            if(value.ok) Swal.fire({title:'Auto eliminado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
            this.cargarAutos();
          },
          error:(err)=> {
            Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          },
        })
      }
    });
  }

  // buscarDato(){
  //   let dato={
  //     'token':localStorage.getItem('token'),
  //     'tipo':1,
  //     'dato':this.datoBuscar,
  //     'datoTipo':this.tipoBuscar,
  //     'datoTipoUser':'auto',
  //     //ver de meter orden ordenar
  //   }

  //   // this.api.buscarDato(dato).subscribe({
  //   //   next:(value)=> {
  //   //       if(value.ok){
  //   //         if(value.busqueda.length>0) {
  //   //           this.Autos=value.busqueda
  //   //         }else{
  //   //           Swal.fire({title:'No se encontro ningun resultado', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
  //   //         }
  //   //       }else{
  //   //         Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
  //   //       }
  //   //   },
  //   //   error:(err)=> {
  //   //     Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
  //   //   },
  //   // })
  // }

  principio(){
    this.pagina=0;
    this.cargarAutos()
  }
  atras(){
    if(this.pagina>0){
      this.pagina--;
      this.cargarAutos()
    }
  }
  siguiente(){    
    if(this.pagina<this.pagU-1){
      this.pagina++;
      this.cargarAutos()
    }
  }
  final(){
    this.pagina=this.pagU>0 ? this.pagU-1 : 0;
    this.cargarAutos()
  }

  // duplicar(id:string,nom:string){
  //   Swal.fire({
  //     title: "Esta por duplicar un auto",
  //     text: '¿Desea duplicar el auto: "'+nom+'"?',
  //     showCancelButton: true,
  //     confirmButtonText: "Duplicar",
  //     confirmButtonColor: '#ff9000',
  //     cancelButtonText: "Atras",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       let dato={
  //         "id":id,
  //         "token":localStorage.getItem('token'),
  //         "tipo":1,
  //       }
  //       this.api.duplicarAuto(dato).subscribe({
  //         next:(value)=> {
  //           if(value.ok) Swal.fire({title:'Auto duplicado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
  //           if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
  //           this.cargarAutos();
  //         },
  //         error:(err)=> {
  //           Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
  //         },
  //       })
  //     }
  //   });
  // }
}
