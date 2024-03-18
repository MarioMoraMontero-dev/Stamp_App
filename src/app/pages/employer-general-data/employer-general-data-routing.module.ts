import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployerGeneralDataPage } from './employer-general-data.page';

const routes: Routes = [
  {
    path: '',
    component: EmployerGeneralDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployerGeneralDataPageRoutingModule {}
