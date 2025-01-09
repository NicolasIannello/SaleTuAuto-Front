import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  header:HttpHeaders;

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  loginA(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/login', dato, {'headers':this.header})
  }
  checkTokenA(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/renew', dato, {'headers':this.header})
  }
  crearAdmin(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/crearAdmin', dato, {'headers':this.header})
  }
  cargarAdmins(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/admins', dato, {'headers':this.header})
  }
  deleteUsers(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/deleteUser', dato, {'headers':this.header})
  }
  cargarAutos(url:number,order:string,orden:string):Observable<any>{
    return this.http.post(base_url+'/auto/autos?desde='+url+'&order='+order+'&orden='+orden, {'headers':this.header})
  }
  async crearAuto(dato:any){    
    try {
      const resp = await fetch(base_url+'/admin/crearAuto',{
        method: 'POST', 
        headers: {'Acces-Control-Allow-Origin':'*'},
        body: dato
      });

      const data = await resp.json();
      return data;
    } catch (error) {
      return false;
    }
  }
  borrarAuto(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/borrarAuto', dato, {'headers':this.header})
  }
  async actualizarAuto(dato:any){    
    try {
      const resp = await fetch(base_url+'/admin/actualizarAuto',{
        method: 'POST', 
        headers: {'Acces-Control-Allow-Origin':'*'},
        body: dato
      });

      const data = await resp.json();
      return data;
    } catch (error) {
      return false;
    }
  }
}
