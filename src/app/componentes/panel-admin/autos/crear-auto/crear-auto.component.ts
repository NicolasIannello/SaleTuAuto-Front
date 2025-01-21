import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminService } from '../../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { ServiciosService } from '../../../../servicios/servicios.service';

@Component({
  selector: 'app-crear-auto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-auto.component.html',
  styleUrl: '../../usuarios/usuarios.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CrearAutoComponent implements OnInit{
  datos:Array<any>=     ['','','','','','','','',''];
  alertas:Array<string>=['','','','','','','','','',''];
  //extras:Array<any>=    ['','','','','','','','','','','','','','','','','','','','','','','','','','',''];
  extras:{[key: string]: any}={ 
    cilindros: '',
    caballos: '',
    peso_bruto_kg: '',
    combined_km: '',
    combined_l_100: '',
    numero_velocidades: '',
    aceleración_0_100: '',
    litros: '',
    motor: '',
    combustible: '',

    puertas: '',
    rin_dia: '',
    rin: '',
    carroceria: '',
    luz_baja: '',

    gps: '',
    aire_acondicionado: '',
    sensor_distancia: '',
    asistencia_estacionamiento: '',

    airbags: '',
    sensor_lluvia: '',
    bolsas_frontales: '',
    discos_freno: '',
    freno_abs: '',

    pasajeros: '',
    asientos: '',

    bluetooth: '',
    radio: '',
    android_auto: '' 
  };
  fotos: any = [];
  sources: Array<any> = [];
  // pdf:SafeResourceUrl|null=null;
  @Output() messageEvent = new EventEmitter<boolean>();
  @ViewChild('imagen') inputImagen!: ElementRef;
  // @ViewChild('pdfTC') inputPDF!: ElementRef;
  marcas:Array<any>=[""];
  marcasFlag:boolean=true;
  modelos:Array<any>=[""];
  modelosFlag:boolean=true;

  cerrarModal() {
    this.datos=  ['','','','','','','','',''];
    this.alertas=['','','','','','','','','',''];
    this.extras={ 
      cilindros: '',
      caballos: '',
      peso_bruto_kg: '',
      combined_km: '',
      combined_l_100: '',
      numero_velocidades: '',
      aceleración_0_100: '',
      litros: '',
      motor: '',
      combustible: '',
  
      puertas: '',
      rin_dia: '',
      rin: '',
      carroceria: '',
      luz_baja: '',
  
      gps: '',
      aire_acondicionado: '',
      sensor_distancia: '',
      asistencia_estacionamiento: '',
  
      airbags: '',
      sensor_lluvia: '',
      bolsas_frontales: '',
      discos_freno: '',
      freno_abs: '',
  
      pasajeros: '',
      asientos: '',
  
      bluetooth: '',
      radio: '',
      android_auto: '' 
    };
    this.fotos = [];
    this.sources = [];
    // this.pdf=null;
    this.inputImagen.nativeElement.value = "";
    // this.inputPDF.nativeElement.value = "";
    this.marcasFlag=true;
    this.modelosFlag=true;
    this.modelos=[];
    this.messageEvent.emit(false);
  }

  constructor(private sanitizer: DomSanitizer, public api:AdminService, public api2:ServiciosService) {}

  ngOnInit(): void {
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
  }

  changeMF(){
    this.marcasFlag=!this.marcasFlag;
    this.datos[0]='';
  }
  changeMF2(){
    this.modelosFlag=!this.modelosFlag;
    this.datos[1]='';
  }

  getModelos(){
    this.modelos=[""];
    let dato={
      'dato':'modeloAdmin',
      'marca':this.datos[0]
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

  showImg(event: Event){
		this.sources=[];
    this.fotos=[];
    const element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;    
		this.fotos=element.files;
    
		if(cantidad==0) {
			this.sources=[];
		}else{
			for (let index = 0; index < cantidad; index++) {
				var nombreCortado=element.files![index].name.split('.');
				var extensionArchivo=nombreCortado[nombreCortado.length-1];
				
				if(extensionArchivo!="pdf"){
          setTimeout(() => {
            const reader = new FileReader();
            reader.readAsDataURL(element.files![index]);

            reader.onloadend = ()=>{
              this.sources.push({id: (index+1), link: reader.result, name: element.files![index].name})
            }            
          }, index*200);
				}
			}			
      //this.fotos=Object.assign( { }, element.files)//element.files;
		}
	}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  // showPDF(event: Event){
  //   this.pdf=null;
  //   this.datos[8]=[]
  //   const element = event.currentTarget as HTMLInputElement;    
  //   if(element.files?.length!=undefined && element.files?.length>0){ 
  //     this.pdf= this.transform(URL.createObjectURL(element.files[0]));
  //     this.datos[8]=element.files;
  //   }    
	// }

  crearAuto(){    
    let flag=true;
    for (let i = 0; i < this.datos.length; i++) {
      if(this.datos[i]==='') flag=false;
      this.alertas[i]= this.datos[i]==='' ? 'Campo obligatorio' : '';
    }
    if(this.fotos.length==0) flag=false;
    this.alertas[8]= this.fotos.length==0 ? 'Campo obligatorio' : '';
    // this.alertas[8]= this.pdf==null ? 'Campo obligatorio' : '';

    if(flag){
      const formData = new FormData();
      formData.append('marca', this.datos[0]);
      formData.append('modelo', this.datos[1]);
      formData.append('version', this.datos[2]);
      formData.append('ano', this.datos[3]);
      formData.append('kms', this.datos[4]);
      formData.append('ubicacion', this.datos[5]);
      formData.append('transmision', this.datos[6]);
      formData.append('traccion', this.datos[7]);
      formData.append('precio', this.datos[8]);

      if(this.extras['cilindros']!='') formData.append('cilindros', this.extras['cilindros']);
      if(this.extras['caballos']!='') formData.append('caballos', this.extras['caballos']);
      if(this.extras['peso_bruto_kg']!='') formData.append('peso_bruto_kg', this.extras['peso_bruto_kg']);
      if(this.extras['combined_km']!='') formData.append('combined_km', this.extras['combined_km']);
      if(this.extras['combined_l_100']!='') formData.append('combined_l_100', this.extras['combined_l_100']);
      if(this.extras['numero_velocidades']!='') formData.append('numero_velocidades', this.extras['numero_velocidades']);
      if(this.extras['aceleración_0_100']!='') formData.append('aceleración_0_100', this.extras['aceleración_0_100']);
      if(this.extras['litros']!='') formData.append('litros', this.extras['litros']);
      if(this.extras['motor']!='') formData.append('motor', this.extras['motor']);
      if(this.extras['combustible']!='') formData.append('combustible', this.extras['combustible']);

      if(this.extras['puertas']!='') formData.append('puertas', this.extras['puertas']);
      if(this.extras['rin_dia']!='') formData.append('rin_dia', this.extras['rin_dia']);
      if(this.extras['rin']!='') formData.append('rin', this.extras['rin']);
      if(this.extras['carroceria']!='') formData.append('carroceria', this.extras['carroceria']);
      if(this.extras['luz_baja']!='') formData.append('luz_baja', this.extras['luz_baja']);

      if(this.extras['gps']!='') formData.append('gps', this.extras['gps']);
      if(this.extras['aire_acondicionado']!='') formData.append('aire_acondicionado', this.extras['aire_acondicionado']);
      if(this.extras['sensor_distancia']!='') formData.append('sensor_distancia', this.extras['sensor_distancia']);
      if(this.extras['asistencia_estacionamiento']!='') formData.append('asistencia_estacionamiento', this.extras['asistencia_estacionamiento']);

      if(this.extras['airbags']!='') formData.append('airbags', this.extras['airbags']);
      if(this.extras['sensor_lluvia']!='') formData.append('sensor_lluvia', this.extras['sensor_lluvia']);
      if(this.extras['bolsas_frontales']!='') formData.append('bolsas_frontales', this.extras['bolsas_frontales']);
      if(this.extras['discos_freno']!='') formData.append('discos_freno', this.extras['discos_freno']);
      if(this.extras['freno_abs']!='') formData.append('freno_abs', this.extras['freno_abs']);

      if(this.extras['pasajeros']!='') formData.append('pasajeros', this.extras['pasajeros']);
      if(this.extras['asientos']!='') formData.append('asientos', this.extras['asientos']);

      if(this.extras['bluetooth']!='') formData.append('bluetooth', this.extras['bluetooth']);
      if(this.extras['radio']!='') formData.append('radio', this.extras['radio']);
      if(this.extras['android_auto']!='') formData.append('android_auto', this.extras['android_auto']);

      formData.append('marcasFlag', this.marcasFlag ? 'NO' : 'SI');
      formData.append('modelosFlag', this.modelosFlag ? 'NO' : 'SI');      

      formData.append('token', localStorage.getItem('token')!);
      formData.append('tipo', '1');
			for (let i = 0; i < this.fotos.length; i++) {
				formData.append('img', this.fotos[i]);  
        formData.append('imgOrden', this.sources[i].name);	
			}
      //formData.append('pdf', this.datos[8][0]);

      this.api.crearAuto(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Auto creado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }else{
          Swal.fire({title:resp.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }
        this.cerrarModal();
      }, (err)=>{				
        Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        this.cerrarModal();
      });
    }
  }

  cambiarOrden(id:number){
    let index=id-1
    let link=this.sources[index].link;
    let name=this.sources[index].name;

    if(id==this.sources.length){
      this.sources[index].link=this.sources[0].link;
      this.sources[0].link=link;
      this.sources[index].name=this.sources[0].name;
      this.sources[0].name=name;
    }else{
      this.sources[index].link=this.sources[id].link;
      this.sources[id].link=link;
      this.sources[index].name=this.sources[id].name;
      this.sources[id].name=name;
    }
  }
}