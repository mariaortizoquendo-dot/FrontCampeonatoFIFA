import {Routes} from '@angular/router';
import {InicioComponent} from '../features/componentes/inicio/inicio';
import {SeleccionComponente} from '../features/componentes/seleccion-componente/seleccion-componente';

export const routes: Routes = [
  {path: "", redirectTo: "inicio", pathMatch: "full"},
  {path: "inicio", component: InicioComponent},
  {path: "selecciones", component: SeleccionComponente},
];
