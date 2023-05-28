import { Injectable } from '@angular/core';
import { Insumo } from './insumo';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {
  private urlEndPoint:string = environment.hostService+'/api/insumos';
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
  private router : Router) { }

  getInsumosAll(): Observable<Insumo[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Insumo[])
    );
  }

  getInsumosAllOrderByNombre(): Observable<Insumo[]> {
    return this.http.get(this.urlEndPoint + '/orderByNombre').pipe(
      map( response => response as Insumo[])
    );
  }

  getInsumos(page : number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as Insumo[]).map(insumo => {
            insumo.nombre = insumo.nombre.toUpperCase();
            //cliente.createAt = formatDate(cliente.createAt, 'EEEE, dd/MM/yyyy', 'es')
            return insumo;
        });
        return response;
      })
    );
  }

  getInsumosByNombre(nombre: string, page : number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/nombre/"+ nombre+ "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as Insumo[]).map(insumo => {
            insumo.nombre = insumo.nombre.toUpperCase();
            return insumo;
        });
        return response;
      })
    );
  }

  create(insumo : Insumo) : Observable<any> {
    return this.http.post<any>(this.urlEndPoint, insumo, { headers:this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  getInsumo(id): Observable<Insumo>{
    return this.http.get<Insumo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/insumos']);
        Swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  update(insumo: Insumo): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${insumo.id}`, insumo, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Insumo>{
    return this.http.delete<Insumo>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }
}
