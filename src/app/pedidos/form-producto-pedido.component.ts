import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from './pedido';
import { Producto } from './../productos/producto';
import { ProductoPedido } from './producto-pedido';
import { PedidoService } from  './pedido.service';
import { ProductoService } from  './../productos/producto.service';
import { ModalFormProductoPedidoService } from './modal-form-producto-pedido.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-form-producto-pedido',
  templateUrl: './form-producto-pedido.component.html',
  styleUrls: ['./form-producto-pedido.component.css']
})
export class FormProductoPedidoComponent implements OnInit {

  form: FormGroup;
  private isNew = true;

  @Input() private pedido: Pedido;
  private productoPedido: ProductoPedido = new ProductoPedido();
  private productos: Producto[];
  private titulo:string = 'Agregar Producto';

  private errors : string[];

  constructor(private formBuilder: FormBuilder,
              private productoService: ProductoService,
              private modalFormProductoPedidoService: ModalFormProductoPedidoService,
              public dialogRef: MatDialogRef<FormProductoPedidoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductoPedido) { 
    this.buildForm();
  }

  ngOnInit() {
    this.cargarSelects();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      producto: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
    });
  }

  public cargarSelects(): void{
    this.productoService.getProductosAll().subscribe(
      productos => this.productos = productos
    );

    console.info(this.data);
    if(this.data!=null){
      this.isNew = false;
      this.form.patchValue(this.data);
    }
  }

  public addProductoPedido(): void{
    this.modalFormProductoPedidoService.notificarProductoPedido.emit(this.productoPedido);
    this.cerrarModal();
  }

  public compararProducto(i1 : Producto, i2 : Producto){
    return i1==null || i2==null? false : i1.id === i2.id;
  }

  public cerrarModal(): void{
    this.pedido = null;
    this.productoPedido = new ProductoPedido();
    this.modalFormProductoPedidoService.cerrarModal();
  }

  get productoField() {
    return this.form.get('producto');
  }

  get cantidadField() {
    return this.form.get('cantidad');
  }

}
