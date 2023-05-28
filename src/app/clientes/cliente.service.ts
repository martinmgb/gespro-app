import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import {Region} from './region';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable()
export class ClienteService {

  private urlEndPoint: string = environment.hostService+"/api/clientes";
  private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
  private router : Router) { }

  getClientesAll(): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint).pipe(
      map( (response : any) => {
        (response as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            //cliente.createAt = formatDate(cliente.createAt, 'EEEE, dd/MM/yyyy', 'es')
            return cliente;
        });
        return response;
      })
    );
    //return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  getClientes(page : number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + "/page/"+ page).pipe(
      map( (response : any) => {
        (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            //cliente.createAt = formatDate(cliente.createAt, 'EEEE, dd/MM/yyyy', 'es')
            return cliente;
        });
        return response;
      })
    );
    //return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  create(cliente : Cliente) : Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente, { headers:this.httpHeaders }).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  subirFoto(archivo:File, id) : Observable<HttpEvent<{}>>{
    let formData= new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/uploadFoto`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  getRegiones() : Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + "/regiones");
  }
}
