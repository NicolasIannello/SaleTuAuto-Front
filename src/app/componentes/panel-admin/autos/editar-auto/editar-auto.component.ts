import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from '../../../ver-imagen/ver-imagen.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../../servicios/admin.service';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-editar-auto',
  standalone: true,
  imports: [CommonModule, VerImagenComponent, FormsModule, CdkDropList, CdkDrag],
  templateUrl: './editar-auto.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class EditarAutoComponent{
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input() auto:{[key: string]: any}={descripcion:''};
  imagenes: Array<{link:SafeResourceUrl|string|null,id:number,name:string,estado:number}> = [];
  //pdf:SafeResourceUrl|null=null;
  verImg:boolean=false;
  imgID:number=-1;
  autoNuevo:{[key: string]: any}={descripcion:''}
  alertas:Array<string>=['','','','','','','','',''];
  //sources: Array<any> = [];
  imgs: any = [];
  //pdfFile: any = [];
  //pdfNuevo:SafeResourceUrl|null=null;
  @ViewChild('imagen') inputImagen!: ElementRef;
  //@ViewChild('pdfTC') inputPDF!: ElementRef;
  //flagElim:boolean=false;
  imgElim:Array<string>=[]
  //imgElimCount:number=1;
  upID:number|null=null;

  constructor(private sanitizer: DomSanitizer, public api:ServiciosService, public apiAdmin:AdminService) {}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  handleMessage(message: boolean, tipo:string) {    
    this.verImg=message;
  }

  cerrarModal() {
    //this.flagElim=false;
    this.imgElim=[];
    //this.imgElimCount=1;
    this.imagenes=[];
    //this.pdf=null;
    this.autoNuevo={};
    //this.pdfFile=[];
    //this.pdfNuevo=null;
    this.imgs=[];
    //this.sources=[];
    this.alertas=['','','','','','','','',''];
    this.inputImagen.nativeElement.value = "";
    //this.inputPDF.nativeElement.value = "";
    this.messageEvent.emit(false);
  }

  async cargarImagenes(imgs:Array<any>, pdf:any){
    this.imagenes=[];
    for (let i = 1; i < imgs.length+1; i++) {      
      this.imagenes.push({link:'', id:i,name:'',estado:0});
    }
    //this.pdf=null;
    for (let i = 0; i < imgs.length; i++) {      
      this.api.cargarArchivo(imgs[i].img,'autos').then(resp=>{						
        if(resp!=false){
          this.imagenes[imgs[i].orden-1]={link:resp.url, id:(imgs[i].orden), name:imgs[i].img, estado:0};
        }
      })      
    }    
    await this.sleep(500); 
    this.autoNuevo= Object.assign( { }, this.auto);        
    // this.api.cargarArchivo(pdf.pdf,'pdfs').then(resp=>{
    //this.autoNuevo= Object.assign( { }, this.auto);
    //   if(resp!=false){
    //     this.pdf=this.transform(resp.url);
    //   }
    // })
  }

  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  verImagen(id:number){
    this.verImg=true;
    this.imgID=(id-1);    
  }

  showImg(event: Event){
		//this.sources=[];
    this.imgs=[];
    const element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;    
		this.imgs=element.files;
    
		if(cantidad==0) {
			//this.sources=[];
      for (let i = this.imagenes.length-1; i > 0; i--) {
        if(this.imagenes[i].estado==1 || this.imagenes[i].estado==3) this.imagenes.splice(i,1)
      }
		}else{
      let base = this.imagenes.length;
			for (let index = 0; index < cantidad; index++) {
				var nombreCortado=element.files![index].name.split('.');
				var extensionArchivo=nombreCortado[nombreCortado.length-1];
				
				if(extensionArchivo!="pdf"){
					const reader = new FileReader();
					reader.readAsDataURL(element.files![index]);

					reader.onloadend = async ()=>{
            await this.sleep(500); 
						//this.sources.push({id: (index+1), link: reader.result, name: element.files![index].name})
            this.imagenes.push({link:reader.result, id:(index+1+base), name:element.files![index].name, estado:1});
					}
				}
			}			
      this.imgs=element.files;
		}
	}

  // showPDF(event: Event){
  //   this.pdfNuevo=null;
  //   this.pdfFile=[]
  //   const element = event.currentTarget as HTMLInputElement;    
  //   if(element.files?.length!=undefined && element.files?.length>0){ 
  //     this.pdfNuevo= this.transform(URL.createObjectURL(element.files[0]));
  //     this.pdfFile=element.files;
  //   }    
	// }

  actualizar(){    
    if(this.autoNuevo['marca']=='' || this.autoNuevo['modelo']=='' || this.autoNuevo['version']=='' || this.autoNuevo['ano']==null || this.autoNuevo['precio']==null ||
      this.autoNuevo['kms']==null || this.autoNuevo['ubicacion']=='' || this.autoNuevo['transmision']=='' || this.autoNuevo['traccion']==''
    ){
      this.alertas[0]=this.autoNuevo['marca']=='' ? 'El campo es obligatorio' : '';
      this.alertas[1]=this.autoNuevo['modelo']=='' ? 'El campo es obligatorio' : '';
      this.alertas[2]=this.autoNuevo['version']=='' ? 'El campo es obligatorio' : '';
      this.alertas[3]=this.autoNuevo['ano']==null ? 'El campo es obligatorio' : '';
      this.alertas[4]=this.autoNuevo['kms']==null ? 'El campo es obligatorio' : '';
      this.alertas[5]=this.autoNuevo['ubicacion']=='' ? 'El campo es obligatorio' : '';
      this.alertas[6]=this.autoNuevo['transmision']=='' ? 'El campo es obligatorio' : '';
      this.alertas[7]=this.autoNuevo['traccion']=='' ? 'El campo es obligatorio' : '';      
      this.alertas[8]=this.autoNuevo['precio']==null ? 'El campo es obligatorio' : '';      
      Swal.fire({title:'Hay campos que no pueden estar vacios',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
    }else{
      const formData = new FormData();
      formData.append('marca', this.autoNuevo['marca']);
      formData.append('modelo', this.autoNuevo['modelo']);
      formData.append('version', this.autoNuevo['version']);
      formData.append('ano', this.autoNuevo['ano']);
      formData.append('kms', this.autoNuevo['kms']);
      formData.append('ubicacion', this.autoNuevo['ubicacion']);
      formData.append('transmision', this.autoNuevo['transmision']);
      formData.append('traccion', this.autoNuevo['traccion']);
      formData.append('precio', this.autoNuevo['precio']);
      formData.append('moneda', this.autoNuevo['moneda']);
      formData.append('estado', this.autoNuevo['estado']);

      if(this.autoNuevo['cilindros']!==undefined && this.autoNuevo['cilindros']!=='') formData.append('cilindros', this.autoNuevo['cilindros']);
      if(this.autoNuevo['caballos']!==undefined && this.autoNuevo['caballos']!=='') formData.append('caballos', this.autoNuevo['caballos']);
      if(this.autoNuevo['peso_bruto_kg']!==undefined && this.autoNuevo['peso_bruto_kg']!=='') formData.append('peso_bruto_kg', this.autoNuevo['peso_bruto_kg']);
      if(this.autoNuevo['combined_km']!==undefined && this.autoNuevo['combined_km']!=='') formData.append('combined_km', this.autoNuevo['combined_km']);
      if(this.autoNuevo['combined_l_100']!==undefined && this.autoNuevo['combined_l_100']!=='') formData.append('combined_l_100', this.autoNuevo['combined_l_100']);
      if(this.autoNuevo['numero_velocidades']!==undefined && this.autoNuevo['numero_velocidades']!=='') formData.append('numero_velocidades', this.autoNuevo['numero_velocidades']);
      if(this.autoNuevo['aceleracion_0_100']!==undefined && this.autoNuevo['aceleracion_0_100']!=='') formData.append('aceleracion_0_100', this.autoNuevo['aceleracion_0_100']);
      if(this.autoNuevo['litros']!==undefined && this.autoNuevo['litros']!=='') formData.append('litros', this.autoNuevo['litros']);
      if(this.autoNuevo['motor']!==undefined && this.autoNuevo['motor']!=='') formData.append('motor', this.autoNuevo['motor']);
      if(this.autoNuevo['combustible']!==undefined && this.autoNuevo['combustible']!=='') formData.append('combustible', this.autoNuevo['combustible']);

      if(this.autoNuevo['puertas']!==undefined && this.autoNuevo['puertas']!=='') formData.append('puertas', this.autoNuevo['puertas']);
      if(this.autoNuevo['rin_dia']!==undefined && this.autoNuevo['rin_dia']!=='') formData.append('rin_dia', this.autoNuevo['rin_dia']);
      if(this.autoNuevo['rin']!==undefined && this.autoNuevo['rin']!=='') formData.append('rin', this.autoNuevo['rin']);
      if(this.autoNuevo['carroceria']!==undefined && this.autoNuevo['carroceria']!=='') formData.append('carroceria', this.autoNuevo['carroceria']);
      if(this.autoNuevo['luz_baja']!==undefined && this.autoNuevo['luz_baja']!=='') formData.append('luz_baja', this.autoNuevo['luz_baja']);

      if(this.autoNuevo['gps']!==undefined && this.autoNuevo['gps']!=='') formData.append('gps', this.autoNuevo['gps']);
      if(this.autoNuevo['aire_acondicionado']!==undefined && this.autoNuevo['aire_acondicionado']!=='') formData.append('aire_acondicionado', this.autoNuevo['aire_acondicionado']);
      if(this.autoNuevo['sensor_distancia']!==undefined && this.autoNuevo['sensor_distancia']!=='') formData.append('sensor_distancia', this.autoNuevo['sensor_distancia']);
      if(this.autoNuevo['asistencia_estacionamiento']!==undefined && this.autoNuevo['asistencia_estacionamiento']!=='') formData.append('asistencia_estacionamiento', this.autoNuevo['asistencia_estacionamiento']);

      if(this.autoNuevo['airbags']!==undefined && this.autoNuevo['airbags']!=='') formData.append('airbags', this.autoNuevo['airbags']);
      if(this.autoNuevo['sensor_lluvia']!==undefined && this.autoNuevo['sensor_lluvia']!=='') formData.append('sensor_lluvia', this.autoNuevo['sensor_lluvia']);
      if(this.autoNuevo['bolsas_frontales']!==undefined && this.autoNuevo['bolsas_frontales']!=='') formData.append('bolsas_frontales', this.autoNuevo['bolsas_frontales']);
      if(this.autoNuevo['discos_freno']!==undefined && this.autoNuevo['discos_freno']!=='') formData.append('discos_freno', this.autoNuevo['discos_freno']);
      if(this.autoNuevo['freno_abs']!==undefined && this.autoNuevo['freno_abs']!=='') formData.append('freno_abs', this.autoNuevo['freno_abs']);

      if(this.autoNuevo['pasajeros']!==undefined && this.autoNuevo['pasajeros']!=='') formData.append('pasajeros', this.autoNuevo['pasajeros']);
      if(this.autoNuevo['asientos']!==undefined && this.autoNuevo['asientos']!=='') formData.append('asientos', this.autoNuevo['asientos']);

      if(this.autoNuevo['bluetooth']!==undefined && this.autoNuevo['bluetooth']!=='') formData.append('bluetooth', this.autoNuevo['bluetooth']);
      if(this.autoNuevo['radio']!==undefined && this.autoNuevo['radio']!=='') formData.append('radio', this.autoNuevo['radio']);
      if(this.autoNuevo['android_auto']!==undefined && this.autoNuevo['android_auto']!=='') formData.append('android_auto', this.autoNuevo['android_auto']);

      formData.append('auto', this.autoNuevo['uuid']);
      formData.append('token', localStorage.getItem('token')!);
      formData.append('tipo', '1');
      //if(this.pdfFile.length!=0 && this.pdfFile.length!=undefined) formData.append('pdf', this.pdfFile[0]);
      if(this.imgs.length!=0 && this.imgs.length!=undefined /*&& !this.flagElim*/) {
        for (let i = 0; i < this.imgs.length; i++) {
          formData.append('img', this.imgs[i]);		
          //formData.append('imgOrden', this.sources[i].name);	
        }
      }  
      for (let i = 0; i < this.imagenes.length; i++) {
        formData.append('imgOrden', this.imagenes[i].name);    
        formData.append('imgEstado', this.imagenes[i].estado.toString());    
      }
      //if(this.flagElim){
        // for (let i = 0; i < this.imgElim.length; i++) {
        //   formData.append('imgElim', this.imgElim[i]);		
        // }
      //}
      for (var key in this.autoNuevo) {
        if(this.autoNuevo[key]===undefined || this.autoNuevo[key]==='') formData.append('unset', key);
      }
      
      this.apiAdmin.actualizarAuto(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Auto actualizado con exito',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }else{
          Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'})
        }
        this.cerrarModal();
      }, (err)=>{				
        Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        this.cerrarModal();
      });
    }
  }

  // cambiarOrden(id:number,i:number){
  //   let index=id-1
  //   let link=this.sources[index].link;
  //   let name=this.sources[index].name;

  //   if(id==this.sources.length && i==0){
  //     this.sources[index].link=this.sources[0].link;
  //     this.sources[0].link=link;
  //     this.sources[index].name=this.sources[0].name;
  //     this.sources[0].name=name;
  //   }else if(index==0 && i<0){
  //     this.sources[index].link=this.sources[this.sources.length-1].link;
  //     this.sources[this.sources.length-1].link=link;
  //     this.sources[index].name=this.sources[this.sources.length-1].name;
  //     this.sources[this.sources.length-1].name=name;
  //   }else{
  //     this.sources[index].link=this.sources[id+i].link;
  //     this.sources[id+i].link=link;
  //     this.sources[index].name=this.sources[id+i].name;
  //     this.sources[id+i].name=name;
  //   }
  // }

  eliminarImg(id:any){
    // if(this.imagenes.length>this.imgElimCount) {
    //   this.imgElimCount++;
    //   this.flagElim=true;
      if(this.imagenes[id].estado==0 || this.imagenes[id].estado==1){
        this.imgElim.push(this.imagenes[id].name);
        this.imagenes[id].estado= this.imagenes[id].estado==0 ? 2 : 3;
      }else{
        this.imagenes[id].estado= this.imagenes[id].estado==2 ? 0 : 1;
        if(this.imagenes[id].estado==0){  
          for (let i = 0; i < this.imgElim.length; i++) {
            if(this.imgElim[i]==this.imagenes[id].name) this.imgElim.splice(i,1);
          }
        }
      }
      //this.imagenes[imagen.id-1]={link:'',id:0,name:'',};      
    //}
  }

  mouseup(id:number, flag:boolean){
    if(this.upID!=null){
      let link=this.imagenes[this.upID].link;
      let name=this.imagenes[this.upID].name;
      let estado=this.imagenes[this.upID].estado;
      if(flag){
        if(this.upID>id+1) this.imagenes.splice(this.upID,1);
        if(id==-1){
          this.imagenes.unshift({link: link, id:-1, name:name, estado:estado});
        }else{
          this.imagenes.splice(id+1, 0, {link: link, id:-1, name:name, estado:estado})
          if(this.upID<id+1) this.imagenes.splice(this.upID,1);
        }
        for (let i = 0; i < this.imagenes.length; i++) {
          this.imagenes[i].id=i+1;          
        }
      }else{
        this.imagenes[this.upID].link=this.imagenes[id].link;
        this.imagenes[id].link=link;
        this.imagenes[this.upID].name=this.imagenes[id].name;
        this.imagenes[id].name=name;
        this.imagenes[this.upID].estado=this.imagenes[id].estado;
        this.imagenes[id].estado=estado;
      }
      this.upID=null;
    }
  }
}
