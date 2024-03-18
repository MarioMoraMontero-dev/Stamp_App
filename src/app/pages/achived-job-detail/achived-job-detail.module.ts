import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AchivedJobDetailPageRoutingModule } from './achived-job-detail-routing.module';

import { AchivedJobDetailPage } from './achived-job-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AchivedJobDetailPageRoutingModule
  ],
  declarations: [AchivedJobDetailPage]
})
export class AchivedJobDetailPageModule {}
