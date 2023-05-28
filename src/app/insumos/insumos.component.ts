import { Component, OnInit } from '@angular/core';
import { Insumo } from './insumo';
import { InsumoService } from './insumo.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-insumos',
  templateUrl: './insumos.component.html',
  styleUrls: ['./insumos.component.css']
})
export class InsumosComponent implements OnInit {

  insumos: Insumo[];
  insumoSeleccionado : Insumo;
  paginador : any;

  constructor(private insumoService: InsumoService,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {

      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      let nombre:string = params.get('nombre');
      if(!nombre){
        this.insumoService.getInsumos(page).subscribe(
          response => {
            this.insumos = response.content as Insumo[]
            this.paginador = response;
            this.paginador.component = 'insumos';
            this.paginador.filter = null;
            this.paginador.filterValue = null;
        });
      }else{
        this.insumoService.getInsumosByNombre(nombre, page).subscribe(
          response => {
            this.insumos = response.content as Insumo[]
            this.paginador = response;
            this.paginador.component = 'insumos';
            this.paginador.filter = 'nombre';
            this.paginador.filterValue = nombre;
        });
      }
    })
  }

  delete(insumo: Insumo) : void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro?',
      text: `¿Seguro que desea eliminar el insumo ${insumo.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.insumoService.delete(insumo.id).subscribe(
          response => {
            this.insumos = this.insumos.filter(ins => ins !== insumo);
            swalWithBootstrapButtons.fire(
              'Insumo Eliminado!',
              `Insumo ${insumo.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })

  }

  public buscarInsumosByNombre(event: any): void{
    console.log("Clicked!");
    console.log("nombre:"+event.target.value);
    if(event.target.value && event.target.value!==''){
      this.insumoService.getInsumosByNombre(event.target.value, 0).subscribe(
        response => {
          this.insumos = response.content as Insumo[]
          this.paginador = response;
          this.paginador.component = 'insumos';
          this.paginador.filter = 'nombre';
          this.paginador.filterValue = event.target.value;
      });
    }else{
      this.insumoService.getInsumos(0).subscribe(
        response => {
          this.insumos = response.content as Insumo[]
          this.paginador = response;
          this.paginador.component = 'insumos';
          this.paginador.filter = null;
          this.paginador.filterValue = null;
      });
    }

  }

}
