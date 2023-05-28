import { Component, OnInit } from '@angular/core';
import { Pedido } from './pedido';
import { PedidoService } from './pedido.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos: Pedido[];
  pedidoSeleccionado : Pedido;
  paginador : any;

  constructor(private pedidoService: PedidoService,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {

      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.pedidoService.getPedidos(page).subscribe(
        response => {
          this.pedidos = response.content as Pedido[]
          this.paginador = response;
          this.paginador.component = 'pedidos';
      });
    })
  }

  delete(pedido: Pedido) : void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro?',
      text: `¿Seguro que desea eliminar el pedido ${pedido.id}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.pedidoService.delete(pedido.id).subscribe(
          response => {
            this.pedidos = this.pedidos.filter(pro => pro !== pedido);
            swalWithBootstrapButtons.fire(
              'Pedido eliminado!',
              `Pedido ${pedido.id} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })

  }

  accionar(pedido: Pedido, accion:string) : void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: `¿Está seguro?`,
      text: `¿Seguro que desea ${accion} el pedido ${pedido.id}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.pedidoService.accionar(pedido, accion).subscribe(
          response => {
            this.pedidoService.getPedidos(0).subscribe(
              response => {
                this.pedidos = response.content as Pedido[]
                this.paginador = response;
                this.paginador.component = 'pedidos';
            });
            swalWithBootstrapButtons.fire(
              'Pedido ha sido modificado!',
              `Pedido ${pedido.id} modificado con éxito.`,
              'success'
            )
          }
        )
      }
    })

  }

}
