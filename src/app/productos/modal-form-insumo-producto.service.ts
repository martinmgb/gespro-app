import { Injectable, EventEmitter } from '@angular/core';
import { InsumoProducto } from './insumo-producto';

@Injectable({
  providedIn: 'root'
})
export class ModalFormInsumoProductoService {
  modal: boolean = false;
  private _notificarInsumoProducto = new EventEmitter<InsumoProducto>();
  private _notificarModificacionInsumoProducto = new EventEmitter<InsumoProducto[]>();
  constructor() { }

  get notificarInsumoProducto(): EventEmitter<InsumoProducto>{
    return this._notificarInsumoProducto;
  }

  get notificarModificacionInsumoProducto(): EventEmitter<InsumoProducto[]>{
    return this._notificarModificacionInsumoProducto;
  }

  public abrirModal(){
    this.modal = true;
  }

  public cerrarModal(){
    this.modal = false;
  }
}
