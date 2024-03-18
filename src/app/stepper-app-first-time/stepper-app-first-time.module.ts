import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepperAppFirstTimePageRoutingModule } from './stepper-app-first-time-routing.module';

import { StepperAppFirstTimePage } from './stepper-app-first-time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepperAppFirstTimePageRoutingModule
  ],
  declarations: [StepperAppFirstTimePage]
})
export class StepperAppFirstTimePageModule {}
