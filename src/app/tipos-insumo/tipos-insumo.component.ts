import { Component, OnInit } from '@angular/core';
import { TipoInsumo } from './tipo-insumo';
import { TipoInsumoService } from './tipo-insumo.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-tipos-insumo',
  templateUrl: './tipos-insumo.component.html',
  styleUrls: ['./tipos-insumo.component.css']
})
export class TiposInsumoComponent implements OnInit {

  tiposInsumo: TipoInsumo[];
  tipoInsumoSeleccionado : TipoInsumo;
  paginador : any;

  constructor(private tipoInsumoService: TipoInsumoService,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {

      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.tipoInsumoService.getTiposInsumo(page).subscribe(
        response => {
          this.tiposInsumo = response.content as TipoInsumo[]
          this.paginador = response;
          this.paginador.component = 'tiposInsumo';
      });
    })
  }

  delete(tipoInsumo: TipoInsumo) : void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro?',
      text: `¿Seguro que desea eliminar al tipo de insumo ${tipoInsumo.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.tipoInsumoService.delete(tipoInsumo.id).subscribe(
          response => {
            this.tiposInsumo = this.tiposInsumo.filter(tinsumo => tinsumo !== tipoInsumo);
            swalWithBootstrapButtons.fire(
              'Tipo de insumo Eliminado!',
              `Tipo de insumo ${tipoInsumo.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })

  }

}
