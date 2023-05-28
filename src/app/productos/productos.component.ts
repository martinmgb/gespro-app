import { Component, OnInit } from '@angular/core';
import { Producto } from './producto';
import { ProductoService } from './producto.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: Producto[];
  productoSeleccionado : Producto;
  paginador : any;

  constructor(private productoService: ProductoService,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {

      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.productoService.getProductos(page).subscribe(
        response => {
          this.productos = response.content as Producto[]
          this.paginador = response;
          this.paginador.component = 'productos';
      });
    })
  }

  delete(producto: Producto) : void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está Seguro?',
      text: `¿Seguro que desea eliminar el producto ${producto.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.productoService.delete(producto.id).subscribe(
          response => {
            this.productos = this.productos.filter(pro => pro !== producto);
            swalWithBootstrapButtons.fire(
              'Producto eliminado!',
              `Producto ${producto.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })

  }

  public buscarProductosByNombre(event: any): void{
    console.log("Clicked!");
    console.log("nombre:"+event.target.value);
    if(event.target.value && event.target.value!==''){
      this.productoService.getProductosByNombre(event.target.value, 0).subscribe(
        response => {
          this.productos = response.content as Producto[]
          this.paginador = response;
          this.paginador.component = 'productos';
          this.paginador.filter = 'nombre';
          this.paginador.filterValue = event.target.value;
      });
    }else{
      this.productoService.getProductos(0).subscribe(
        response => {
          this.productos = response.content as Producto[]
          this.paginador = response;
          this.paginador.component = 'productos';
          this.paginador.filter = null;
          this.paginador.filterValue = null;
      });
    }

  }

}
