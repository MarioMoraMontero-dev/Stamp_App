import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxStarRatingModule } from 'ngx-star-rating';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxStarRatingModule,
    Tab2PageRoutingModule,
    NgxLoadingModule.forRoot({})

  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule { }
