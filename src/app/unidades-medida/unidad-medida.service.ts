import { Injectable } from '@angular/core';
import { UnidadMedida } from './unidad-medida';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {
  private urlEndPoint:string = environment.hostService+'/api/parametros/unidadesMedida';
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
  private router : Router) { }

  //getTiposInsumo(): Observable<TipoInsumo[]> {
//    return this.http.get<TipoInsumo[]>(this.urlEndPoint);
  //}

  getUnidadesMedidaAll(): Observable<UnidadMedida[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as UnidadMedida[])
    );
  }

  getUnidadesMedida(page : number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as UnidadMedida[]).map(unidadMedida => {
            unidadMedida.nombre = unidadMedida.nombre.toUpperCase();
            return unidadMedida;
        });
        return response;
      })
    );
  }

  create(unidadMedida : UnidadMedida) : Observable<any> {
    return this.http.post<any>(this.urlEndPoint, unidadMedida, { headers:this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  getUnidadMedida(id): Observable<UnidadMedida>{
    return this.http.get<UnidadMedida>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/unidadesMedida']);
        Swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  update(unidadMedida: UnidadMedida): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${unidadMedida.id}`, unidadMedida, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<UnidadMedida>{
    return this.http.delete<UnidadMedida>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }
}
