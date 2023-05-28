import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginador : any;

  paginas: number[];
  url : string;
  desde : number;
  hasta : number;
  component : string;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.desde = this.getRangoMin();
    this.hasta = this.getRangoMax();
    //this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    if(this.paginador.totalPages > 5){
      this.paginas = new Array(this.hasta - this.desde -1).fill(0).map((_valor, indice) => indice + this.desde);
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }

  getRangoMin():number {
    return Math.min(Math.max(1, this.paginador.number-4), this.paginador.totalPages-5);
  }

  getRangoMax():number {
    return Math.max(Math.min(this.paginador.totalPages+2, this.paginador.number+4), 6);
  }

  public getComponent(): string{
    return this.paginador.component;
  }

}
