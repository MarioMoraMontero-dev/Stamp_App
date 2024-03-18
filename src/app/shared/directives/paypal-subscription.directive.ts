import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { setPremiumDTO } from '../interfaces/setPremiumDTO.interface';
import { LocalStorageService } from '../services/LocalStorage/local-storage.service';
import { PremiumService } from '../services/Premium/premium.service';
declare var paypal :any;

@Directive({
  selector: '[appPaypalSubscription]'
})
export class PaypalSubscriptionDirective implements AfterViewInit  {

  @Input('appPaypalSubscription') paidValue: number;
  constructor(
      private el: ElementRef,
      private premiumService: PremiumService,
      private localStorageService: LocalStorageService,
      private router: Router
  ) { }

  ngAfterViewInit(): void {
    let oldThis = this;
    paypal.Buttons({
        style: {
            layout:  'horizontal',
            color:   'blue',
            shape:   'pill',
            label:   'paypal'
        },
        createOrder: function(data: any, actions: any) {
          console.log("CREATEORDER ", data, actions)
          return actions.order.create({
            purchase_units: [{"amount":{"currency_code":"USD","value": oldThis.paidValue}}]
          });
        },
        // createSubscription: (data: any, actions: any) => {
        //     console.log(data, actions);
        //     return actions.subscription.create({
        //         plan_id: this.planId
        //     });
        // },
        onApprove: (data: any, actions:any) => {
            console.log( "APROVED: ", data, actions);
            let today = new Date();
            let currentDay = today.toLocaleDateString("en-GB");
            let userInfo = JSON.parse(this.localStorageService.getData("userData")!);
            let emailPremium = "";
            if(userInfo.userType == "USER"){
              emailPremium = userInfo.profiles.user.email;
            }else{
              emailPremium = userInfo.profiles.employer.email;
            }
            let premiumData: setPremiumDTO = {
              planType: '',
              orderId: data.orderID,
              payerId: data.payerID,
              paymentSource: data.paymentSource,
              email: emailPremium,
              orderDate: currentDay,
              expirationDate: '',
              timeStampOrder: today.getTime(),
              timeStampExpiration: 0
            }
            console.log(premiumData);
            this.localStorageService.setData("isPremium", "true");
            // this.premiumService.setUserPremium(data);
            this.router.navigateByUrl("/tabs/home")
        },
        onCancel: (data: any, actions: any) => {
          // console.log("OnCancel", data, actions);
        },
        onError: (err: any) => {
          console.log("OnError", err);
        },
        onClick: (data: any, actions: any) => {
        },
    }).render(this.el.nativeElement);
}

}
