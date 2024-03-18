import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployerGeneralDataPageRoutingModule } from './employer-general-data-routing.module';

import { EmployerGeneralDataPage } from './employer-general-data.page';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EmployerGeneralDataPageRoutingModule,
    NgxLoadingModule.forRoot({})

  ],
  declarations: [EmployerGeneralDataPage]
})
export class EmployerGeneralDataPageModule {}
