import { Routes } from '@angular/router';
import { LandingComponent } from './componentes/landing/landing.component';
import { InicioComponent } from './componentes/landing/inicio/inicio.component';
import { authGuard } from './guard/auth.guard';
import { PanelAdminComponent } from './componentes/panel-admin/panel-admin.component';
import { LoginComponent } from './componentes/panel-admin/login/login.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        { path: '', component: InicioComponent },
    ] },
    { path: 'panelAdmin', component: PanelAdminComponent , children: [
        { path: '', component: LoginComponent },
        //{ path: 'autos', component: UsuariosComponent, canActivate:[authGuard] },
        { path: '**',   redirectTo: '', pathMatch: 'full' },
    ]},
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
