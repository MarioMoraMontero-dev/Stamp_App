import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PremiumPlanPage } from './premium-plan.page';

const routes: Routes = [
  {
    path: '',
    component: PremiumPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PremiumPlanPageRoutingModule {}
