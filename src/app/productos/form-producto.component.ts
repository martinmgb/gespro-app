import { Component, OnInit } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from './producto';
import { Insumo } from './../insumos/insumo';
import { InsumoProducto } from './insumo-producto';
import { ProductoProducto } from './producto-producto';
import { ProductoService } from './producto.service';
import { InsumoService } from './../insumos/insumo.service';
import { ModalFormInsumoProductoService } from './modal-form-insumo-producto.service';
import { ModalFormProductoProductoService } from './modal-form-producto-producto.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import {MatDialog} from '@angular/material/dialog';
import { FormInsumoProductoComponent } from './form-insumo-producto.component';
import { FormProductoProductoComponent } from './form-producto-producto.component';

@Component({
  selector: 'app-form',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.css']
})
export class FormProductoComponent implements OnInit {

  form: FormGroup;
  private isNew = true;
  private producto: Producto = new Producto();
  private insumoProductoSeleccionado: InsumoProducto = new InsumoProducto();
  private insumos: Insumo[];
  private titulo:string = 'Crear Producto';
  private accionFormInsumoProducto:string = '';

  private errors : string[];
  constructor(private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private insumoService: InsumoService,
    private modalFormInsumoProductoService: ModalFormInsumoProductoService,
    private modalFormProductoProductoService: ModalFormProductoProductoService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    public dialog: MatDialog) {
      this.buildForm();
   }

  ngOnInit() {
    this.cargarProducto();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id:[''],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      porcentajeUtilidadDetal: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      porcentajeUtilidadMayor: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      detalleInsumos: this.formBuilder.array([]),
      detalleProductos: this.formBuilder.array([])
    });
  }

  public create(): void{
    console.log("Clicked!");
    console.log(this.form.value);
    this.productoService.create(this.form.value).subscribe(
      response => {
       this.router.navigate(['/productos']);
       Swal.fire('Nuevo producto', `Producto ${response.data.nombre} creado con éxito!`, 'success');
     },
     err => {
        //this.errors = err.error.errors as string[];
        console.error(err);
     }
    )
  }

  public cargarProducto(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.isNew = false;
        this.titulo='Editar Producto';
        this.productoService.getProducto(id).subscribe(producto => {
          this.form.patchValue(producto);
          console.info(producto);
          producto.detalleInsumos.map(d => {
            this.detalleInsumosField.push(this.formBuilder.group(d));
          })
          producto.detalleProductos.map(p => {
            this.detalleProductosField.push(this.formBuilder.group(p));
          })
        })
      }

      /*this.modalFormInsumoProductoService.notificarInsumoProducto.subscribe(insumoProducto =>{
        console.info('Notificando: '+insumoProducto);
        this.producto.detalleInsumos.push(insumoProducto as InsumoProducto);
      })

      this.modalFormInsumoProductoService.notificarModificacionInsumoProducto.subscribe(detalleInsumos =>{
        console.info('Notificando: '+detalleInsumos)
        this.producto.detalleInsumos = detalleInsumos;
      })

      this.modalFormProductoProductoService.notificarProductoProducto.subscribe(productoProducto =>{
        this.producto.detalleProductos.push(productoProducto as ProductoProducto);
      })*/



    })
  }

  public update(): void{
    this.productoService.update(this.form.value).subscribe(
      response => {
        this.router.navigate(['/productos']);
        console.log(response);
        Swal.fire('Producto actualizado', `Producto ${response.data.nombre} actualizado con éxito!`, 'success');
      },
      err => {
         this.errors = err.error.errors as string[];
         console.error(err.error.errors);
      }
    )
  }

  public deleteInsumoProducto(index: number): void{
    this.detalleInsumosField.removeAt(index);
  }

  public deleteProductoProducto(index: number): void{
    this.detalleProductosField.removeAt(index);
  }

  public abrirModal(): void{
    this.accionFormInsumoProducto = 'crear';
    this.insumoProductoSeleccionado = new InsumoProducto();
    this.modalFormInsumoProductoService.abrirModal();
  }

  public abrirModalEditar(insumoProducto: InsumoProducto):void{
    this.accionFormInsumoProducto = 'editar';
    this.insumoProductoSeleccionado = insumoProducto;
    console.info(this.insumoProductoSeleccionado);
    this.modalFormInsumoProductoService.abrirModal();
  }

  openDialogInsumoProducto(insumoProducto: InsumoProducto): void {
    let modo = 'crear';
    if(insumoProducto!=null){
      modo = 'editar';
    }
    const dialogRef = this.dialog.open(FormInsumoProductoComponent, {
      width: '250px',
      data: insumoProducto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        if(modo==='crear'){
          this.detalleInsumosField.push(this.formBuilder.group(result));
        }else{
          this.detalleInsumosField.controls.map(d => {
              if(d.value.insumo.id==result.insumo.id){
                d.patchValue(result);
              }
          })
        }
      }
    });
  }

  openDialogProductoProducto(productoProducto: ProductoProducto): void {
    let modo = 'crear';
    if(productoProducto!=null){
      modo = 'editar';
    }
    const dialogRef = this.dialog.open(FormProductoProductoComponent, {
      width: '250px',
      data: productoProducto
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(result){
        if(modo==='crear'){
          this.detalleProductosField.push(this.formBuilder.group(result));
        }else{
          this.detalleProductosField.controls.map(d => {
              if(d.value.producto.id==result.producto.id){
                d.patchValue(result);
              }
          })
        }
      }
    });
  }

  get nombreField() {
    return this.form.get('nombre');
  }

  get tipoField() {
    return this.form.get('tipo');
  }

  get porcentajeUtilidadDetalField() {
    return this.form.get('porcentajeUtilidadDetal');
  }

  get porcentajeUtilidadMayorField() {
    return this.form.get('porcentajeUtilidadMayor');
  }

  get detalleInsumosField() {
    return this.form.get('detalleInsumos') as FormArray;
  }

  get detalleProductosField() {
    return this.form.get('detalleProductos') as FormArray;;
  }

}
