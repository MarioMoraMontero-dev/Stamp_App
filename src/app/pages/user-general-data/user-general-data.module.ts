import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserGeneralDataPageRoutingModule } from './user-general-data-routing.module';

import { UserGeneralDataPage } from './user-general-data.page';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UserGeneralDataPageRoutingModule,
    NgxLoadingModule.forRoot({})

  ],
  declarations: [UserGeneralDataPage]
})
export class UserGeneralDataPageModule {}
