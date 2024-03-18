import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
// import { PaypalPlans } from 'src/app/shared/interfaces/paypalPlans.interface';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage implements OnInit {

  planId: any
  premiumTime: string;
  premiumPrice = 0;
  subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform
    ) { }



  ngOnInit() {
  }
  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.planId = this.route.snapshot.paramMap.get('id');
    this.premiumTime = "mensual";
    this.getPremiumPrice(this.planId);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  getPremiumPrice(planId: string) {
    switch (planId) {
      case "0":
        if (this.premiumTime == "mensual") {
          this.premiumPrice = 10;
        } else if (this.premiumTime == "trimestre") {
          this.premiumPrice = 28;
        } else if (this.premiumTime == "semestre") {
          this.premiumPrice = 50;
        } else if (this.premiumTime == "anual") {
          this.premiumPrice = 100;
        }
        break;
      case "1":
        if (this.premiumTime == "mensual") {
          this.premiumPrice = 10;
        } else if (this.premiumTime == "trimestre") {
          this.premiumPrice = 28;
        } else if (this.premiumTime == "semestre") {
          this.premiumPrice = 50;
        } else if (this.premiumTime == "anual") {
          this.premiumPrice = 100;
        }
        break;
      case "2":
        if (this.premiumTime == "mensual") {
          this.premiumPrice = 20;
        } else if (this.premiumTime == "trimestre") {
          this.premiumPrice = 58;
        } else if (this.premiumTime == "semestre") {
          this.premiumPrice = 110;
        } else if (this.premiumTime == "anual") {
          this.premiumPrice = 220;
        }
        break
      case "3":
        if (this.premiumTime == "mensual") {
          this.premiumPrice = 30;
        } else if (this.premiumTime == "trimestre") {
          this.premiumPrice = 88;
        } else if (this.premiumTime == "semestre") {
          this.premiumPrice = 150;
        } else if (this.premiumTime == "anual") {
          this.premiumPrice = 300;
        }
        break
      default:
        break;
    }
  }

  pay() {

  }

  goBack() {
    this.router.navigateByUrl("/premium-plan");
  }

}
