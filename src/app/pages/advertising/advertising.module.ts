import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdvertisingPageRoutingModule } from './advertising-routing.module';

import { AdvertisingPage } from './advertising.page';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AdvertisingPageRoutingModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [AdvertisingPage]
})
export class AdvertisingPageModule {}
