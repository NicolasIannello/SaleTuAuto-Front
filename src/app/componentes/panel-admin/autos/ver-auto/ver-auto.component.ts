import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ServiciosService } from '../../../../servicios/servicios.service';
import { CommonModule } from '@angular/common';
import { VerImagenComponent } from "../../../ver-imagen/ver-imagen.component";

@Component({
  selector: 'app-ver-auto',
  standalone: true,
  imports: [CommonModule, VerImagenComponent],
  templateUrl: './ver-auto.component.html',
  styleUrl: '../../usuarios/usuarios.component.css'
})
export class VerAutoComponent{
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input() auto:{[key: string]: any}=[];
  imagenes: Array<{link:SafeResourceUrl,id:number}> = [];
  //pdf:SafeResourceUrl|null=null;
  verImg:boolean=false;
  imgID:number=-1;
  Ofertas:Array<any>=[];

  constructor(public api: ServiciosService/*, private sanitizer: DomSanitizer*/){}

  // transform(url: any) {
	// 	return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	// }

  handleMessage(message: boolean, tipo:string) {    
    this.verImg=message;
  }

  cerrarModal() {
    this.imagenes=[];
    //this.pdf=null;
    this.Ofertas=[]
    this.messageEvent.emit(false);
  }

  cargarImagenes(imgs:Array<any>, pdf:any){
    this.imagenes=[];
    for (let i = 1; i < imgs.length+1; i++) {      
      this.imagenes.push({link:'', id:i});
    }
    //this.pdf=null;
    for (let i = 0; i < imgs.length; i++) {      
      this.api.cargarArchivo(imgs[i].img,'autos').then(resp=>{						
        if(resp!=false){
          this.imagenes[imgs[i].orden-1]={link:resp.url, id:(imgs[i].orden)};
        }
      })
    }    
  }

  verImagen(id:number){
    this.verImg=true;
    this.imgID=(id-1);    
  }
}
