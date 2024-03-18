import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { addAdsDTO } from 'src/app/shared/interfaces/addAdsDTO.interface';
import { AdsService } from 'src/app/shared/services/Ads/ads.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/Camera/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.page.html',
  styleUrls: ['./advertising.page.scss'],
})
export class AdvertisingPage implements OnInit {
  isListAdsPage = true;
  isCreateAdsPage = false;
  adsForm: FormGroup;
  isSubmitted = false;
  countriesList: any = [];
  adsList: any = [];
  isLoading = false;
  idDeleteAd = '';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  primaryColour = '#00A19A';
  modalErrroBody: string;
  base64Img = "";

  isDeleteADS = false;

  subscription = new Subscription();
  stateListData: any = [];
  photoFile: any;

  constructor(
    public formBuilder: FormBuilder,
    private adsService: AdsService,
    private router: Router,
    private camera: Camera,
    private platform: Platform,

  ) {
    this.adsForm = this.formBuilder.group({
      link: ['', [Validators.required]],
      title: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.photoFile = null;
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.stateListData = [];
    this.adsForm.reset();
    this.isSubmitted = false;
    this.getCountries();
    this.getAds();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  get errorControl() {
    return this.adsForm.controls;
  }

  getCountries() {
    this.isLoading = true;
    this.adsService.getCountries().subscribe(
      (data: any) => {
        if (data.status == 200) {
          if (data.data) {
            this.countriesList = data.data;
          }
        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
        console.log(err);
      }
    );
  }


  getAds() {
    this.adsList = []
    this.isLoading = true;
    this.adsService.getAds().subscribe(
      (data: any) => {
        if (data.status == 200) {
          console.log(data.data);
          for (let i = 0; i < data.data.length; i++) {
            this.adsList.push(data.data[i]);
          }
          
          
          
          
          
         
          
        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
        console.log(err);
      }
    );
  }

  selectCountry() {
    let value = this.adsForm.controls.country.value;
    this.getStates(value);

  }

  getStates(idCountry: string) {
    this.isLoading = true;
    this.adsService.getStates(idCountry).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.status == 200) {
          this.stateListData = data.data;
        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    );
  }

  goBack() {
    if (this.isCreateAdsPage) {
      this.isListAdsPage = true;
      this.isCreateAdsPage = false;
      return;
    }
    this.router.navigateByUrl('/tabs/home');
  }

  createAdsPage() {
    this.isListAdsPage = false;
    this.isSubmitted = false;
    this.adsForm.reset();
    this.base64Img = "";
    this.isCreateAdsPage = true;
  }

  createAds() {
    this.isSubmitted = true;
    if (!this.adsForm.valid) {
      return;
    }
    let data: addAdsDTO = {
      title: this.adsForm.controls.title.value,
      country: this.adsForm.controls.country.value,
      state: this.adsForm.controls.state.value,
      link: this.adsForm.controls.link.value,
      photo: null as any
    }

    this.isLoading = true;
    const form = new FormData();
    form.append("title", data.title);
    form.append("country", data.country);
    form.append("state", data.state);
    form.append("link", data.link);
    if (this.photoFile != null || this.photoFile != undefined) {
      form.append("image", this.photoFile);
    } else {
      form.append("image", undefined as any);
    }
    console.log(JSON.stringify(form))
    this.adsService.createAds(form).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data.status == 200) {
          console.log(data);
          this.goBack();
        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    );
  }

  openPreviewModal() {
    this.isSubmitted = true;
    if (!this.adsForm.valid || this.base64Img == "") {
      return;
    }
    const modal = document.querySelector("#modalPrev");
    const overlay = document.querySelector("#overlayAdds");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeAdsModal() {
    const modal = document.querySelector("#modalPrev");
    const overlay = document.querySelector("#overlayAdds");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }



  openPhotoModal() {
    const modal = document.querySelector("#modalCameraAds");
    const overlay = document.querySelector("#overlayCameraAds");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closePhotoModal() {
    const modal = document.querySelector("#modalCameraAds");
    const overlay = document.querySelector("#overlayCameraAds");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorAds");
    const overlay = document.querySelector("#overlayErrorAds");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorAds");
    const overlay = document.querySelector("#overlayErrorAds");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }


  // from library
  pickImageLibrary() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.isLoading = true;
    this.camera.getPicture(options).then((imageData) => {
      this.isLoading = false;
      this.base64Img = "data:image/jpeg;base64," + imageData;
      getFileImg(this.base64Img).then((data: any) => {
        var file = new File([data], "profile.jpg", { type: "image/jpg", lastModified: new Date().getTime() });
        this.photoFile = file.name[0];
        this.closePhotoModal();
      });
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    });
  }


  // from camera
  pickImageCamera() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.isLoading = true;
    this.camera.getPicture(options).then((imageData) => {
      this.isLoading = false;
      this.base64Img = "data:image/jpeg;base64," + imageData;
      getFileImg(this.base64Img).then((data: any) => {
        var file = new File([data], "profile.jpg", { type: "image/jpg", lastModified: new Date().getTime() });
        this.photoFile = file.name[0];
        this.closePhotoModal()
      });
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    });
  }


  getPublicationDate(date: string) {
    let arrayDate = date.split("T")[0].split("-");
    let dateString = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
    return dateString;
  }



  deleteAdsId(adId: string) {
    this.isDeleteADS = true;
    
    this.openNotificationModal();
    this.idDeleteAd = adId;
    let data = {
      adId: adId
    }
    //this.isLoading = true;
    /*this.offersJobService.removeJobOffer(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.openNotificationModal();
        this.getOffersList();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })*/
  }
  openNotificationModal() {
    console.log('Test');
    const modal = document.querySelector("#modalCameraOfferListADS");
    const overlay = document.querySelector("#overlayCameraOfferListADS");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }
  deleteAds(){
    this.closeNotificationModal();
    
    let data = {
      adId: this.idDeleteAd
    }
    this.isLoading = true;
    console.log(data);
    this.adsService.removeads(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        //this.openNotificationModal();
        this.getAds();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  closeNotificationModal() {
    const modal = document.querySelector("#modalCameraOfferListADS");
    const overlay = document.querySelector("#overlayCameraOfferListADS");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
    
   
      this.isDeleteADS = false;
      
    
      //this.getAds();
    
  }



}


async function getFileImg(base64Img: any): Promise<any> {
  const base64Response = await fetch(base64Img);
  const blob = await base64Response.blob();
  return blob;

}

