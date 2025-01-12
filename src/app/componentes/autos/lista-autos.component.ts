import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../servicios/admin.service';
import { ServiciosService } from '../../servicios/servicios.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-autos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-autos.component.html',
  styleUrl: './lista-autos.component.css'
})
export class ListaAutosComponent implements OnInit{
  Autos:Array<any>=[];
  total:number=-1;
  pagina:number=0;
  ordenar:string="_id";
  orden:string="1";
  pagU:number=0;
  marcas:Array<any>=[""];
  marca:string|undefined='';
  modelos:Array<any>=[""];
  modelo:string|undefined='';
  modeloD:boolean=true;
  versiones:Array<any>=[""];
  version:string|undefined='';
  versionD:boolean=true;

  constructor(public api:AdminService, public api2:ServiciosService) {}

  ngOnInit(): void {
    this.cargarAutos();
    this.api2.marcas().subscribe({
      next:(value)=> {
        if(value.ok) {
          this.marcas=value.marcas;
        }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  cargarAutos(){
    this.api.cargarAutos(this.pagina*20,this.ordenar,this.orden,this.marca,this.modelo,this.version).subscribe({
      next:(value)=> {
          if(value.ok) {
            this.Autos=value.autos;
            this.total=value.total;
            this.pagU=Math.ceil(this.total/20)
            for (let i = 0; i < this.total; i++) {
              this.api2.cargarArchivo(this.Autos[i].img.img,'autos').then(resp=>{                
                if(resp!=false){
                  for (let j = 0; j < this.total; j++) {
                    if(resp.url.includes(this.Autos[j].img.img)) this.Autos[j].img.foto=resp.url;
                  }
                }
              })
            }
          }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

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

  getModelos(){
    this.modelo='';
    this.modelos=[""];
    this.version='';
    this.versiones=[""];
    this.versionD=true;
    if(this.marca==""){
      this.modeloD=true;
    }else{
      this.modeloD=false;
      let dato={
        'marca':this.marca
      }
      this.api2.modelos(dato).subscribe({
        next:(value)=> {
          if(value.ok) {
            this.modelos=value.modelos;
          }
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
      })
    }
    this.cargarAutos();
  }

  getVersiones(){
    this.version='';
    this.versiones=[""];
    if(this.modelo==""){
      this.versionD=true;
    }else{
      this.versionD=false;
      let dato={
        'marca':this.marca,
        'modelo':this.modelo
      }
      this.api2.versiones(dato).subscribe({
        next:(value)=> {
          if(value.ok) {
            this.versiones=value.versiones;
          }
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
      })
    }
    this.cargarAutos();
  }
}
