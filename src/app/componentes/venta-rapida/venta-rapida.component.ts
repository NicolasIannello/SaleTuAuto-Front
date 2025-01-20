import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiciosService } from '../../servicios/servicios.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venta-rapida',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './venta-rapida.component.html',
  styleUrl: '../landing/inicio/inicio.component.css'
})
export class VentaRapidaComponent {
  campos:Array<string>=['',''];
  alertas:Array<string>=['*','*','*'];
  sources: Array<any> = [];
  fotos:any = []
  flag:boolean=true;

  constructor(public api:ServiciosService, private recaptchaV3Service: ReCaptchaV3Service) {}
  
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
  
  enviar(){
    this.flag=true;
    for (let i = 0; i < this.campos.length; i++) {
      if(this.campos[i]=='') this.flag=false;
      this.alertas[i]= this.campos[i]=='' ? 'El campo es obligatorio' : '*';
    }
    if(this.fotos.length==0) this.flag=false;
    this.alertas[2]= this.fotos.length==0 ? 'Campo obligatorio' : '';
    
    if(this.flag){
      const formData = new FormData();
      formData.append('matricula', this.campos[0]);
      formData.append('descripcion', this.campos[1]);
      for (let i = 0; i < this.fotos.length; i++) {
				formData.append('img', this.fotos[i]);  
			}      
      
      this.api.ventaRapida(formData).then(resp =>{
        if(resp.ok) Swal.fire({title:'Datos del auto enviados con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        if(!resp.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      }, (err)=>{				
        Swal.fire({title:'Ocurrio un error',confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
      });
    }
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
		}
	}
}