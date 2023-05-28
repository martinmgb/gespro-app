import { Injectable } from '@angular/core';
import { Pedido } from './pedido';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private urlEndPoint:string = environment.hostService+'/api/pedidos';
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
  private router : Router) { }

  getPedidosAll(): Observable<Pedido[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Pedido[])
    );
  }

  getPedidosByTipo(tipo: number): Observable<Pedido[]> {
    return this.http.get(this.urlEndPoint + "/tipo/"+tipo).pipe(
      map( response => response as Pedido[])
    );
  }

  getPedidos(page : number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as Pedido[]).map(pedido => {
            return pedido;
        });
        return response;
      })
    );
  }

  create(pedido : Pedido) : Observable<any> {
    return this.http.post<any>(this.urlEndPoint, pedido, { headers:this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  getPedido(id): Observable<Pedido>{
    return this.http.get<Pedido>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/pedidos']);
        Swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  update(pedido: Pedido): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${pedido.id}`, pedido, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Pedido>{
    return this.http.delete<Pedido>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  accionar(pedido: Pedido, accion:string): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${accion}/${pedido.id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }
}
