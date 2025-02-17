import { Routes } from '@angular/router';
import { LandingComponent } from './componentes/landing/landing.component';
import { InicioComponent } from './componentes/landing/inicio/inicio.component';
import { authGuard } from './guard/auth.guard';
import { PanelAdminComponent } from './componentes/panel-admin/panel-admin.component';
import { LoginComponent } from './componentes/panel-admin/login/login.component';
import { UsuariosComponent } from './componentes/panel-admin/usuarios/usuarios.component';
import { AutosComponent } from './componentes/panel-admin/autos/autos.component';
import { ListaAutosComponent } from './componentes/autos/lista-autos.component';
import { AutoComponent } from './componentes/autos/auto/auto.component';
import { TycComponent } from './componentes/panel-admin/tyc/tyc.component';
import { VentaRapidaComponent } from './componentes/venta-rapida/venta-rapida.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        { path: '', component: InicioComponent },
        { path: 'autos', component: ListaAutosComponent },
        { path: 'ventaRapida', component: VentaRapidaComponent },
        { path: 'autos/:uuid', component: AutoComponent },
    ] },
    { path: 'panelAdmin', component: PanelAdminComponent , children: [
        { path: '', component: LoginComponent },
        { path: 'usuarios', component: UsuariosComponent, canActivate:[authGuard] },
        { path: 'autos', component: AutosComponent, canActivate:[authGuard] },
        { path: 'Term&Cond', component: TycComponent, canActivate:[authGuard] },
        { path: '**',   redirectTo: '', pathMatch: 'full' },
    ]},
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
