import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../../servicios/servicios.service';
import Swal from 'sweetalert2';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule, ViewportScroller } from '@angular/common';
import { VerImagenComponent } from '../../ver-imagen/ver-imagen.component';
import { ContactoComponent } from "../../landing/contacto/contacto.component";
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';

const numero=environment.numero;
type LoginFormResult = {
  nomapel: string
  telefono: string
};

@Component({
  selector: 'app-auto',
  standalone: true,
  imports: [FormsModule, RecaptchaV3Module, CommonModule, VerImagenComponent, ContactoComponent],
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
  intImg:number=0;
  flag:boolean=false;

  constructor(public ruta:ActivatedRoute, public api:ServiciosService, private viewportScroller: ViewportScroller, private recaptchaV3Service: ReCaptchaV3Service) {}

  ngOnInit(): void {    
    this.viewportScroller.scrollToPosition([0, 0]);
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

  sigImg(i:number){
    if(this.intImg+i<0 || this.intImg+i>=this.imagenes.length) return;
    this.intImg = this.intImg+i;
    this.imagen=this.imagenes[this.intImg];
  }

  wspW(){
      let nomapelInput: HTMLInputElement
      let telefonoInput: HTMLInputElement
    
      Swal.fire<LoginFormResult>({
        title: 'Datos de contacto',
        html: `
          <input type="text" id="nomapel" class="swal2-input" placeholder="Nombre y apellido">
          <input type="text" id="telefono" class="swal2-input" placeholder="Telefono">
        `,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        focusConfirm: false,
        didOpen: () => {
          const popup = Swal.getPopup()!
          nomapelInput = popup.querySelector('#nomapel') as HTMLInputElement
          telefonoInput = popup.querySelector('#telefono') as HTMLInputElement
          nomapelInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
          telefonoInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
        },
        preConfirm: () => {
          const nomapel = nomapelInput.value
          const telefono = telefonoInput.value
          if (!nomapel || !telefono) {
            Swal.showValidationMessage(`Complete los campos`)
          }else{
            this.flag=true;
            let hoy=new Date();
            let mes = hoy.getMonth()>8 ? (hoy.getMonth()+1) : "0"+(hoy.getMonth()+1);
            let dia = hoy.getDate()>9 ? hoy.getDate() : "0"+hoy.getDate()
            let fecha = dia+"-"+mes+"-"+hoy.getFullYear();
            let dato = {
              'nomapel': nomapel,
              'telefono' : telefono,
              'fecha' : fecha,
              'auto' : this.Auto['marca']+' '+this.Auto['modelo']+' '+this.Auto['version'],
              'link' : window.location.href
            }
            this.api.contacto(dato).subscribe({
              next:(value) => {
                this.flag=false;
                // if(value.ok) window.open('https://wa.me/'+numero);
                // if(!value.ok) Swal.fire({title: value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
              },
              error:(err) => {
                this.flag=false;     
                Swal.fire({title: err.error.errors.telefono.msg ? err.error.errors.telefono.msg : 'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
              },
            })
            window.open('https://wa.me/'+numero);
          }        
        },
      })
    }
  
    public send(form: NgForm): void {
      if (form.invalid) {
        for (const control of Object.keys(form.controls)) {
          form.controls[control].markAsTouched();
        }
        return;
      }
  
      this.recaptchaV3Service.execute('importantAction').subscribe(
        (token)=> {
          this.wspW();
        },
        (error)=> {
        },
      );
    }
}
