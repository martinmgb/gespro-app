import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoInsumo } from './tipo-insumo';
import { TipoInsumoService } from './tipo-insumo.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form-tipo-insumo.component.html',
  styleUrls: ['./form-tipo-insumo.component.css']
})
export class FormTipoInsumoComponent implements OnInit {

  form: FormGroup;
  private tipoInsumo: TipoInsumo = new TipoInsumo();
  private titulo:string = 'Crear Tipo de Insumo';
  private isNew = true;

  private errors : string[];
  constructor(private formBuilder: FormBuilder,
  private tipoInsumoService: TipoInsumoService,
  private router : Router,
  private activatedRoute : ActivatedRoute) {
    this.buildForm();
  }

  ngOnInit() {
    this.cargarTipoInsumo();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id:[''],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  public create(): void{
    console.log("Clicked!");
    console.log(this.form.value);
    this.tipoInsumoService.create(this.form.value).subscribe(
      response => {
       this.router.navigate(['/tiposInsumo']);
       Swal.fire('Nuevo tipo de insumo', `Tipo de insumo ${response.data.nombre} creado con éxito!`, 'success');
     },
     err => {
        this.errors = err.error.errors as string[];
        console.error(err.error.errors);
     }
    )
  }

  public cargarTipoInsumo(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.isNew = false;
        this.tipoInsumoService.getTipoInsumo(id).subscribe(tipoInsumo => {
          this.form.patchValue(tipoInsumo);
        })
      }

    })
  }

  public update(): void{
    this.tipoInsumoService.update(this.form.value).subscribe(
      response => {
        this.router.navigate(['/tiposInsumo']);
        console.log(response);
        Swal.fire('Tipo de insumo actualizado', `Tipo de Insumo ${response.data.nombre} actualizado con éxito!`, 'success');
      },
      err => {
         this.errors = err.error.errors as string[];
         console.error(err.error.errors);
      }
    )
  }

  get nombreField() {
    return this.form.get('nombre');
  }

}
