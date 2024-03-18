import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CvPageRoutingModule } from './cv-routing.module';
import { NgxLoadingModule } from 'ngx-loading';

import { CvPage } from './cv.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    NgxLoadingModule.forRoot({}),
    CvPageRoutingModule
  ],
  declarations: [CvPage]
})
export class CvPageModule {}
