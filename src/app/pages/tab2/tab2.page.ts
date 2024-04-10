import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subscription } from 'rxjs';
import { addCalificationForEmployerDTO } from 'src/app/shared/interfaces/addCalificationForEmployerDTO.interface';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { RatingService } from 'src/app/shared/services/Ratings/rating.service';
import { ReportService } from 'src/app/shared/services/Report/report.service';
import { UserJobOfferService } from 'src/app/shared/services/UserJobOffer/user-job-offer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  isLoading = false;
  primaryColour = "#0F857C ";
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  modalErrroBody: string;
  offerList: any = [];

  public form: FormGroup;
  public ratingForm: FormGroup;
  reportForm: FormGroup;


  isPremium = false;
  isCalificateEmployerPage = false;
  titleText = "Explorar Coincidencias";
  currentOffer: any;
  idx = 0;
  incompletedFields = false;
  isInfoEmployerPage: boolean = false;
  isReportPage: boolean = false;
  isSubmitted = false;

  subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    private userJobOfferService: UserJobOfferService,
    private localStorageService: LocalStorageService,
    private ratingService: RatingService,
    private reportService: ReportService,
    private platform: Platform

  ) {
    this.form = this.fb.group({
      rating: [''],
    })

    this.ratingForm = this.fb.group({
      rating: [0],
      rating2: [0],
      rating3: [0],
      rating4: [0],
      rating5: [0],
      inputData: [""]
    });

    this.reportForm = this.fb.group({
      complaint: ["", [Validators.required]],
    });
  }

  get error() {
    return this.reportForm.controls;
  }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.isInfoEmployerPage = false;
    this.isReportPage = false;

    this.isCalificateEmployerPage = false;
    this.ratingForm.reset();
    this.offerList = [];
    let premiumValue = this.localStorageService.getData("isPremium");
    if (premiumValue) {
      if (premiumValue == "true") {
        this.isPremium = true;
      } else {
        this.isPremium = false;
      }
    }
    this.getOfferList();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }


  getOfferList() {
    this.isLoading = true;
    this.titleText = "Explorar Coincidencias";
    this.userJobOfferService.getOffers().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        console.log(data);
        this.offerList = data.data;
        if (this.offerList.length > 0) {

          this.idx = 0;
          this.currentOffer = this.offerList[0];
          if (this.currentOffer.data.adData) {
            this.titleText = "Publicidad";
          } else {
            this.titleText = "Explorar Coincidencia";
            this.form.setValue({ rating: Math.floor(this.currentOffer.data.employer.rate) });
          }
        }
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log(err);
    })
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorUserOffer");
    const overlay = document.querySelector("#overlayErrorUserOffer");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorUserOffer");
    const overlay = document.querySelector("#overlayErrorUserOffer");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  onChanges() {
    this.form.valueChanges.subscribe(val => {
      console.log("Test ratint", this.form.get('rating')?.value);
    });
  }

  changeRating(value: number) {
    this.form.setValue({ rating: value });
  }

  goBack() {
    if (this.isCalificateEmployerPage) {
      this.isCalificateEmployerPage = false;
    } else if (this.isReportPage) {
      this.isReportPage = false;
      this.isInfoEmployerPage = true;
      this.reportForm.reset();
    } else if (this.isInfoEmployerPage) {
      this.isInfoEmployerPage = false;
    }
    // this.router.navigateByUrl('/login');
  }

  calificar() {
    this.titleText = "Calificar Empresa";
    this.ratingForm.controls.rating.setValue(0);
    this.ratingForm.controls.rating2.setValue(0);
    this.ratingForm.controls.rating3.setValue(0);
    this.ratingForm.controls.rating4.setValue(0);
    this.ratingForm.controls.rating5.setValue(0);
    this.isCalificateEmployerPage = true;
  }
  

  openInfo() {
    this.isInfoEmployerPage = true;
    //this.isLoading = true;

    // El servicio no responde y rompe el API al correlo , arreglar API
    /*
    this.ratingService.getRatingEmployer({ employer: this.currentOffer.data.employer._id }).subscribe((data: any) => {
      console.log(data);
      
      if (data.status == 200) {
        this.form.controls.rating.setValue(4); // VALUE FROM API 
      } else {
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

  share() {
    console.log("Sharing info.");
  }

  getPublicationDate(date: string) {
    let arrayDate = date.split("T")[0].split("-");
    let dateString = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
    return dateString;
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
      if (photo.includes(".png")) {
        return photo;
      }
      else {
        return photo + ".png";
      }
      
    }
    
  }

  goToUrl(url: string) {
    window.open(url, '_blank');
  }

  likejobOffer(offer: any) {
    this.isLoading = true;
    let data = { jobOffer: offer._id }
    this.userJobOfferService.likeJobOffer(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.nextOffer()
        this.openNotificationModal();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log(err);
    })
  }

  noLikeJobOffer(offer: any) {
    this.isLoading = true;
    let data = { jobOffer: offer._id }
    this.userJobOfferService.dislikeJobOffer(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        console.log(data);
        this.nextOffer()
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log(err);
    })
  }

  openNotificationModal() {
    const modal = document.querySelector("#modalUserOffer");
    const overlay = document.querySelector("#overlayUserOffer");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closeNotificationModal() {
    const modal = document.querySelector("#modalUserOffer");
    const overlay = document.querySelector("#overlayUserOffer");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
    if (this.isCalificateEmployerPage) {
      this.isCalificateEmployerPage = false;
      this.goBack();
    }
  }

  getLanguagesList() {
    let lang = "";
    for (let index = 0; index < this.currentOffer.data.languages.length; index++) {
      const element = this.currentOffer.data.languages[index];
      lang = lang == "" ? element.language.name : lang + "," + element.language.name;
    }
    return lang;
  }

  nextOffer() {
    if (this.idx < this.offerList.length) {
      if (this.idx + 1 < this.offerList.length) {
        this.idx = this.idx + 1;
      }
      this.currentOffer = this.offerList[this.idx];
      if (this.currentOffer.data.adData) {
        this.titleText = "Publicidad";
      } else {
        this.titleText = "Explorar Coincidencia";
        this.form.setValue({ rating: this.currentOffer.data.employer.rate[0] });
        console.log("COLOCA rating", this.form.controls.rating.value);

      }
      this.idx = this.idx + 1;
    } else {
      this.getOfferList();
    }
  }

  sendCalification() {
    this.incompletedFields = false;

    if (
      this.ratingForm.controls.rating.value == 0 ||
      this.ratingForm.controls.rating2.value == 0 ||
      this.ratingForm.controls.rating3.value == 0 ||
      this.ratingForm.controls.rating4.value == 0 ||
      this.ratingForm.controls.rating5.value == 0
    ) {
      this.incompletedFields = true;
      return;
    }


    let data: addCalificationForEmployerDTO = {
      employer: this.currentOffer.data.employer._id,
      instalaciones: this.ratingForm.controls.rating2.value,
      profesionalismo: this.ratingForm.controls.rating.value,
      beneficios: this.ratingForm.controls.rating3.value,
      manejoPersonal: this.ratingForm.controls.rating4.value,
      competitividad: this.ratingForm.controls.rating5.value,
      observaciones: this.ratingForm.controls.inputData.value
    }
    this.isLoading = true;

    this.ratingService.addRatingEmployer(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.openNotificationModal();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde. Recuerda que no puedes evaluar el mismo empleador más de una vez.");
      console.log(err);
    })

  }

  report() {
    this.titleText = "Denunciar"
    this.isInfoEmployerPage = false;
    this.isReportPage = true;
  }

  doReport() {
    this.isSubmitted = true;
    let data = {
      employer: this.currentOffer.data._id,
      complaint: this.reportForm.controls.complaint.value
    }
    console.log(data);
    this.isLoading = true;
    this.reportService.addReportEmployer(data).subscribe((data) => {
      console.log(data);

    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })

  }

}
