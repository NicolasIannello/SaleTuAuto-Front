import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
  cargarAutos(url:number,order:string,orden:string,marca?:string,modelo?:string,version?:string,ano?:number,menorR?:number|null,mayorR?:number|null,menorRP?:number|null,mayorRP?:number|null,ubicacion?:string):Observable<any>{
    let link=base_url+'/auto/autos?desde='+url+'&order='+order+'&orden='+orden;
    if(marca) link+='&marca='+marca;
    if(modelo) link+='&modelo='+modelo;
    if(version) link+='&version='+version;
    if(ano) link+='&ano='+ano;
    if(menorR!=null) link+='&menorR='+menorR;
    if(mayorR!=null) link+='&mayorR='+mayorR;
    if(menorRP!=null) link+='&menorRP='+menorRP;
    if(mayorRP!=null) link+='&mayorRP='+mayorRP;
    if(ubicacion) link+='&ubicacion='+ubicacion;
    return this.http.post(link, {'headers':this.header})
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
  cargarTyc():Observable<any>{
    return this.http.post(base_url+'/admin/tyc', {'headers':this.header})
  }
  editarTyc(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/actualizarTyc', dato, {'headers':this.header})
  }
  actualizarUser(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/actualizarUser', dato, {'headers':this.header})
  }
  form(dato:any):Observable<any>{
    return this.http.post(base_url+'/admin/form', dato, {'headers':this.header})
  }
  generateExcel(data: any[], fileName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    let headers=["Nombre Apellido","Telefono","Fecha"]
    let letras= [...Array(26)].map((_, i) => String.fromCharCode(i + 65));
    
    worksheet.addRow(headers);
    for (let i = 0; i < data.length; i++) {
      let row:Array<any>=[];
      row.push(data[i].nomapel)
      row.push(data[i].telefono)
      row.push(data[i].fecha)
      worksheet.addRow(row);
    }

    let j=0;
    for (let i = 0; i < headers.length; i++) {
      worksheet.getCell(letras[i]+"1").font = { bold: true, size: 12 };
      worksheet.getCell(letras[i]+"1").fill = { type: 'pattern', pattern: 'solid', fgColor: { argb:'6FA8DC' } };
      worksheet.getCell(letras[i]+"1").alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getCell(letras[i]+"1").border = { top: { style: 'thin' },left: { style: 'thin' },bottom: { style: 'thin' },right: { style: 'thin' } };;
      worksheet.getColumn(i+1).width = 20;
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }
}
