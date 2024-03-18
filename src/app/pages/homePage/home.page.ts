import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { RatingService } from 'src/app/shared/services/Ratings/rating.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tab1',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  userData: any;
  bodyTitle: string = "";
  currentStep = 0;
  public form: FormGroup;
  isPremium = true;
  hasRating = false;

  

  subscription = new Subscription();
  constructor(
    public localStorageService: LocalStorageService,
    private router: Router,
    private platform: Platform,
    public formBuilder: FormBuilder,
    private ratingService: RatingService
  ) {
    this.form = this.formBuilder.group({
      rating: [''],
    });
  }


  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })

    setInterval(() => {
      let userInfo = this.localStorageService.getData("userData");
      this.currentStep = 0;
      if (userInfo) {
        this.userData = JSON.parse(userInfo);
        if (this.userData.userType == "EMPLOYER") {
          this.bodyTitle = "Búsqueda de personal"
          this.currentStep = this.userData.profiles.employer.currentStep;
          if (!this.hasRating) {
            this.getRatingUser("EMPLOYER")
          }
        } else {
          this.bodyTitle = "Búsqueda de empleo"
          this.currentStep = this.userData.profiles.user.currentStep;
          if (!this.hasRating) {
            this.getRatingUser("USER")
          }
        }
      }
    }, 1000);
  }

  
  getRatingUser(type: string) {
    
    this.hasRating = true;
    if (type == "USER") {
      this.isPremium = this.userData.profiles.user.premium;
      this.form.controls.rating.setValue(Math.floor(this.userData.profiles.user.rate));
      return;
      // Hace falta el id del user 
      this.ratingService.getRatingUser({ user: "userId" }).subscribe((data: any) => {
        console.log(data);
        if (data.status == 200) {
          if (data.data.length == 0) {
            this.form.controls.rating.setValue(0);
          }
        }
      }, (err) => {
        console.log(err);
        this.form.controls.rating.setValue(0);
      })
    } else if (type == "EMPLOYER") {
      console.log(this.userData.profiles.employer.premium);
      this.isPremium = this.userData.profiles.employer.premium;
      this.form.controls.rating.setValue(Math.floor(this.userData.profiles.employer.rate));
      return;
      // Hace falta el id del employer 
      /*this.ratingService.getRatingEmployer({employer: "employerId"}).subscribe((data: any) => {
            if(data.status == 200){
              this.form.controls.rating.setValue(4); // VALUE FROM API 
            }else{
              this.openModalError("Ocurrió un error para obtener la calificación actual.")
            }
            this.isLoading = false;
            console.log(data);
          }, (err) => {
            this.isLoading = false;
            this.openModalError("Ocurrió un error para obtener la calificación actual.")
            console.log(err);
          })*/
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  changeProfile() {
    this.router.navigateByUrl("/change-profile");
  }

  getProfileImage(): string {
    if (this.userData.userType == "EMPLOYER") {
      if (!this.userData.profiles.employer.photo) {
        return "../../../assets/images/ic_profile_company.png";
      }
      return environment.apiAmazonStorage + this.userData.profiles.employer.photo;
    }
    if (this.userData.userType == "USER") {
      if (!this.userData.profiles.user.photo) {
        return "../../../assets/images/ic_profile_candidate.png";
      }
      return environment.apiAmazonStorage + this.userData.profiles.user.photo;
    }
    return "";
  }

  getPremiumPage() {
    this.router.navigateByUrl("/premium-plan");
  }

  createJobPage() {
    this.router.navigateByUrl("/create-job");
  }

  advertisingPage() {
    this.router.navigateByUrl("/advertising");
  }

  cvPage() {
    this.router.navigateByUrl("/cv");
  }

  userGeneralDataPage() {
    this.router.navigateByUrl("/user-general-data")
  }

  employerInfoPage() {
    this.router.navigateByUrl("/employer-general-data")

  }

  searchFilter() {
    this.router.navigateByUrl("/search-filter");
  }

  logoutApp() {
    this.localStorageService.deleteData("userData");
    this.localStorageService.deleteData("__paypal_storage__");
    this.router.navigateByUrl("/login");
  }

}
