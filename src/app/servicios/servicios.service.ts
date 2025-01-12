import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  header:HttpHeaders;

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  contacto(dato:any):Observable<any>{
    return this.http.post(base_url+'/usuarios/mailContacto', dato, {'headers':this.header})
  }
  cargarAuto(dato:any):Observable<any>{
    return this.http.post(base_url+'/auto/auto', dato, {'headers':this.header})
  }
  async cargarArchivo(dato:any,dato2:any){
    try {
      const resp = await fetch(base_url+'/auto/img?img='+dato+'&tipo='+dato2,{
        method: 'GET', 
        headers: {'Acces-Control-Allow-Origin':'*'},
      });

      return resp;
    } catch (error) {
      return false;
    }
  }
  marcas():Observable<any>{
    return this.http.post(base_url+'/auto/marcas', {'headers':this.header})
  }
  modelos(dato:any):Observable<any>{
    return this.http.post(base_url+'/auto/modelos', dato, {'headers':this.header})
  }
  versiones(dato:any):Observable<any>{
    return this.http.post(base_url+'/auto/versiones', dato, {'headers':this.header})
  }
}