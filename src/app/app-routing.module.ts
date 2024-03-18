import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./shared/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'recovery-password',
    loadChildren: () => import('./pages/recovery-password/recovery-password.module').then(m => m.RecoveryPasswordPageModule)
  },
  {
    path: 'register-account',
    loadChildren: () => import('./pages/register-account/register-account.module').then(m => m.RegisterAccountPageModule)
  },
  {
    path: 'stepper-app-first-time',
    loadChildren: () => import('./stepper-app-first-time/stepper-app-first-time.module').then(m => m.StepperAppFirstTimePageModule)
  },
  {
    path: 'premium-plan',
    loadChildren: () => import('./pages/premium-plan/premium-plan.module').then(m => m.PremiumPlanPageModule)
  },
  {
    path: 'paymentDetails/:id',
    loadChildren: () => import('./pages/payment-details/payment-details.module').then( m => m.PaymentDetailsPageModule)
  },
  {
    path: 'create-job',
    loadChildren: () => import('./pages/create-job/create-job.module').then( m => m.CreateJobPageModule)
  },
  {
    path: 'advertising',
    loadChildren: () => import('./pages/advertising/advertising.module').then( m => m.AdvertisingPageModule)
  },
  {
    path: 'cv',
    loadChildren: () => import('./pages/cv/cv.module').then( m => m.CvPageModule)
  },
  {
    path: 'search-filter',
    loadChildren: () => import('./pages/search-filter/search-filter.module').then( m => m.SearchFilterPageModule)
  },
  {
    path: 'achieved',
    loadChildren: () => import('./pages/achieved/achieved.module').then( m => m.AchievedPageModule)
  },
  {
    path: 'user-general-data',
    loadChildren: () => import('./pages/user-general-data/user-general-data.module').then( m => m.UserGeneralDataPageModule)
  },
  {
    path: 'employer-general-data',
    loadChildren: () => import('./pages/employer-general-data/employer-general-data.module').then( m => m.EmployerGeneralDataPageModule)
  },
  {
    path: 'change-profile',
    loadChildren: () => import('./pages/change-profile/change-profile.module').then( m => m.ChangeProfilePageModule)
  },
  {
    path: 'achived-job-detail/:id',
    loadChildren: () => import('./pages/achived-job-detail/achived-job-detail.module').then( m => m.AchivedJobDetailPageModule)
  }

  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
