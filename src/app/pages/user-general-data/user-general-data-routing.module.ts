import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserGeneralDataPage } from './user-general-data.page';

const routes: Routes = [
  {
    path: '',
    component: UserGeneralDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGeneralDataPageRoutingModule {}
