import { TipoPedido } from './tipo-pedido';
import { InsumoPedido } from './insumo-pedido';
import { ProductoPedido } from './producto-pedido';
import { Cliente } from './../clientes/cliente';
import { EstadoPedido } from './estado-pedido';

export class Pedido {
  id: number;
  cliente: Cliente;
  tipoPedido: TipoPedido;
  porcentajeDescuento: number;
  fechaEntrega: Date;
  estadoPedido: EstadoPedido;
  precioDetal: number;
  detalleInsumos: InsumoPedido[] = [];
  detalleProductos: ProductoPedido[] = [];
}
