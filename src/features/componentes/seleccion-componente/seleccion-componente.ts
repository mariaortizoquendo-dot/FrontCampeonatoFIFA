import {Component, OnInit} from '@angular/core';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {FormsModule} from '@angular/forms';
import {ColumnMode, NgxDatatableModule} from '@swimlane/ngx-datatable';
import {Seleccion} from '../../../shared/entidades/seleccion';
import {SeleccionServicio} from '../../../core/servicios/seleccion-servicio';
import {MatDialog} from '@angular/material/dialog';
import {SeleccionEditarComponente} from '../seleccion-editar-componente/seleccion-editar-componente';
import {DecidirComponente} from '../../../shared/componentes/decidir-componente/decidir-componente';

@Component({
  selector: 'app-seleccion-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './seleccion-componente.html',
  styleUrl: './seleccion-componente.css',
})
export class SeleccionComponente implements OnInit {
  public textoBusqueda: string = "";

  public selecciones: Seleccion[] = [];
  public seleccionEscogida: Seleccion | undefined;
  public indiceSeleccionEscogida: number = -1;

  public columnas = [
    {name: "Nombre", prop: "nombre"},
    {name: "Entidad", prop: "entidad"}
  ];
  public modoColumna = ColumnMode;


  constructor(private seleccionServicio: SeleccionServicio,
              private dialogoServicio: MatDialog) {

  }

  ngOnInit() {
    this.listar();
  }

  public escoger(event: any) {
    if (event.type == "click") {
      this.seleccionEscogida = event.row;
      this.indiceSeleccionEscogida = this.selecciones.findIndex(seleccion => seleccion == this.seleccionEscogida);
    }
  }

  public listar() {
    this.seleccionServicio.listar().subscribe(
      {
        next: respuesta => {
          this.selecciones = respuesta.sort((a, b) => a.nombre.localeCompare(b.nombre));
        },
        error: error => {
          window.alert(error.message);
        }
      }
    );
  }

  public buscar() {
    if (this.textoBusqueda.length == 0) {
      this.listar();
    } else {
      this.seleccionServicio.buscar(this.textoBusqueda).subscribe(
        {
          next: response => {
            this.selecciones = response;
          },
          error: error => {
            window.alert(error.message);
          }
        }
      );
    }
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(SeleccionEditarComponente, {
      width: '500px',
      height: '300px',
      data: {
        encabezado: `Agregando Selección`,
        seleccion: {
          id: 0,
          nombre: "",
          entidad: ""
        }
      },
      disableClose: true
    });
    dialogoAgregar.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          this.seleccionServicio.agregar(datos.seleccion).subscribe({
            next: respuesta => {
              this.textoBusqueda = respuesta.nombre;
              this.buscar();
            },
            error: error => {
              window.alert(error.message);
            }
          })
        }
      }
    });
  }

  public modificar() {
    if (this.seleccionEscogida) {
      const dialogoModificar = this.dialogoServicio.open(SeleccionEditarComponente, {
        width: '500px',
        height: '300px',
        data: {
          encabezado: `Editando la selección [${this.seleccionEscogida.nombre}]`,
          seleccion: this.seleccionEscogida
        },
        disableClose: true
      });
      dialogoModificar.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.seleccionServicio.modificar(datos.seleccion).subscribe({
              next: respuesta => {
                this.selecciones[this.indiceSeleccionEscogida] = respuesta;
              },
              error: error => {
                window.alert(error.message);
              }
            })
          }
        }
      });
    } else {
      window.alert("Debe escoger una Selección");
    }
  }

  public verificarEliminar() {
    if (this.seleccionEscogida) {
      const dialogoModificar = this.dialogoServicio.open(DecidirComponente, {
        width: '400px',
        height: '200px',
        data: {
          encabezado: `Está seguro de eliminar la selección [${this.seleccionEscogida.nombre}]?`,
          id: this.seleccionEscogida.id
        },
        disableClose: true
      });
      dialogoModificar.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.seleccionServicio.eliminar(datos.id).subscribe({
              next: respuesta => {
                this.listar();
              },
              error: error => {
                window.alert(error.message);
              }
            })
          }
        }
      });
    } else {
      window.alert("Debe escoger una Selección");
    }
  }
}
