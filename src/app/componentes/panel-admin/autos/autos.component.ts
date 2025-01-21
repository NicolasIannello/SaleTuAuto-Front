import { CommonModule } from '@angular/common';
import { afterNextRender, Component, HostListener, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CrearAutoComponent } from './crear-auto/crear-auto.component';
import { VerAutoComponent } from './ver-auto/ver-auto.component';
import { EditarAutoComponent } from './editar-auto/editar-auto.component';
import { ServiciosService } from '../../../servicios/servicios.service';
import { MatSliderModule } from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-autos',
  standalone: true,
  imports: [CommonModule, CrearAutoComponent, VerAutoComponent, FormsModule, EditarAutoComponent, MatSliderModule, MatExpansionModule],
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
  marcas:Array<any>=[""];
  marca:string|undefined='';
  modelos:Array<any>=[""];
  modelo:string|undefined='';
  modeloD:boolean=true;
  versiones:Array<any>=[""];
  version:string|undefined='';
  versionD:boolean=true;
  anos:Array<any>=[""];
  ano:number|undefined=undefined;
  mayorKm:number=1000000000;
  menorKm:number=0;
  mayorR:number|null=null;
  menorR:number|null=null;
  flagSlider:boolean=true;
  mayorP:number=1000000000;
  menorP:number=0;
  mayorRP:number|null=null;
  menorRP:number|null=null;
  flagSliderP:boolean=true;
  ubicacion:string='';
  menuOpen:boolean=false;
  width:number | undefined;
  cap:number = 701;
  injector = inject(Injector);

  constructor(public api:AdminService, public api2:ServiciosService) {}

  ngOnInit(): void {
    afterNextRender(() => this.width=window.innerWidth, {injector: this.injector});
    this.cargarAutos();
    let dato={
      'dato':'marcaAdmin'
    }
    this.api2.datos(dato).subscribe({
      next:(value)=> {
        if(value.ok) {
          this.marcas=value.datos;
        }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
    let dato2={
      'dato':'ano'
    }
    this.api2.datos(dato2).subscribe({
      next:(value)=> {
        if(value.ok) {
          this.anos=value.datos;
        }
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  @HostListener('window:resize', ['$event'])
    onResize(_event: any) {
    this.width=window.innerWidth;
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
    this.api.cargarAutos(this.pagina*20,this.ordenar,this.orden,this.marca,this.modelo,this.version,this.ano,this.menorR,this.mayorR,this.menorRP,this.mayorRP,this.ubicacion).subscribe({
      next:(value)=> {
          if(value.ok) {
            this.Autos=value.autos;
            this.total=value.total;
            this.pagU=Math.ceil(this.total/20)            
            this.mayorKm=value.mayorkm;
            this.menorKm=value.menorkm;
            if(this.flagSlider){
              this.flagSlider=false;
              this.mayorR=value.mayorkm;
              this.menorR=value.menorkm;
            }
            this.mayorP=value.mayorp;
            this.menorP=value.menorp;
            if(this.flagSliderP){
              this.flagSliderP=false;
              this.mayorRP=value.mayorp;
              this.menorRP=value.menorp;
            }
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
        'dato':'modeloAdmin',
        'marca':this.marca
      }
      this.api2.datos(dato).subscribe({
        next:(value)=> {
          if(value.ok) {
            this.modelos=value.datos;
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
        'dato':'version',
        'marca':this.marca,
        'modelo':this.modelo
      }
      this.api2.datos(dato).subscribe({
        next:(value)=> {
          if(value.ok) {
            this.versiones=value.datos;
          }
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
      })
    }
    this.cargarAutos();
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
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

  open(){
    this.menuOpen=!this.menuOpen;
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
