import { Injectable } from '@angular/core';
import { Producto } from './producto';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private urlEndPoint:string = environment.hostService+'/api/productos';
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
  private router : Router) { }

  getProductosAll(): Observable<Producto[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map( response => response as Producto[])
    );
  }

  getProductosByTipo(tipo: number): Observable<Producto[]> {
    return this.http.get(this.urlEndPoint + "/tipo/"+tipo).pipe(
      map( response => response as Producto[])
    );
  }

  getProductos(page : number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as Producto[]).map(producto => {
            producto.nombre = producto.nombre.toUpperCase();
            return producto;
        });
        return response;
      })
    );
  }

  getProductosByNombre(nombre: string, page : number): Observable<any>{
    return this.http.get(this.urlEndPoint + "/nombre/"+ nombre+ "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as Producto[]).map(producto => {
            producto.nombre = producto.nombre.toUpperCase();
            return producto;
        });
        return response;
      })
    );
  }

  create(producto : Producto) : Observable<any> {
    return this.http.post<any>(this.urlEndPoint, producto, { headers:this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  getProducto(id): Observable<Producto>{
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/productos']);
        Swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  update(producto: Producto): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${producto.id}`, producto, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Producto>{
    return this.http.delete<Producto>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }
}
