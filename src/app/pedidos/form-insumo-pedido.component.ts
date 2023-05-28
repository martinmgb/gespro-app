import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from './pedido';
import { InsumoPedido } from './insumo-pedido';
import { Insumo } from './../insumos/insumo';
import { InsumoService } from  './../insumos/insumo.service';
import { ModalFormInsumoPedidoService } from './modal-form-insumo-pedido.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-form-insumo-pedido',
  templateUrl: './form-insumo-pedido.component.html',
  styleUrls: ['./form-insumo-pedido.component.css']
})
export class FormInsumoPedidoComponent implements OnInit {

  form: FormGroup;
  private isNew = true;

  @Input() private pedido: Pedido;
  private insumoPedido: InsumoPedido = new InsumoPedido();
  private insumos: Insumo[];
  private titulo:string = 'Agregar Insumo';

  private errors : string[];

  constructor(private formBuilder: FormBuilder,
              private insumoService: InsumoService,
              private modalFormInsumoPedidoService: ModalFormInsumoPedidoService,
              public dialogRef: MatDialogRef<FormInsumoPedidoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InsumoPedido) { 
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

  public cargarSelects(): void{
    this.insumoService.getInsumosAll().subscribe(
      insumos => this.insumos = insumos
    );

    console.info(this.data);
    if(this.data!=null){
      this.isNew = false;
      this.form.patchValue(this.data);
    }
  }

  public addInsumoPedido(): void{
    this.modalFormInsumoPedidoService.notificarInsumoPedido.emit(this.insumoPedido);
    this.cerrarModal();
  }

  public compararInsumo(i1 : Insumo, i2 : Insumo){
    return i1==null || i2==null? false : i1.id === i2.id;
  }

  public cerrarModal(): void{
    this.pedido = null;
    this.insumoPedido = new InsumoPedido();
    this.modalFormInsumoPedidoService.cerrarModal();
  }

  get insumoField() {
    return this.form.get('insumo');
  }

  get cantidadField() {
    return this.form.get('cantidad');
  }

}
