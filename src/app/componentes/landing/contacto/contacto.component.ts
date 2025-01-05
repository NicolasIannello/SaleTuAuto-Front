import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ServiciosService } from '../../../servicios/servicios.service';
import Swal from 'sweetalert2';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, RecaptchaV3Module, RouterModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  campos:Array<string>=['','',''];
  alertas:Array<string>=['*','*','*'];
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
    for (let i = 0; i < this.campos.length; i++) {
      if(this.campos[i]=='') this.flag=false;
      this.alertas[i]= this.campos[i]=='' ? 'El campo es obligatorio' : '*';
    }    

    if(this.flag){
      let dato={
        'nombre_apellido':this.campos[0],
        'mail':this.campos[1],
        'mensaje':this.campos[2],
        'mensaje2':this.campos[2].replace(/\n/g, '<br>'),
      }
      
      this.api.contacto(dato).subscribe({
        next:(value)=> {
          if(value.ok) Swal.fire({title:'Mensaje enviado con exito', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
          if(!value.ok) Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});
        },
        error:(err)=> {
          Swal.fire({title:'Ocurrio un error', confirmButtonText:'Aceptar',confirmButtonColor:'#3083dc'});       
        },
      })
    }
  }
}
