import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../../pages/homePage/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../../pages/tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../../pages/offerJobs/tab3.module').then(m => m.OfferJobsPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../../pages/offerJobs/tab3.module').then(m => m.OfferJobsPageModule)
      },
      {
        path: 'achieved',
        loadChildren: () => import('../../pages/achieved/achieved.module').then(m => m.AchievedPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
