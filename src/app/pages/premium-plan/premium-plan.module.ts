import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremiumPlanPageRoutingModule } from './premium-plan-routing.module';

import { PremiumPlanPage } from './premium-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PremiumPlanPageRoutingModule
  ],
  declarations: [PremiumPlanPage]
})
export class PremiumPlanPageModule {}
