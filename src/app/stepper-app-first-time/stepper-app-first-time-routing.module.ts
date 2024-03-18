import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepperAppFirstTimePage } from './stepper-app-first-time.page';

const routes: Routes = [
  {
    path: '',
    component: StepperAppFirstTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepperAppFirstTimePageRoutingModule {}
