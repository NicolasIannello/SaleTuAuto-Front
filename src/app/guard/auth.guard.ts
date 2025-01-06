import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AdminService } from '../servicios/admin.service';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private api: AdminService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/']);    
      return false
    }
    let datos={
      'token': localStorage.getItem('token'),
      'tipo': 3
    }
    this.api.checkTokenA(datos).subscribe({
      next: (value)=>{
        return value.ok;
      },
      error: (err)=>{
        this.router.navigate(['/']);
        return false;
      }
    })
  }
}