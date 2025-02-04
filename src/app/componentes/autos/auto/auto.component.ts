import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../../servicios/servicios.service';
import Swal from 'sweetalert2';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';

@Component({
  selector: 'app-auto',
  standalone: true,
  imports: [CommonModule, VerImagenComponent],
  templateUrl: './auto.component.html',
  styleUrl: '../lista-autos.component.css'
})
export class AutoComponent implements OnInit {
  Auto:{[key: string]: any}={imgs:[]};
  imagenes: Array<{link:SafeResourceUrl,id:number,name:string}> = [];
  verImg:boolean=false;
  imgID:number=-1;
  imagen:{link:SafeResourceUrl,id:number,name:string}={link:'',id:0,name:''};
  infoBasica:Array<any>=[['cilindros','Cilindros'],['caballos','Caballos de Fuerza'],['peso_bruto_kg','Peso bruto (kg)'],['combined_km','Combined (km)'],['combined_l_100','Combined (l / 100km)'],['numero_velocidades','Número de Velocidades'],['aceleración_0_100','Aceleración Estimada 0-100 km/h'],['litros','Litros'],['motor','Tipo de motor'],['combustible','Tipo de Combustible']];
  infoBasicaFlag:Boolean=false;
  exterior:Array<any>=[['puertas','Número de Puertas'],['rin_dia','Diámetro de Llanta'],['rin','Tipo de Llanta'],['carroceria','Tipo de Carrocería'],['luz_baja','Tipo de bulbo luz baja']];
  exteriorFlag:Boolean=false;
  comfort:Array<any>=[['gps','GPS'],['aire_acondicionado','Aire acondicionado'],['sensor_distancia','Sensor de distancia'],['asistencia_estacionamiento','Asistencia de estacionamiento']];
  comfortFlag:Boolean=false;
  seguridad:Array<any>=[['airbags','Número total de Airbags'],['sensor_lluvia','Sensor de lluvia'],['bolsas_frontales','Bolsas de Aire Frontales'],['discos_freno','Cantidad de discos de freno'],['freno_abs','Tipo Frenos ABS']];
  seguridadFlag:Boolean=false;
  interior:Array<any>=[['pasajeros','Número de Pasajeros'],['asientos','Material Asientos']];
  interiorFlag:Boolean=false;
  entretenimiento:Array<any>=[['bluetooth','Bluetooth'],['radio','Radio'],['android_auto','Android auto']];
  entretenimientoFlag:Boolean=false;

  constructor(public ruta:ActivatedRoute, public api:ServiciosService) {}

  ngOnInit(): void {    
    let datos={
      'uuid': this.ruta.snapshot.paramMap.get('uuid'),
    }
    this.api.cargarAuto(datos).subscribe({
      next:(value)=> {
        this.Auto=value.auto[0];

        for (let i = 0; i < this.infoBasica.length; i++) {
          if(this.Auto[this.infoBasica[i][0]]) this.infoBasicaFlag=true;
        }
        for (let i = 0; i < this.exterior.length; i++) {
          if(this.Auto[this.exterior[i][0]]) this.exteriorFlag=true;
        }
        for (let i = 0; i < this.comfort.length; i++) {
          if(this.Auto[this.comfort[i][0]]) this.comfortFlag=true;
        }
        for (let i = 0; i < this.seguridad.length; i++) {
          if(this.Auto[this.seguridad[i][0]]) this.seguridadFlag=true;
        }
        for (let i = 0; i < this.interior.length; i++) {
          if(this.Auto[this.interior[i][0]]) this.interiorFlag=true;
        }
        for (let i = 0; i < this.entretenimiento.length; i++) {
          if(this.Auto[this.entretenimiento[i][0]]) this.entretenimientoFlag=true;
        }

        for (let i = 1; i < this.Auto['img'].length+1; i++) {      
          this.imagenes.push({link:'', id:i,name:''});
        }
        for (let i = 0; i < this.Auto['img'].length; i++) {      
          this.api.cargarArchivo(this.Auto['img'][i].img,'autos').then(resp=>{						
            if(resp!=false){
              this.imagenes[this.Auto['img'][i].orden-1]={link:resp.url, id:(this.Auto['img'][i].orden), name:this.Auto['img'][i].img};
              this.imagen=this.imagenes[0];
            }
          })      
        }   
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      },
    })
  }

  handleMessage(message: boolean, tipo:string) {    
    this.verImg=message;
  }

  verImagen(id:number){
    this.verImg=true;
    this.imgID=(id-1);    
  }
}
