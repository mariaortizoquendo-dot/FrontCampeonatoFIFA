import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Seleccion} from '../../shared/entidades/Seleccion';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SeleccionServicio {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}selecciones`;
  }

  public listar(): Observable<Seleccion[]> {
    return this.http.get<Seleccion[]>(this.url);
  }

  public buscar(dato: String): Observable<Seleccion[]> {
    return this.http.get<Seleccion[]>(`${this.url}/buscar/${dato}`);
  }

  public agregar(seleccion: Seleccion): Observable<Seleccion> {
    return this.http.post<Seleccion>(this.url, seleccion);
  }

  public modificar(seleccion: Seleccion): Observable<Seleccion> {
    return this.http.put<Seleccion>(this.url, seleccion);
  }

  public eliminar(idSeleccion: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${idSeleccion}`);
  }

}

