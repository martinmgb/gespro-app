import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnidadMedida } from './unidad-medida';
import { UnidadMedidaService } from './unidad-medida.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form-unidad-medida.component.html',
  styleUrls: ['./form-unidad-medida.component.css']
})
export class FormUnidadMedidaComponent implements OnInit {

  form: FormGroup;
  private isNew = true;
  private unidadMedida: UnidadMedida = new UnidadMedida();
  private titulo:string = 'Crear Unidad de Medida';

  private errors : string[];
  constructor(private formBuilder: FormBuilder,
  private unidadMedidaService: UnidadMedidaService,
  private router : Router,
  private activatedRoute : ActivatedRoute) {
    this.buildForm();
  }

  ngOnInit() {
    this.cargarUnidadMedida();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id:[''],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      nombreAbreviado: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  public create(): void{
    console.log("Clicked!");
    console.log(this.form.value);
    this.unidadMedidaService.create(this.form.value).subscribe(
      response => {
       this.router.navigate(['/unidadesMedida']);
       Swal.fire('Nueva unidad de medida', `Unidad de medida ${response.data.nombre} creada con éxito!`, 'success');
     },
     err => {
        this.errors = err.error.errors as string[];
        console.error(err.error.errors);
     }
    )
  }

  public cargarUnidadMedida(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.isNew = false;
        this.unidadMedidaService.getUnidadMedida(id).subscribe(unidadMedida => {
          this.form.patchValue(unidadMedida);
        })
      }

    })
  }

  public update(): void{
    this.unidadMedidaService.update(this.unidadMedida).subscribe(
      response => {
        this.router.navigate(['/unidadesMedida']);
        console.log(response);
        Swal.fire('Unidad de medida actualizada', `Unidad de medida ${response.data.nombre} actualizada con éxito!`, 'success');
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

  get nombreAbreviadoField() {
    return this.form.get('nombreAbreviado');
  }
}
