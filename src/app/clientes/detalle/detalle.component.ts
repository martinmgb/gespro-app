import { Component, OnInit, Input} from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo : string  = "Detalle del Cliente";
  progreso : number = 0;
  private fotoSeleccionada : File;

  constructor(private clienteService : ClienteService,
              private modalService : ModalService) { }

  ngOnInit() {
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.fotoSeleccionada.type.indexOf('image')<0){
      Swal.fire('Debe seleccionar una imagen', `El archivo seleccionado no es una imagen`, 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Debe seleccionar una imagen previamente', `No ha seleccionado una imagen`, 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          let response:any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('La foto se ha subido con exito!', `La foto se ha subido completamente y sin problemas: ${this.cliente.foto}`, 'success');
        }
      })
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
