import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateJobPage } from './create-job.page';

const routes: Routes = [
  {
    path: '',
    component: CreateJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateJobPageRoutingModule {}
