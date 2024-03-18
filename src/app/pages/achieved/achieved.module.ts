import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AchievedPageRoutingModule } from './achieved-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { AchievedPage } from './achieved.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
     ReactiveFormsModule,
    AchievedPageRoutingModule,
    NgxLoadingModule.forRoot({})

  ],
  declarations: [AchievedPage]
})
export class AchievedPageModule {}
