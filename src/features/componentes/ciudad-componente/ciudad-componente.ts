import {Component} from '@angular/core';
import {Ciudad} from '../../../shared/entidades/ciudad';
import {ColumnMode, NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatDialog} from '@angular/material/dialog';
import {DecidirComponente} from '../../../shared/componentes/decidir-componente/decidir-componente';
import {CiudadServicio} from '../../../core/servicios/ciudad-servicio';
import {CiudadEditarComponente} from '../ciudad-editar-componente/ciudad-editar-componente';
import {SeleccionServicio} from '../../../core/servicios/seleccion-servicio';
import {Seleccion} from '../../../shared/entidades/Seleccion';
import {ReferenciasMaterialModule} from '../../../shared/modulos/referencias-material.module';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-ciudad-componente',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule
  ],
  templateUrl: './ciudad-componente.html',
  styleUrl: './ciudad-componente.css',
})
export class CiudadComponente {
  public textoBusqueda: string = "";

  public ciudades: Ciudad[] = [];
  public paises: Seleccion[] = [];
  public ciudadEscogida: Ciudad | undefined;
  public indiceCiudadEscogida: number = -1;

  public columnas = [
    {name: "Nombre", prop: "nombre"},
    {name: "Pais", prop: "pais.nombre"}
  ];
  public modoColumna = ColumnMode;


  constructor(private ciudadServicio: CiudadServicio,
              private paisServicio: SeleccionServicio,
              private dialogoServicio: MatDialog) {

  }

  ngOnInit() {
    this.listar();
    this.listarPaises();
  }

  public escoger(event: any) {
    if (event.type == "click") {
      this.ciudadEscogida = event.row;
      this.indiceCiudadEscogida = this.ciudades.findIndex(ciudad => ciudad == this.ciudadEscogida);
    }
  }

  public listar() {
    this.ciudadServicio.listar().subscribe(
      {
        next: respuesta => {
          this.ciudades = respuesta.sort((a, b) => a.nombre.localeCompare(b.nombre));
        },
        error: error => {
          window.alert(error.message);
        }
      }
    );
  }

  public listarPaises() {
    this.paisServicio.listar().subscribe(
      {
        next: response => {
          this.paises = response.sort((a, b) => a.nombre.localeCompare(b.nombre));
          ;
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
      this.ciudadServicio.buscar(this.textoBusqueda).subscribe(
        {
          next: response => {
            this.ciudades = response;
          },
          error: error => {
            window.alert(error.message);
          }
        }
      );
    }
  }

  public agregar() {
    const dialogoAgregar = this.dialogoServicio.open(CiudadEditarComponente, {
      width: '500px',
      height: '300px',
      data: {
        encabezado: `Agregando Selección`,
        paises: this.paises,
        ciudad: {
          id: 0,
          nombre: "",
          pais: {
            id: 0,
            nombre: "",
            entidad: ""
          }
        }
      },
      disableClose: true
    });
    dialogoAgregar.afterClosed().subscribe({
      next: datos => {
        if (datos) {
          this.ciudadServicio.agregar(datos.ciudad).subscribe({
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
    if (this.ciudadEscogida) {
      const dialogoModificar = this.dialogoServicio.open(CiudadEditarComponente, {
        width: '500px',
        height: '300px',
        data: {
          encabezado: `Editando la ciudad [${this.ciudadEscogida.nombre}]`,
          ciudad: {...this.ciudadEscogida},
          paises: this.paises
        },
        disableClose: true
      });
      dialogoModificar.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.ciudadServicio.modificar(datos.ciudad).subscribe({
              next: respuesta => {
                this.ciudades[this.indiceCiudadEscogida] = respuesta;
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
    if (this.ciudadEscogida) {
      const dialogoModificar = this.dialogoServicio.open(DecidirComponente, {
        width: '400px',
        height: '200px',
        data: {
          encabezado: `Está seguro de eliminar la ciudad [${this.ciudadEscogida.nombre}]?`,
          id: this.ciudadEscogida.id
        },
        disableClose: true
      });
      dialogoModificar.afterClosed().subscribe({
        next: datos => {
          if (datos) {
            this.ciudadServicio.eliminar(datos.id).subscribe({
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

