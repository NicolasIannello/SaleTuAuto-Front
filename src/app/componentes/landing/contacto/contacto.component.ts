import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ServiciosService } from '../../../servicios/servicios.service';
import Swal from 'sweetalert2';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

const numero=environment.numero;
type LoginFormResult = {
  nomapel: string
  telefono: string
};

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, RecaptchaV3Module, RouterModule, CommonModule],
  templateUrl: './contacto.component.html',
  styleUrl: '../inicio/inicio.component.css'
})
export class ContactoComponent {
  @Input() color: string | undefined;
  @Input() auto: string | undefined;
  campos:Array<string>=['','',''];
  alertas:Array<string>=['*','*','*'];
  flag:boolean=false;
  number:string="+5491127605336";
  maps:string="https://www.google.com/maps/place/Diag.+San+Mart%C3%ADn+1051,+B7630+Necochea,+Provincia+de+Buenos+Aires/@-38.5702242,-58.7298997,17z/data=!3m1!4b1!4m6!3m5!1s0x958f97fbc309579d:0xa5dfd694711382!8m2!3d-38.5702242!4d-58.7298997!16s%2Fg%2F11qmsw20pl?entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D";

  constructor(public api:ServiciosService, private recaptchaV3Service: ReCaptchaV3Service) {}

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
            'auto': this.auto,
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

  mapsG(){
    window.open(this.maps);
  }
}
