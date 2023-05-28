import { Injectable, EventEmitter } from '@angular/core';
import { InsumoPedido } from './insumo-pedido';

@Injectable({
  providedIn: 'root'
})
export class ModalFormInsumoPedidoService {
  modal: boolean = false;
  private _notificarInsumoPedido = new EventEmitter<InsumoPedido>();
  constructor() { }

  get notificarInsumoPedido(): EventEmitter<InsumoPedido>{
    return this._notificarInsumoPedido;
  }

  public abrirModal(){
    this.modal = true;
  }

  public cerrarModal(){
    this.modal = false;
  }
}
