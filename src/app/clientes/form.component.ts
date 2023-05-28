import { Component, OnInit } from '@angular/core';
import { FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service'
import { Router, ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {

  form: FormGroup;
  private isNew = true;
  private regiones : Region[];
  private titulo : string = "Crear Cliente";

  private errors : string[];
  constructor(private formBuilder: FormBuilder,
  private clienteService: ClienteService,
  private router : Router,
  private activatedRoute : ActivatedRoute) {
    this.buildForm();
  }

  ngOnInit() {
    this.cargarCliente();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id:[''],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      apellido: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.email]],
      fechaNacimiento: [''],
    });
  }

  public create(): void{
    console.log("Clicked!");
    console.log(this.form.value);
    this.clienteService.create(this.form.value).subscribe(
      response => {
       this.router.navigate(['/clientes']);
       Swal.fire('Nuevo Cliente', `Cliente ${response.cliente.nombre} creado con éxito!`, 'success');
     },
     err => {
        this.errors = err.error.errors as string[];
        console.error(err.error.errors);
     }
    )
  }

  public cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.isNew = false;
        this.titulo='Editar Cliente';
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.form.patchValue(cliente);
          console.info(cliente);
        })
      }
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
    })
  }

  public update(): void{
    this.clienteService.update(this.form.value).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        console.log(response);
        Swal.fire('Cliente Actualizado', `Cliente ${response.cliente.nombre} actualizado con éxito!`, 'success');
      },
      err => {
         this.errors = err.error.errors as string[];
         console.error(err.error.errors);
      }
    )
  }

  compararRegion(r1 : Region, r2 : Region){
    return r1==null || r2==null? false : r1.id === r2.id;
  }

  get nombreField() {
    return this.form.get('nombre');
  }

  get apellidoField() {
    return this.form.get('apellido');
  }

  get emailField() {
    return this.form.get('email');
  }

  get fechaNacimientoField() {
    return this.form.get('fechaNacimiento');
  }

}
