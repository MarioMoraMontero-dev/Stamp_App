import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AchivedJobDetailPage } from './achived-job-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AchivedJobDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AchivedJobDetailPageRoutingModule {}
