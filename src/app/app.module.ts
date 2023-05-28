import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TiposInsumoComponent } from './tipos-insumo/tipos-insumo.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PaginatorComponent } from './paginator/paginator.component';
import { FormTipoInsumoComponent } from './tipos-insumo/form-tipo-insumo.component';
import { UnidadesMedidaComponent } from './unidades-medida/unidades-medida.component';
import { FormUnidadMedidaComponent } from './unidades-medida/form-unidad-medida.component';
import { InsumosComponent } from './insumos/insumos.component';
import { ProductosComponent } from './productos/productos.component';
import { FormInsumoComponent } from './insumos/form-insumo.component';
import { FormProductoComponent } from './productos/form-producto.component';
import { FormInsumoProductoComponent } from './productos/form-insumo-producto.component';
import { FormProductoProductoComponent } from './productos/form-producto-producto.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { FormPedidoComponent } from './pedidos/form-pedido.component';
import { FormInsumoPedidoComponent } from './pedidos/form-insumo-pedido.component';
import { FormProductoPedidoComponent } from './pedidos/form-producto-pedido.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { FormComponent } from './clientes/form.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

  registerLocaleData(localeEs, 'es');

const routes: Routes = [
  {path: '', redirectTo: '/pedidos', pathMatch: 'full'},
  {path: 'tiposInsumo', component: TiposInsumoComponent},
  {path: 'tiposInsumo/form', component: FormTipoInsumoComponent},
  {path: 'tiposInsumo/page', component: TiposInsumoComponent},
  {path: 'tiposInsumo/page/:page', component: TiposInsumoComponent},
  {path: 'tiposInsumo/form/:id', component: FormTipoInsumoComponent},

  {path: 'unidadesMedida', component: UnidadesMedidaComponent},
  {path: 'unidadesMedida/form', component: FormUnidadMedidaComponent},
  {path: 'unidadesMedida/page', component: UnidadesMedidaComponent},
  {path: 'unidadesMedida/page/:page', component: UnidadesMedidaComponent},
  {path: 'unidadesMedida/form/:id', component: FormUnidadMedidaComponent},

  {path: 'insumos', component: InsumosComponent},
  {path: 'insumos/form', component: FormInsumoComponent},
  {path: 'insumos/page', component: InsumosComponent},
  {path: 'insumos/page/:page', component: InsumosComponent},
  {path: 'insumos/nombre/:nombre/page/:page', component: InsumosComponent},
  {path: 'insumos/form/:id', component: FormInsumoComponent},

  {path: 'productos', component: ProductosComponent},
  {path: 'productos/form', component: FormProductoComponent},
  {path: 'productos/page', component: ProductosComponent},
  {path: 'productos/page/:page', component: ProductosComponent},
  {path: 'productos/form/:id', component: FormProductoComponent},

  {path: 'pedidos', component: PedidosComponent},
  {path: 'pedidos/form', component: FormPedidoComponent},
  {path: 'pedidos/page', component: PedidosComponent},
  {path: 'pedidos/page/:page', component: PedidosComponent},
  {path: 'pedidos/form/:id', component: FormPedidoComponent},

  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientes/form', component: FormComponent},
  {path: 'clientes/form/:id', component: FormComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TiposInsumoComponent,
    FormTipoInsumoComponent,
    PaginatorComponent,
    FormTipoInsumoComponent,
    UnidadesMedidaComponent,
    FormUnidadMedidaComponent,
    InsumosComponent,
    ProductosComponent,
    FormInsumoComponent,
    FormProductoComponent,
    FormInsumoProductoComponent,
    FormProductoProductoComponent,
    PedidosComponent,
    FormPedidoComponent,
    FormInsumoPedidoComponent,
    FormProductoPedidoComponent,
    ClientesComponent,
    FormComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    HttpClientModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  entryComponents: [
    FormInsumoProductoComponent,
    FormProductoProductoComponent,
    FormProductoPedidoComponent,
    FormInsumoPedidoComponent
  ],
  providers: [
    ClienteService,
    {provide: LOCALE_ID, useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef,  useValue: { close: (dialogResult: any) => { }}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
