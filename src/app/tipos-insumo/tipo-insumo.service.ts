import { Injectable } from '@angular/core';
import { TipoInsumo } from './tipo-insumo';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoInsumoService {
  private urlEndPoint:string = environment.hostService+'/api/parametros/tiposInsumo';
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
  private router : Router) { }

  getTiposInsumoAll(): Observable<TipoInsumo[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as TipoInsumo[])
    );
  }

  getTiposInsumo(page : number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as TipoInsumo[]).map(tipoInsumo => {
            tipoInsumo.nombre = tipoInsumo.nombre.toUpperCase();
            //cliente.createAt = formatDate(cliente.createAt, 'EEEE, dd/MM/yyyy', 'es')
            return tipoInsumo;
        });
        return response;
      })
    );
  }

  create(tipoInsumo : TipoInsumo) : Observable<any> {
    return this.http.post<any>(this.urlEndPoint, tipoInsumo, { headers:this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  getTipoInsumo(id): Observable<TipoInsumo>{
    return this.http.get<TipoInsumo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/tiposInsumo']);
        Swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  update(tipoInsumo: TipoInsumo): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${tipoInsumo.id}`, tipoInsumo, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<TipoInsumo>{
    return this.http.delete<TipoInsumo>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }
}
