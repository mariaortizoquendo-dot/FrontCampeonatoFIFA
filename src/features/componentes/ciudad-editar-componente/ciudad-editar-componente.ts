import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Ciudad} from '../../../shared/entidades/ciudad';
import {Seleccion} from '../../../shared/entidades/Seleccion';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms';

export interface DatosEdicionCiudad {
  encabezado: string;
  ciudad: Ciudad;
  paises: Seleccion[]
}

@Component({
  selector: 'app-ciudad-editar-componente',
  imports: [
    ReferenciasMaterialModule,
    NgFor,
    FormsModule
  ],
  templateUrl: './ciudad-editar-componente.html',
  styleUrl: './ciudad-editar-componente.css',
})
export class CiudadEditarComponente {
  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionCiudad,
              public dialogRef: MatDialogRef<CiudadEditarComponente>,
  ) {

  }

  compararSelecciones(p1: Seleccion, p2: Seleccion): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
}

