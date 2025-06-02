import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiciosService } from '../../servicios/servicios.service';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../servicios/admin.service';
import { EMPTY } from 'rxjs';
import { ContactoComponent } from "../landing/contacto/contacto.component";

@Component({
  selector: 'app-venta-rapida',
  standalone: true,
  imports: [FormsModule, CommonModule, RecaptchaV3Module, ContactoComponent],
  templateUrl: './venta-rapida.component.html',
  styleUrl: '../landing/inicio/inicio.component.css'
})
export class VentaRapidaComponent implements OnInit{
  campos:Array<string>=['','',''];
  alertas:Array<string>=['*','*','*','*'];
  sources: Array<any> = [];
  fotos:any = []
  sourcesAdicionales: Array<any> = [];
  fotosAdicionales:any = []
  flag:boolean=true;
  tyc:string='';
  display:boolean=false;
  flagspinner:boolean=false;
  aceptarText:string='Aceptar';

  constructor(public api:ServiciosService, private recaptchaV3Service: ReCaptchaV3Service, public api2:AdminService) {}
  
  ngOnInit(): void {
    this.api2.cargarTyc().subscribe({
      next:(value)=> {
          this.tyc=value.tyc
      },
      error:(err)=> {
        Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});            
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
        this.enviar()
      },
      (error)=> {
      },
    );
  }
  
  async enviar(){
    this.flag=true;
    for (let i = 0; i < this.campos.length; i++) {
      if(this.campos[i]=='') this.flag=false;
      this.alertas[i]= this.campos[i]=='' ? 'El campo es obligatorio' : '*';
    }
    if(this.fotos.length<7) this.flag=false;
    this.alertas[3]= this.fotos.length<7 ? 'Los campos con * son obligatorio' : '*';
    for (let i = 0; i < this.fotos.length; i++) {
      if(this.fotos[i] == undefined) {
        this.flag=false;
        this.alertas[3]='Los campos con * son obligatorio';
      }
    }
    
    if(this.flag){
      const { value: accept } = await Swal.fire({
        width: '90%',
        title: "Terminos y condiciones",
        text: this.tyc,
        input: "checkbox",
        inputValue: 0,
        inputPlaceholder: `He leido y acepto los terminos y condiciones`,
        confirmButtonText: `Enviar datos`,
        inputValidator: (result) => {
          return !result && "Debe aceptar los Terminos y condiciones";
        }
      });
      if (accept) {
        const formData = new FormData();
        formData.append('matricula', this.campos[0].toUpperCase());
        formData.append('descripcion', this.campos[1]);
        formData.append('telefono', this.campos[2]);
        for (let i = 0; i < this.fotos.length; i++) {
          formData.append('img', this.fotos[i]);  
        }
        for (let i = 0; i < this.fotosAdicionales.length; i++) {
          formData.append('img', this.fotosAdicionales[i]);  
        }
        
        this.api.ventaRapida(formData).then(resp =>{
          if(resp.ok) Swal.fire({title:'Datos del auto enviados con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          if(!resp.ok) {
            Swal.fire({title:'Ocurrio un error: \n'+(resp.errors.matricula ? resp.errors.matricula.param+": "+resp.errors.matricula.msg : '')+'\n'+
              (resp.errors.telefono ? " "+resp.errors.telefono.param+": "+resp.errors.telefono.msg : ''), confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          }
        }, (err)=>{				
          Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        });
      }
    }
  }

  showImg(event: Event, id:number){
		if(id!=-1) this.sources[id]={};
		if(id==-1) this.sourcesAdicionales=[];
    if(id!=-1) this.fotos[id]=EMPTY;
    if(id==-1) this.fotosAdicionales=[];
    const element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;    
		if(id!=-1) this.fotos[id]=element.files![0];
		if(id==-1) this.fotosAdicionales=element.files;

    if(cantidad==0) {
			if(id!=-1) this.sources[id]={};
			if(id==-1) this.sourcesAdicionales=[];
    }else{
			for (let index = 0; index < cantidad; index++) {
				var nombreCortado=element.files![index].name.split('.');
				var extensionArchivo=nombreCortado[nombreCortado.length-1];
				
				if(extensionArchivo!="pdf"){
          setTimeout(() => {
            const reader = new FileReader();
            reader.readAsDataURL(element.files![index]);

            reader.onloadend = ()=>{
              if(id!=-1) this.sources[id]={id: (index+1), link: reader.result, name: element.files![index].name};
              if(id==-1) this.sourcesAdicionales.push({id: (index+1), link: reader.result, name: element.files![index].name});
            }
          }, index*200);
				}
			}			
		}
	}

  siguiente(){
    let flag = true;

    for (let i = 0; i < this.campos.length; i++) {
      if(this.campos[i]=='') flag=false;
      this.alertas[i]= this.campos[i]=='' ? 'El campo es obligatorio' : '*';
    }

    if(flag) {
      this.flagspinner=true;
      this.aceptarText='';
      let hoy=new Date();
      let mes = hoy.getMonth()>8 ? (hoy.getMonth()+1) : "0"+(hoy.getMonth()+1);
      let dia = hoy.getDate()>9 ? hoy.getDate() : "0"+hoy.getDate()
      let fecha = dia+"-"+mes+"-"+hoy.getFullYear();
      let dato = {
        'nomapel': this.campos[0],
        'telefono' : this.campos[2],
        'fecha' : fecha,
        'auto' : this.campos[1],
        'subject' : "SALE Tu Auto Formulario de Venta rapida",
        'link' : ''
      }
      
      this.api.contacto(dato).subscribe({
        next:(value) => {
          this.display=true;
          this.flagspinner=false;
          this.aceptarText='Aceptar';
        },
        error:(err) => {
          this.flagspinner=false;
          this.aceptarText='Aceptar';
          Swal.fire({title: err.error.errors.telefono.msg ? err.error.errors.telefono.msg : 'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
      });
    }
  }
}