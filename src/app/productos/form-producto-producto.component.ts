import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from './producto';
import { ProductoProducto } from './producto-producto';
import { ProductoService } from  './producto.service';
import { ModalFormProductoProductoService } from './modal-form-producto-producto.service';

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-form-producto-producto',
  templateUrl: './form-producto-producto.component.html',
  styleUrls: ['./form-producto-producto.component.css']
})
export class FormProductoProductoComponent implements OnInit {

  form: FormGroup;
  private isNew = true;

  @Input() private producto: Producto;
  private productoProducto: ProductoProducto = new ProductoProducto();
  private productos: Producto[];
  private titulo:string = 'Agregar Producto';

  private errors : string[];

  constructor(private formBuilder: FormBuilder,
              private productoService: ProductoService,
              private modalFormProductoProductoService: ModalFormProductoProductoService,
              public dialogRef: MatDialogRef<FormProductoProductoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductoProducto) {
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
    this.productoService.getProductosByTipo(0).subscribe(
      productos => this.productos = productos//productos.filter(pro => pro.id !== this.productoField.value.id)
    );

    console.info(this.data);
    if(this.data!=null){
      this.isNew = false;
      this.form.patchValue(this.data);
    }
  }

  public addProductoProducto(): void{
    this.modalFormProductoProductoService.notificarProductoProducto.emit(this.productoProducto);
    this.cerrarModal();
  }

  public compararProducto(i1 : Producto, i2 : Producto){
    return i1==null || i2==null? false : i1.id === i2.id;
  }

  public cerrarModal(): void{
    this.producto = null;
    this.productoProducto = new ProductoProducto();
    this.modalFormProductoProductoService.cerrarModal();
  }

  get productoField() {
    return this.form.get('producto');
  }

  get cantidadField() {
    return this.form.get('cantidad');
  }
}
