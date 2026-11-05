import { Component, OnInit } from '@angular/core';
import { Campeonato } from 'src/app/entidades/campeonato';

import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { TablaPosicion } from 'src/app/entidades/tabla-posicion';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { Grupo } from 'src/app/entidades/grupo';
import { GrupoService } from 'src/app/servicios/grupo.service';

@Component({
  selector: 'app-tabla-posiciones',
  templateUrl: './tabla-posiciones.component.html',
  styleUrls: ['./tabla-posiciones.component.css']
})
export class TablaPosicionesComponent implements OnInit {

  public idCampeonato: number = 0;
  public campeonatos: Campeonato[] = [];
  public idGrupo: number = 0;
  public grupos: Grupo[] = [];

  public columnas = [
    { name: 'Seleccion', prop: 'pais', width: 300 },
    { name: 'PJ', prop: 'pJ', width: 50 },
    { name: 'PG', prop: 'pG', width: 50 },
    { name: 'PE', prop: 'pE', width: 50 },
    { name: 'PP', prop: 'pP', width: 50 },
    { name: 'GF', prop: 'gF', width: 50 },
    { name: 'GC', prop: 'gC', width: 50 },
    { name: 'Puntos', prop: 'puntos', width: 50 },
  ];
  public posiciones: TablaPosicion[] = [];
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;
  public posicionSeleccionada: TablaPosicion | undefined;


  constructor(private campeonatoService: CampeonatoService,
              private grupoService: GrupoService,
  ) {
  }

  ngOnInit(): void {
    this.listarCampeonatos();
  }

  public listarCampeonatos() {
    this.campeonatoService.listar()
      .subscribe(data => {
          this.campeonatos = data;
        },
        err => {
          window.alert(err.message)
        });
  }

  public seleccionarCampeonato() {
    this.campeonatoService.listarGrupos(this.idCampeonato)
      .subscribe(data => {
        this.grupos = data;
        },
        err => {
          window.alert(err.message)
        });
  }
  public seleccionarGrupo() {
    this.grupoService.obtenerTablaPosiciones(this.idGrupo)
      .subscribe(data => {
          this.posiciones = data;
        },
        err => {
          window.alert(err.message)
        });
  }
  public onActivate(event: any) {
    if (event.type == 'click') {
      this.posicionSeleccionada = event.row;
    }
  }
}
