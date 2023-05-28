import { InsumoProducto } from './insumo-producto';
import { ProductoProducto } from './producto-producto';

export class Producto {
  id: number;
  nombre:string;
  porcentajeUtilidadDetal: number;
  porcentajeUtilidadMayor: number;
  detalleInsumos: InsumoProducto[] = [];
  detalleProductos: ProductoProducto[] = [];
}
