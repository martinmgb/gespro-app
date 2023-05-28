import { Component, OnInit } from '@angular/core'; 
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from './pedido';
import { Cliente } from './../clientes/cliente';
import { Insumo } from './../insumos/insumo';
import { InsumoPedido } from './insumo-pedido';
import { ProductoPedido } from './producto-pedido';
import { PedidoService } from './pedido.service';
import { ProductoService } from './../productos/producto.service';
import { InsumoService } from './../insumos/insumo.service';
import { ClienteService } from './../clientes/cliente.service';
import { ModalFormInsumoPedidoService } from './modal-form-insumo-pedido.service';
import { ModalFormProductoPedidoService } from './modal-form-producto-pedido.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MatDialog} from '@angular/material/dialog';
import { FormInsumoPedidoComponent } from './form-insumo-pedido.component';
import { FormProductoPedidoComponent } from './form-producto-pedido.component';
import { TipoPedido } from './tipo-pedido';
import { EstadoPedido } from './estado-pedido';

@Component({
  selector: 'app-form',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.css']
})
export class FormPedidoComponent implements OnInit {

  form: FormGroup;
  private isNew = true;
  private varPrecioTotal:number =0;varPrecio= 0; varInsumos= 0; varIva= 0; varDescuento = 0;
  private precio: number = 0;
  private insumos: Insumo[];
  private clientes: Cliente[];
  private titulo:string = 'Crear Pedido';
  filteredOptions: Observable<Cliente[]>;

  private errors : string[];
  constructor(private formBuilder: FormBuilder,
    private pedidoService: PedidoService,
    private productoService: ProductoService,
    private insumoService: InsumoService,
    private clienteService: ClienteService,
    private modalFormInsumoPedidoService: ModalFormInsumoPedidoService,
    private modalFormProductoPedidoService: ModalFormProductoPedidoService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    public dialog: MatDialog) {
      this.buildForm();
    }

  ngOnInit() {
    this.cargarPedido();
     
    this.filteredOptions = this.clienteField.valueChanges.pipe(
      startWith<string | Cliente>(''),
      map(value => typeof value === 'string' ? value : value.nombre),
      map(name => this._filter(name))
    );
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id:[''],
      cliente: ['', [Validators.required]],
      tipoPedido: ['DETAL', [Validators.required]],
      porcentajeDescuento: ['', [Validators.min(0), Validators.max(100)]],
      fechaEntrega: [''],
      estadoPedido: [new EstadoPedido()],
      detalleInsumos: this.formBuilder.array([]),
      detalleProductos: this.formBuilder.array([])
    });
  }

  public create(): void{
    console.log("Clicked!");
    console.log(this.form.value);
    this.pedidoService.create(this.form.value).subscribe(
      response => {
       this.router.navigate(['/pedidos']);
       Swal.fire('Nuevo pedido', `Pedido ${response.data.nombre} creado con éxito!`, 'success');
     },
     err => {
        this.errors = err.error.errors as string[];
        console.error(err);
     }
    )
  }

  public cargarPedido(): void{
    
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.isNew = false;
        this.titulo='Editar Pedido';
        this.pedidoService.getPedido(id).subscribe(pedido => {
          this.form.patchValue(pedido);
          console.info(pedido);
          pedido.detalleInsumos.map(d => {
            this.detalleInsumosField.push(this.formBuilder.group(d));
          })
          pedido.detalleProductos.map(p => {
            this.detalleProductosField.push(this.formBuilder.group(p));
          })
        })
      }

      this.clienteService.getClientesAll().subscribe(
        clientes => this.clientes = clientes
      );

      this.form.valueChanges.subscribe(selectedValue  => {
        //console.log("selectedValue: "+selectedValue);
        this.varPrecio=0; this.varInsumos=0; this.varDescuento;
        this.detalleProductosField.controls.map(p => {
          if(this.form.value.tipoPedido=="DETAL"){
            this.varPrecio += p.value.producto.costoTotal*(1+p.value.producto.porcentajeUtilidadDetal/100)*p.value.cantidad;
          }else{
            this.varPrecio += p.value.producto.costoTotal*(1+p.value.producto.porcentajeUtilidadMayor/100)*p.value.cantidad;
          }
        })

        this.detalleInsumosField.controls.map(i => {
          if(this.form.value.tipoPedido=="DETAL"){
            this.varInsumos += i.value.insumo.costo*1.60*i.value.cantidad;
          }else{
            this.varInsumos += i.value.insumo.costo*1.40*i.value.cantidad;
          }
        })
        this.varPrecio += this.varInsumos;
        
        this.varIva = this.varPrecio*0.19;
        this.varIva = Math.round(this.varIva);
        this.varPrecio = Math.round(this.varPrecio);
        
        
        if(this.porcentajeDescuentoField.value!=null && this.porcentajeDescuentoField.value>0){
          this.varDescuento = (this.varPrecio+this.varIva) * this.porcentajeDescuentoField.value/100;
          this.varDescuento = Math.round(this.varDescuento);
        }
        this.varPrecioTotal = Math.round((this.varPrecio+this.varIva-this.varDescuento)/100)*100;
      })
    })
  
  }

  public update(): void{
    this.pedidoService.update(this.form.value).subscribe(
      response => {
        this.router.navigate(['/pedidos']);
        console.log(response);
        Swal.fire('Pedido actualizado', `Pedido ${response.data.nombre} actualizado con éxito!`, 'success');
      },
      err => {
         this.errors = err.error.errors as string[];
         console.error(err.error.errors);
      }
    )
  }

  public deleteInsumoPedido(index: number): void{
    this.detalleInsumosField.removeAt(index);
  }

  public deleteProductoPedido(index: number): void{
    this.detalleProductosField.removeAt(index);
  }

  openDialogInsumoPedido(insumoPedido: InsumoPedido): void {
    let modo = 'crear';
    console.log("Insumo: "+insumoPedido);
    if(insumoPedido!=null){
      modo = 'editar';
    }
    const dialogRef = this.dialog.open(FormInsumoPedidoComponent, {
      width: '250px',
      data: insumoPedido
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

  openDialogProductoPedido(productoPedido: ProductoPedido): void {
    
    let modo = 'crear';
    if(productoPedido!=null){
      modo = 'editar';
    }
    const dialogRef = this.dialog.open(FormProductoPedidoComponent, {
      width: '250px',
      data: productoPedido
    });
    console.log(productoPedido);
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

  public abrirModal(): void{
    this.modalFormInsumoPedidoService.abrirModal();
  }

  public compararCliente(i1 : Cliente, i2 : Cliente){
    return i1==null || i2==null? false : i1.id === i2.id;
  }

  public compararTipoPedido(i1 : TipoPedido, i2 : TipoPedido){
    return i1==null || i2==null? false : i1 === i2;
  }

  get clienteField() {
    return this.form.get('cliente');
  }

  get tipoPedidoField() {
    return this.form.get('tipoPedido');
  }

  get porcentajeDescuentoField() {
    return this.form.get('porcentajeDescuento');
  }

  get estadoPedidoField() {
    return this.form.get('estadoPedido');
  }

  get detalleInsumosField() {
    return this.form.get('detalleInsumos') as FormArray;
  }

  get detalleProductosField() {
    return this.form.get('detalleProductos') as FormArray;;
  }

  displayFn(cliente?: Cliente): string | undefined {
    return cliente ? cliente.nombre : undefined;
  }

  private _filter(value: string): Cliente[] {
    if(value && value.length !== 0){
      const filterValue = value.toLowerCase();

      return this.clientes.filter(cliente => cliente.nombre.toLowerCase().indexOf(filterValue) === 0);
    }
  }

}
