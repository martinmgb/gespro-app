import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from './producto';
import { InsumoProducto } from './insumo-producto';
import { Insumo } from './../insumos/insumo';
import { InsumoService } from  './../insumos/insumo.service';
import { ModalFormInsumoProductoService } from './modal-form-insumo-producto.service';

import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-form-insumo-producto',
  templateUrl: './form-insumo-producto.component.html',
  styleUrls: ['./form-insumo-producto.component.css']
})
export class FormInsumoProductoComponent implements OnInit, OnChanges {

  form: FormGroup;
  private isNew = true;

  @Input() productoSeleccionado: Producto;
  @Input() insumoProductoSeleccionado: InsumoProducto;
  @Input() accion: string;
  private producto: Producto;
  private insumoProducto: InsumoProducto = new InsumoProducto();
  private insumos: Insumo[];
  private titulo:string = 'Agregar Insumo';
  private accionForm:string = '';

  private errors : string[];

  constructor(private formBuilder: FormBuilder,
              private insumoService: InsumoService,
              private modalFormInsumoProductoService: ModalFormInsumoProductoService,
              public dialogRef: MatDialogRef<FormInsumoProductoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InsumoProducto) {
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
      insumo: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges() {
    /*console.info(this.insumoProductoSeleccionado);
    console.info(this.producto);
    this.insumoProducto = this.insumoProductoSeleccionado;
    this.producto = this.productoSeleccionado;
    this.accionForm = this.accion;*/
  }

  public cargarSelects(): void{
    this.insumoService.getInsumosAllOrderByNombre().subscribe(
      insumos => this.insumos = insumos
    );
    console.info(this.data);
    if(this.data!=null){
      this.isNew = false;
      this.form.patchValue(this.data);
    }

  }

  public addInsumoProducto(): void{
    this.modalFormInsumoProductoService.notificarInsumoProducto.emit(this.form.value);
    this.cerrarModal();
  }

  public updateInsumoProducto(): void{
    this.producto.detalleInsumos.map(detalleInsumo => {
      if(detalleInsumo.insumo.nombre == this.insumoProducto.insumo.nombre){
        detalleInsumo = this.insumoProducto;
      }
    })
    this.modalFormInsumoProductoService.notificarModificacionInsumoProducto.emit(this.producto.detalleInsumos);
    this.cerrarModal();
  }

  public compararInsumo(i1 : Insumo, i2 : Insumo){
    return i1==null || i2==null? false : i1.id === i2.id;
  }

  public cerrarModal(): void{
    this.producto = null;
    this.modalFormInsumoProductoService.cerrarModal();
  }

  get insumoField() {
    return this.form.get('insumo');
  }

  get cantidadField() {
    return this.form.get('cantidad');
  }

}
