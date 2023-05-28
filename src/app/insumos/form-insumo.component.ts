import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Insumo } from './insumo';
import { TipoInsumo } from './../tipos-insumo/tipo-insumo';
import { UnidadMedida } from './../unidades-medida/unidad-medida';
import { InsumoService } from './insumo.service';
import { TipoInsumoService } from './../tipos-insumo/tipo-insumo.service';
import { UnidadMedidaService } from './../unidades-medida/unidad-medida.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form-insumo.component.html',
  styleUrls: ['./form-insumo.component.css']
})
export class FormInsumoComponent implements OnInit {

  form: FormGroup;
  private isNew = true;
  private insumo: Insumo = new Insumo();
  private tiposInsumo: TipoInsumo[];
  private unidadesMedida: UnidadMedida[];
  private titulo:string = 'Crear Insumo';

  private errors : string[];
  constructor(private formBuilder: FormBuilder,
    private insumoService: InsumoService,
    private tipoInsumoService: TipoInsumoService,
    private unidadMedidaService: UnidadMedidaService,
    private router : Router,
    private activatedRoute : ActivatedRoute) {
      this.buildForm();
  }

  ngOnInit() {
    this.cargarInsumo();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id:[''],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      tipoInsumo: ['', [Validators.required]],
      unidadMedida: ['', [Validators.required]],
      costo: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
    });
  }

  public create(): void{
    console.log("Clicked!");
    console.log(this.form.value);
    this.insumoService.create(this.form.value).subscribe(
      response => {
       this.router.navigate(['/insumos']);
       Swal.fire('Nuevo insumo', `Insumo ${response.data.nombre} creado con éxito!`, 'success');
     },
     err => {
        this.errors = err.error.errors as string[];
        console.error(err.error.errors);
     }
    )
  }

  public cargarInsumo(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.insumoService.getInsumo(id).subscribe(insumo => {
          this.form.patchValue(insumo);
          this.tipoInsumoField.setValue(insumo.tipoInsumo);
        })
        this.titulo='Editar Insumo';
      }

    })

    this.tipoInsumoService.getTiposInsumoAll().subscribe(
      tiposInsumo => this.tiposInsumo = tiposInsumo
    );

    this.unidadMedidaService.getUnidadesMedidaAll().subscribe(
      unidadesMedida => this.unidadesMedida = unidadesMedida
    );
  }

  public update(): void{
    this.insumoService.update(this.form.value).subscribe(
      response => {
        this.router.navigate(['/insumos']);
        console.log(response);
        Swal.fire('Insumo actualizado', `Insumo ${response.data.nombre} actualizado con éxito!`, 'success');
      },
      err => {
         this.errors = err.error.errors as string[];
         console.error(err.error.errors);
      }
    )
  }

  compararTipoInsumo(t1 : TipoInsumo, t2 : TipoInsumo){
    return t1==null || t2==null? false : t1.id === t2.id;
  }

  compararUnidadMedida(u1 : UnidadMedida, u2 : UnidadMedida){
    return u1==null || u2==null? false : u1.id === u2.id;
  }

  get nombreField() {
    return this.form.get('nombre');
  }

  get tipoInsumoField() {
    return this.form.get('tipoInsumo');
  }

  get unidadMedidaField() {
    return this.form.get('unidadMedida');
  }

  get costoField() {
    return this.form.get('costo');
  }

  get stockField() {
    return this.form.get('stock');
  }

}
