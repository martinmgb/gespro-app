import { TipoInsumo } from './../tipos-insumo/tipo-insumo';
import { UnidadMedida } from './../unidades-medida/unidad-medida';

export class Insumo {
  id: number;
  nombre: string;
  tipoInsumo: TipoInsumo;
  unidadMedida: UnidadMedida;
  costo: number;
  stock: number;
}
