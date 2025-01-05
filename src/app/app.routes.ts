import { Routes } from '@angular/router';
import { LandingComponent } from './componentes/landing/landing.component';
import { InicioComponent } from './componentes/landing/inicio/inicio.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        { path: '', component: InicioComponent },
    ] },
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
