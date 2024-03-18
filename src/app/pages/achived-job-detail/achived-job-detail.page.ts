import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RatingService } from 'src/app/shared/services/Ratings/rating.service';

import { UserJobOfferService } from 'src/app/shared/services/UserJobOffer/user-job-offer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-achived-job-detail',
  templateUrl: './achived-job-detail.page.html',
  styleUrls: ['./achived-job-detail.page.scss'],
})
export class AchivedJobDetailPage implements OnInit {
  jobOffer: any[] = [];
  currentOffer: any;
  public form: FormGroup;

  
  constructor(
    private userJobOfferService: UserJobOfferService,
    private activateRouter: ActivatedRoute,
    public formBuilder: FormBuilder,
    private ratingService: RatingService
  ) {  this.form = this.formBuilder.group({
    rating: [''],
  }); }

  ngOnInit() {
    let idOffer = this.activateRouter.snapshot.paramMap.get('id');
    this.getData(idOffer)
    
  }

 



  getData(dataID:any){
    this.userJobOfferService.getOfferById({id:dataID,lang:'es'}).subscribe((data: any) => {
      console.log(JSON.stringify(data));
     
      this.currentOffer = data;
      this.form.controls.rating.setValue(Math.floor(data.data.employer.rating));
    });
  }



  getImgURl(img: string) {
    let photo = environment.apiAmazonStorage + img;
    if (photo.includes(".blob")) {
      return photo.replace(".blob", "")
    }
    if (photo.includes(".jpg")) {
      return photo;
    }
    else {
      return photo + ".jpg";
    }
  }

  getPublicationDate(date: string) {
    let arrayDate = date.split("T")[0].split("-");
    let dateString = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
    return dateString;
  }

}
