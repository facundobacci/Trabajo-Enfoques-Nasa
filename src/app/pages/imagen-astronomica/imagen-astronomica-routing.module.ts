import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImagenAstronomicaPage } from './imagen-astronomica.page';

const routes: Routes = [
  {
    path: '',
    component: ImagenAstronomicaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagenAstronomicaPageRoutingModule {}
