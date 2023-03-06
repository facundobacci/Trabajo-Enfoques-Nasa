import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImagenAstronomicaPageRoutingModule } from './imagen-astronomica-routing.module';

import { ImagenAstronomicaPage } from './imagen-astronomica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagenAstronomicaPageRoutingModule
  ],
  declarations: [ImagenAstronomicaPage]
})
export class ImagenAstronomicaPageModule {}
