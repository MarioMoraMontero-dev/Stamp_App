import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfferJobsPage } from './tab3.page';

import { OfferJobsPageRoutingModule } from './tab3-routing.module';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxStarRatingModule } from 'ngx-star-rating';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    NgxStarRatingModule,
    FormsModule,
    ReactiveFormsModule,
    OfferJobsPageRoutingModule,
    NgxLoadingModule.forRoot({}),
    

  ],
  declarations: [OfferJobsPage]
})
export class OfferJobsPageModule {}
