import { Component, OnInit } from '@angular/core';
import { UnidadMedida } from './unidad-medida';
import { UnidadMedidaService } from './unidad-medida.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-unidades-medida',
  templateUrl: './unidades-medida.component.html',
  styleUrls: ['./unidades-medida.component.css']
})
export class UnidadesMedidaComponent implements OnInit {

  unidadesMedida: UnidadMedida[];
  unidadMedidaSeleccionado : UnidadMedida;
  paginador : any;

  constructor(private unidadMedidaService: UnidadMedidaService,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {

      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.unidadMedidaService.getUnidadesMedida(page).subscribe(
        response => {
          this.unidadesMedida = response.content as UnidadMedida[]
          this.paginador = response;
          this.paginador.component = 'unidadesMedida';
      });
    })
  }

  delete(unidadMedida: UnidadMedida) : void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro?',
      text: `¿Seguro que desea eliminar al unidad de medida ${unidadMedida.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.unidadMedidaService.delete(unidadMedida.id).subscribe(
          response => {
            this.unidadesMedida = this.unidadesMedida.filter(uMedida => uMedida !== unidadMedida);
            swalWithBootstrapButtons.fire(
              'Unidad de medida eliminada!',
              `Unidad de medida ${unidadMedida.nombre} eliminada con éxito.`,
              'success'
            )
          }
        )
      }
    })

  }

}
