import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterAccountPage } from './register-account.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAccountPageRoutingModule {}
