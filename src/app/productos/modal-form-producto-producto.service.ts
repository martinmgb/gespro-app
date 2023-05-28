import { Injectable, EventEmitter } from '@angular/core';
import { ProductoProducto } from './producto-producto';

@Injectable({
  providedIn: 'root'
})
export class ModalFormProductoProductoService {
  modal: boolean = false;
  private _notificarProductoProducto = new EventEmitter<ProductoProducto>();
  constructor() { }

  get notificarProductoProducto(): EventEmitter<ProductoProducto>{
    return this._notificarProductoProducto;
  }

  public abrirModal(){
    this.modal = true;
  }

  public cerrarModal(){
    this.modal = false;
  }
}
