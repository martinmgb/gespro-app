import { Injectable, EventEmitter } from '@angular/core';
import { ProductoPedido } from './producto-pedido';

@Injectable({
  providedIn: 'root'
})
export class ModalFormProductoPedidoService {
  modal: boolean = false;
  private _notificarProductoPedido = new EventEmitter<ProductoPedido>();
  constructor() { }

  get notificarProductoPedido(): EventEmitter<ProductoPedido>{
    return this._notificarProductoPedido;
  }

  public abrirModal(){
    this.modal = true;
  }

  public cerrarModal(){
    this.modal = false;
  }
}
