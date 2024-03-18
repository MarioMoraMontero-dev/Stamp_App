import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';

@Component({
  selector: 'app-premium-plan',
  templateUrl: './premium-plan.page.html',
  styleUrls: ['./premium-plan.page.scss'],
})
export class PremiumPlanPage implements OnInit {

  premiumPlanPage = 1;
  planImage: any;
  userData: any;
  subscription = new Subscription();


  constructor(
    private sanitizer: DomSanitizer,
    public localStorageService: LocalStorageService,
    private router: Router,
    private platform: Platform
  ) { }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    let userInfo = this.localStorageService.getData("userData");
    if (userInfo) {
      this.userData = JSON.parse(userInfo);
      if (this.userData.userType == "EMPLOYER") {
        this.planImage = this.sanitizer.bypassSecurityTrustStyle('url("/assets/images/Plan_bronze_empresa.png")');
        this.premiumPlanPage = 1;
      } else {
        this.planImage = this.sanitizer.bypassSecurityTrustStyle('url("/assets/images/Plan_premium_persona.png")');
        this.premiumPlanPage = 0;
      }
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }


  ngOnInit() {
  }

  nextPremiumPage() {
    if (this.premiumPlanPage == 3) {
      return;
    }
    this.premiumPlanPage = this.premiumPlanPage + 1;
    this.setNewBackgroundImage();
  }

  backPremiumPage() {
    if (this.premiumPlanPage == 1) {
      return;
    }
    this.premiumPlanPage = this.premiumPlanPage - 1;
    this.setNewBackgroundImage();
  }

  goBack() {
    this.router.navigateByUrl("/tabs/home");
  }

  setNewBackgroundImage() {
    switch (this.premiumPlanPage) {
      case 1:
        this.planImage = this.sanitizer.bypassSecurityTrustStyle('url("/assets/images/Plan_bronze_empresa.png")');
        break;
      case 2:
        this.planImage = this.sanitizer.bypassSecurityTrustStyle('url("/assets/images/Plan_plata_empresa.png")');
        break;
      case 3:
        this.planImage = this.sanitizer.bypassSecurityTrustStyle('url("/assets/images/Plan_oro_empresa.png")');
        break;
      default:
        break;
    }
  }

  getMoreDetailsPage() {
    this.router.navigateByUrl("/paymentDetails/"+ this.premiumPlanPage);
  }

}
