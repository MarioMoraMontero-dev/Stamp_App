import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentDetailsPageRoutingModule } from './payment-details-routing.module';

import { PaymentDetailsPage } from './payment-details.page';
import { PaypalSubscriptionDirective } from 'src/app/shared/directives/paypal-subscription.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentDetailsPageRoutingModule
  ],
  declarations: [PaymentDetailsPage, PaypalSubscriptionDirective]
})
export class PaymentDetailsPageModule {}
