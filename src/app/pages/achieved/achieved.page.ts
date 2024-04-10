import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subscription } from 'rxjs';
import { RatingService } from 'src/app/shared/services/Ratings/rating.service';
import { UserJobOfferService } from 'src/app/shared/services/UserJobOffer/user-job-offer.service';



@Component({
  selector: 'app-achieved',
  templateUrl: './achieved.page.html',
  styleUrls: ['./achieved.page.scss'],
})



export class AchievedPage implements OnInit {
  

  jobOffersApplied: any[] = [];
  jobOffersDiscarded:any[] = []
  testText:String = ""
  IsPage: string = "APPLIED";
  isLoading = false;
  primaryColour = "#0F857C ";
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  modalErrroBody: string;
  public form: FormGroup;
  rating: number = 0;


  subscription = new Subscription();

  constructor(
    private userJobOfferService: UserJobOfferService,
    private platform: Platform,
    public router: Router,
    public formBuilder: FormBuilder,
    private ratingService: RatingService
  ) {  
    this.form = this.formBuilder.group({
    rating: [''],
  });
 }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.isLoading = true;
    this.userJobOfferService.getByUser().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.jobOffersApplied = data.data.likes;
        
       
        this.jobOffersDiscarded = data.data.nolikes;
        this.testText = JSON.stringify(this.jobOffersApplied[0]);
      }else{
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log(err);

    })
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  selectApplied() {
    this.IsPage = "APPLIED";
  }

  selectDiscarded() {
    this.IsPage = "DISCARDED";
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorAch");
    const overlay = document.querySelector("#overlayErrorAch");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorAch");
    const overlay = document.querySelector("#overlayErrorAch");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }


  getPublicationDate(date: string) {
    let arrayDate = date.split("T")[0].split("-");
    let dateString = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
    return dateString;
  }


  openInfo(data:any) {
    
    //this.isLoading = true;
this.router.navigate(['achived-job-detail/'+data]);
   
  }

  getRatingData(data: number ) { 
    this.form.controls.rating.setValue(Math.floor(data));
  }


  onRatingChange(rating: number) {
    console.log('Calificación seleccionada:', rating);
    
  }
}
