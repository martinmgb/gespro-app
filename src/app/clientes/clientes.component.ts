import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente'
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clienteSeleccionado : Cliente;
  clientes: Cliente[];
  paginador : any;

  constructor(private clienteService: ClienteService,
              private activatedRoute : ActivatedRoute,
              private modalService : ModalService ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {

      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[]
          this.paginador = response;
          this.paginador.component = 'clientes';
      });
    })

    this.modalService.notificarUpload.subscribe( (cliente) =>
      this.clientes = this.clientes.map(clienteOriginal => {
          if(clienteOriginal.id == cliente.id){
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        }
      )
    )
  }

  delete(cliente: Cliente) : void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })

  }

  abrirModal(cliente : Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
