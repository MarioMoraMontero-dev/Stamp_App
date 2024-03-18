import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferJobsPage } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: OfferJobsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferJobsPageRoutingModule {}
