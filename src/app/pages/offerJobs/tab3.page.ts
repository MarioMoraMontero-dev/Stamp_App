import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { OffersJobService } from 'src/app/shared/services/OffersJob/offers-job.service';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CreateJobService } from 'src/app/shared/services/CreateJob/create-job.service';
import { updateJobOfferDTO } from 'src/app/shared/interfaces/UpdateJobOfferDTO.interface';
import { AddUserLanguageDTO } from 'src/app/shared/interfaces/addUserLanguageDTO.interface';
import { setMatchEmployer } from 'src/app/shared/interfaces/setMatchEmployer.interface';
import { RatingService } from 'src/app/shared/services/Ratings/rating.service';
import { addCalificationForUserDTO } from 'src/app/shared/interfaces/addCalificationForUserDTO.interface';
import { ReportService } from 'src/app/shared/services/Report/report.service';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
declare let H: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class OfferJobsPage {
  offerList: any = [];
  editJobForm: FormGroup;
  public form: FormGroup;
  public ratingForm: FormGroup;
  reportForm: FormGroup;
  userData:any;
  idOfferDelete = '';
  isDelete = false;
  isSubmitted = false;
  isLoading = false;
  isUpdateOfferPage = false;
  primaryColour = '#0F857C ';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  modalErrroBody: string;
  candidatesList: any = [];
  candidatesListSelected: any = [];
  isCandidateListPage: boolean = false;
  noCandidatesText: string = "";

  sSelectOtherLocationPage = false;
  coinSelected: string = "COLON";
  deviceLocalizationSelected: string = "";
  distanceMetricSelected: string = "KM";
  languageType = "BASIC";

  languageList: any = [];
  specializationAreaList: any = [];
  languageExpSelect = "BASIC";
  languageSelected = "";
  yrsExperienceList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  salaryRangeSelected = "";
  deviceLocationSelected = "";
  distanceRangeSelected = "";

  isSetGPSLocationPage = false;
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  platform: any;
  defaultLayers: any;
  map: any;
  otherLang: string = "";
  listLanguageSelected: any = [];
  address: any;
  isPremium: boolean = false;
  incompletedFields = false;

  salaryValue = 1000;
  distanceValue = 5;
  editOfferId: string;
  isUsingMatch: boolean;
  isUserInfoPage = false;
  titleText = "Ofertas de empleo";
  currentCandidate: any;
  isCalificateUserPage: boolean;
  isReportPage: boolean = true;
  subscription = new Subscription();


  maxValueDistance = ""
  minValueDistance = ""
  minValueMoney = "";
  maxValueMoney = "";

  listDistanceValueKM = [5, 10, 25, 50];
  listDistanceValueMI = [3.1, 6.2, 15.5, 31];

  salaryValueColon = [300000, 1000000, 1500000, 1500000];
  salaryValueDollar = [1000, 2000, 4000, 4000];


  constructor(
    public localStorageService: LocalStorageService,
    private router: Router,
    public formBuilder: FormBuilder,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private createJobService: CreateJobService,
    private offersJobService: OffersJobService,
    private ratingService: RatingService,
    private reportService: ReportService,
    private platformNative: Platform,

  ) {
    this.editJobForm = this.formBuilder.group({
      job_name: ['', [Validators.required]],
      job_identifier: ['', [Validators.required]],
      professional_area: ['', [Validators.required]],
      work_from_home: [false],
      salary: [''],
      job_description: ['', [Validators.required]],
      ready_availability: [false],
      experience: ['', [Validators.required]],
      travelAvailability: [false],
      knowledge: ['', [Validators.required]],
      require_criminal_record: [false],
      requires_license: [false],
    });

    this.form = this.formBuilder.group({
      rating: ['', [Validators.required]],
    })


    this.ratingForm = this.formBuilder.group({
      rating1: [0],
      rating2: [0],
      rating3: [0],
      rating4: [0],
      inputData: [""]
    });

    this.reportForm = this.formBuilder.group({
      complaint: ["", [Validators.required]],
    });

    this.editJobForm.reset();
    this.editJobForm.controls.ready_availability.setValue(false);
    this.editJobForm.controls.work_from_home.setValue(false);
    this.editJobForm.controls.travelAvailability.setValue(false);
    this.editJobForm.controls.require_criminal_record.setValue(false);
    this.editJobForm.controls.requires_license.setValue(false);
  }

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  }


  ionViewWillEnter() {
    this.subscription = this.platformNative.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.isReportPage = false;
    this.isUserInfoPage = false;
    this.isUsingMatch = false;
    this.isSetGPSLocationPage = false;
    this.editJobForm.reset()
    this.isUpdateOfferPage = false;
    this.getOffersList();
  }

  get errorControl() {
    return this.editJobForm.controls;
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  goToPremiumPage() {
    this.closeModalPremiumGPS();
    this.router.navigateByUrl("/premium-plan");
  }

  goExplorePage() {
    this.closeNotificationModal();
    this.editJobForm.reset()
    this.isUpdateOfferPage = false;
    this.getOffersList();
  }

  getOffersList() {
    this.isCandidateListPage = false;
    this.offerList = [];
    this.isLoading = true;
    this.offersJobService.getOffersJob().subscribe((data: any) => {
      this.isLoading = false;
      console.log(data);
      if (data.status == 200) {
        this.offerList = data.data;
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log(this.latitude, this.longitude)
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  GetGPS() {
    this.isLoading = true;
    let oldThis = this;
    this.geolocation.getCurrentPosition().then((resp) => {
      if (this.latitude == 0 && this.longitude == 0) {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
      }

      this.platform = new H.service.Platform({
        apikey: "-TdRGCNhzAro85dyXmdqC40d3YnbDOd5FdyyJouKr5Y"
      });
      this.defaultLayers = this.platform.createDefaultLayers();
      oldThis.isLoading = false;
      this.map = new H.Map(document.getElementById('map'),
        this.defaultLayers.vector.normal.map, {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 15,
        pixelRatio: window.devicePixelRatio || 1
      });

      window.addEventListener('resize', () => oldThis.map.getViewPort().resize());
      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(oldThis.map));
      var ui = H.ui.UI.createDefault(oldThis.map, oldThis.defaultLayers, 'en-US');
      oldThis.addDraggableMarker(oldThis.map, behavior, this.latitude, this.longitude);

    }, (err) => {
      oldThis.isLoading = false;
      this.openModalError("Ocurrió un error al obtener la ubicación del dispositivo. Reintente de nuevo.")
      console.log('Error getting location', err);
    })

  }

  addDraggableMarker(map: any, behavior: any, lat: number, lon: number) {
    var marker = new H.map.Marker({ lat: lat, lng: lon }, {
      volatility: true
    });
    marker.draggable = true;
    map.addObject(marker);

    let oldThis = this;
    map.addEventListener('dragstart', function (ev: any) {
      var target = ev.target,
        pointer = ev.currentPointer;
      if (target instanceof H.map.Marker) {
        var targetPosition = map.geoToScreen(target.getGeometry());
        target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
        behavior.disable();
      }
    }, false);
    map.addEventListener('dragend', function (ev: any) {
      var target = ev.target;
      if (target.a.lat && target.a.lng) {
        oldThis.latitude = target.a.lat;
        oldThis.longitude = target.a.lng
      }

      if (target instanceof H.map.Marker) {
        behavior.enable();
      }
    }, false);

    map.addEventListener('drag', function (ev: any) {
      var target = ev.target,
        pointer = ev.currentPointer;
      if (target instanceof H.map.Marker) {
        target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
      }
    }, false);
  }

  logoutApp() {
    this.localStorageService.deleteData("userData");
    this.localStorageService.deleteData("isPremium");
    this.localStorageService.deleteData("__paypal_storage__");
    this.router.navigateByUrl("/login");
  }

  goCreateOfferPage() {
    this.router.navigateByUrl("/create-job")
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalError");
    const overlay = document.querySelector("#overlayError");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalError");
    const overlay = document.querySelector("#overlayError");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  deleteJobOffer(jobId: string) {
    this.isDelete = true;
    this.openNotificationModal();
    this.idOfferDelete = jobId;
    let data = {
      job_id: jobId
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

  deleteOffer(){
    this.closeNotificationModal();
    let data = {
      job_id: this.idOfferDelete
    }
    this.isLoading = true;
    this.offersJobService.removeJobOffer(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        //this.openNotificationModal();
        this.getOffersList();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  openNotificationModal() {
    console.log('Test');
    const modal = document.querySelector("#modalCameraOfferList");
    const overlay = document.querySelector("#overlayCameraOfferList");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closeNotificationModal() {
    const modal = document.querySelector("#modalCameraOfferList");
    const overlay = document.querySelector("#overlayCameraOfferList");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
    if (this.isUpdateOfferPage) {
      this.editJobForm.reset();
      this.isUpdateOfferPage = false;
      this.getOffersList()
    } else if (this.isUsingMatch) {
      this.isUsingMatch = false;
      this.getOffersList();
      this.isUserInfoPage = false;
    }
    else if (this.isCalificateUserPage) {
      this.isCalificateUserPage = false;
      this.isUserInfoPage = false;
      this.ratingForm.reset();
      this.titleText = "Ofertas de empleo ";
      this.getOffersList();
    }
  }

  editJobOffer(jobId: string) {
    this.isUpdateOfferPage = true;
    this.distanceMetricSelected = "";
    this.deviceLocationSelected = "";
    this.coinSelected = "";
    let data = {
      id: jobId
    }
    this.isLoading = true;
    this.offersJobService.getOfferJobDetails(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.editOfferId = jobId;
        this.getFullData();
        this.setEditData(data.data);
        this.isUpdateOfferPage = true;
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  setEditData(data: any) {
    
    this.editJobForm.controls.professional_area.setValue(data.professional_area._id);
    this.editJobForm.controls.job_name.setValue(data.job_name);
    this.editJobForm.controls.job_description.setValue(data.job_description);
   
    this.editJobForm.controls.experience.setValue(data.experience);
    this.editJobForm.controls.job_identifier.setValue(data.job_identifier);
    this.editJobForm.controls.knowledge.setValue(data.knowledge);

    this.editJobForm.controls.ready_availability.setValue(data.ready_availability != undefined ? data.ready_availability : false);
    this.editJobForm.controls.work_from_home.setValue(data.work_from_home != undefined ? data.work_from_home : false);
    this.editJobForm.controls.travelAvailability.setValue(data.travelAvailability != undefined ? data.travelAvailability : false);
    this.editJobForm.controls.require_criminal_record.setValue(data.require_criminal_record != undefined ? data.require_criminal_record : false);
    this.editJobForm.controls.requires_license.setValue(data.requires_license != undefined ? data.requires_license : false);
    this.salaryValue = data.salary;
    this.coinSelected = data.salaryCurrency;
    this.distanceMetricSelected = data.max_distance_measure;
    this.distanceValue = data.max_distance;
    this.listLanguageSelected = data.languages;
    console.log(data);
    
    if (this.distanceMetricSelected == "KM") {
      this.minValueDistance = "1";
      this.maxValueDistance = "4" 
      this.distanceValue = this.getIdxValue(this.listDistanceValueKM, this.distanceValue);
    } else if (this.distanceMetricSelected == "MI") {
      this.minValueDistance = "1";
      this.maxValueDistance = "4"
      this.distanceValue = this.getIdxValue(this.listDistanceValueMI, this.distanceValue);
    }

    if (this.coinSelected == "USD") {
      this.minValueMoney = "1";
      this.maxValueMoney = "4"
      this.salaryValue = this.getIdxValue(this.salaryValueDollar, this.salaryValue);
    } else {
      this.minValueMoney = "1";
      this.maxValueMoney = "4"
      this.salaryValue = this.getIdxValue(this.salaryValueColon, this.salaryValue);
    }
  }

  getIdxValue(listDistanceValueKM: number[], distanceValue: number): number {
    for (let index = 0; index < listDistanceValueKM.length; index++) {
      const element = listDistanceValueKM[index];
      if (element == Number(distanceValue)) {
        return index + 1;
      }
    }
    return 1;
  }




  updateJobOffer() {
    this.isSubmitted = true;
    if (!this.editJobForm.valid) {
      return;
    }
    if (this.deviceLocalizationSelected == "") {
      return;
    }

    if (this.distanceMetricSelected == "KM") {
      this.distanceValue = this.listDistanceValueKM[this.distanceValue - 1];
    } else if (this.distanceMetricSelected == "MI") {
      this.distanceValue = this.listDistanceValueMI[this.distanceValue - 1];
    }

    if (this.coinSelected == "USD") {
      this.salaryValue = this.salaryValueDollar[this.salaryValue - 1];
    } else if (this.coinSelected == "COLON") {
      this.salaryValue = this.salaryValueColon[this.salaryValue - 1];
    }

    
    let data: updateJobOfferDTO = {
      professional_area: this.editJobForm.controls.professional_area.value,
      job_name: this.editJobForm.controls.job_name.value,
      job_identifier: this.editJobForm.controls.job_identifier.value,
      job_description: this.editJobForm.controls.job_description.value,
      max_distance: this.distanceValue,
      salary: this.salaryValue,
      work_from_home: this.editJobForm.controls.work_from_home.value,
      ready_availability: this.editJobForm.controls.ready_availability.value,
      location: this.latitude + "," + this.longitude,
      locationName: this.address,
      experience: Number(this.editJobForm.controls.experience.value),
      travelAvailability: this.editJobForm.controls.travelAvailability.value,
      knowledge: this.editJobForm.controls.knowledge.value,
      require_criminal_record: this.editJobForm.controls.require_criminal_record.value,
      requires_license: this.editJobForm.controls.requires_license.value,
      salaryCurrency: this.coinSelected == "USD" ? "USD" : "CRC", //COLON or DOLAR
      max_distance_measure: this.distanceMetricSelected,
      languages: this.getLanguageForEdit(),
      licenses: [],
      job_id: this.editOfferId
    }
    this.isLoading = true;

    this.offersJobService.updateJobOffer(data).subscribe((resp: any) => {
      this.isLoading = false;
      if (resp.status == 200) {
        this.openNotificationModal()
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");

      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.openModalError("Por favor intenta de nuevo más tarde");
    })

  }


  getLanguageForEdit(): any {
    let arr = []
    for (let index = 0; index < this.listLanguageSelected.length; index++) {
      const element = this.listLanguageSelected[index];
      if (element.language._id) {
        let lang: AddUserLanguageDTO = {
          language: element.language._id,
          type: element.type,
          level: element.level,
        }
        arr.push(lang);
      } else {
        arr.push(element);
      }
    }
    return arr;

  }


  addUserLanguage() {
    let add = this.isLanguageSelected();
    if (!add) {
      let data: AddUserLanguageDTO = {
        language: this.otherLang,
        type: "OTHER",
        level: this.languageType
      }
      this.listLanguageSelected.push(data);
    }
  }

  isLanguageSelected() {
    if (this.listLanguageSelected.length == 0) {
      return false;
    }
    for (let index = 0; index < this.listLanguageSelected.length; index++) {
      const element = this.listLanguageSelected[index];
      let langId = "";
      if (element.language._id) {
        langId = element.language._id;
      } else {
        langId = element.language;
      }
      if (langId == this.otherLang) {
        return true;
      }
    }
    return false;
  }

  removeUserLanguage(id: string) {
    this.listLanguageSelected = this.listLanguageSelected.filter(((l: { language: string; }) => l.language != id))
  }

  getLanguageName(lang: any) {
    let langId = "";
    if (lang.language._id) {
      langId = lang.language._id;
    } else {
      langId = lang.language;
    }
    let langSelected = this.languageList.filter((l: { _id: any; }) => l._id == langId);
    if (langSelected) {
      return langSelected[0].name;
    }
  }

  getFullData() {
    this.listLanguageSelected = [];
    this.isLoading = true;
    this.createJobService.getLanguages().subscribe((data: any) => {
      if (data.data) {
        this.languageList = data.data;
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log(err);
    })
    this.isLoading = true;
    this.createJobService.getSpecializationArea().subscribe((data: any) => {
      this.isLoading = false;
      if (data.data) {
        this.specializationAreaList = data.data;
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log(err);
    })
  }

  clickMoreInfoOffer(offer: any) {
    this.isLoading = true;
    this.isCandidateListPage = false;

    let data = { id: offer.job_id };
    this.offersJobService.getdetailsWithUsers(data).subscribe((data: any) => {
      this.isLoading = false;
      console.log(data);
      if (data.status == 200) {
        this.candidatesList = data.data;
        this.isCandidateListPage = true;
        this.selectTabNew();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }


  selectTabNew() {
    this.candidatesListSelected = this.candidatesList.pending;
    this.noCandidatesText = "No hay candidatos nuevos"
  }

  selectTabNotified() {
    this.candidatesListSelected = this.candidatesList.matches;
    this.noCandidatesText = "No has notificado a ningún candidato"
  }

  selectTabDiscarded() {
    this.candidatesListSelected = this.candidatesList.nomatches;
    this.noCandidatesText = "No has descartado a ningún candidato"
  }

  goBack() {
    this.isCandidateListPage = false;
    this.isUpdateOfferPage = false;
    this.isUserInfoPage = false;
    this.titleText = "Ofertas de empleo";
    if (this.isCalificateUserPage) {
      this.isCalificateUserPage = false;
      this.isUserInfoPage = true;
      this.titleText = "Información de la persona";
    } if (this.isReportPage) {
      this.isReportPage = false;
      this.titleText = "Información de la persona";
      this.isUserInfoPage = true;
    }
  }

  selectDistanceMetric(value: string) {
    this.distanceMetricSelected = value;
  }

  selectNewLocalization() {
    console.log(this.latitude, this.longitude)
    this.isSetGPSLocationPage = false;
    this.getAddress();
  }

  selectCoin(value: string) {
    this.coinSelected = value;
  }

  clickSelect() {
    this.isLoading = true;
    setInterval(() => {
      let el = document.getElementsByTagName("ion-list")[0]
      if (el != undefined) {
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }

    }, 300);
  }

  selectDeviceLocalization(value: string) {
    let usInfo = this.localStorageService.getData("userData");
    this.userData =  JSON.parse(usInfo!!);
    console.log(this.userData);
    if(this.userData.profiles.user.premium === true){
      this.isPremium = this.userData.profiles.user.premium;
    }else {
      this.isPremium = this.userData.profiles.employer.premium;
    }
    this.deviceLocalizationSelected = value;
    if (value == 'OTHER') {
      if (!this.isPremium) {
        this.openModalPremiumGPS();
      } else {
        this.isSetGPSLocationPage = true;
        this.GetGPS()
      }
    } else if (value == "PHONE") {
      this.isLoading = true;
      this.geolocation.getCurrentPosition().then((resp) => {
        this.isLoading = false;
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.getAddress();
      }, (err: any) => {
        this.isLoading = false;
        this.deviceLocalizationSelected = "";
        this.openModalError("Ocurrió un error al obtener la ubicación del dispositivo. Reintente de nuevo.")
        console.log('Error getting location', err);
      });
    }
  }


  // get address using coordinates
  getAddress() {
    this.isLoading = true;
    this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, this.nativeGeocoderOptions)
      .then((res: any[]) => {
        this.isLoading = false;
        if (res[0].addressLines[0]) {
          this.address = res[0].addressLines[0];
        } else {
          this.address = res[0].administrativeArea;
        }
        console.log(this.address);
      })
      .catch((error: any) => {
        this.isLoading = false;
      });
  }

  openModalPremiumGPS() {
    const modal = document.querySelector("#modalPremiumOfferList");
    const overlay = document.querySelector("#overlayCameraOfferList");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalPremiumGPS() {
    this.deviceLocalizationSelected = "";
    const modal = document.querySelector("#modalPremiumOfferList");
    const overlay = document.querySelector("#overlayCameraOfferList");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  matchCandidate(matchValue: string, candidate: any) {
    console.log(candidate);
    this.isUsingMatch = true;
    let data: setMatchEmployer = {
      offerLike: candidate._id,
      employerRes: matchValue
    }
    this.isLoading = true;
    this.offersJobService.matchCandidate(data).subscribe((resp: any) => {
      this.isLoading = false;
      console.log(resp);
      if (resp.status == 200) {
        if (data.employerRes == "MATCH") {
          this.openNotificationModal();
        } else {
          this.isUsingMatch = false;
          this.isUserInfoPage = false;
          this.getOffersList();
        }
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  showInfoUser(candidate: any) {
    this.isUserInfoPage = true;
    this.currentCandidate = candidate;
    console.log(this.currentCandidate);
    this.form.setValue({ rating: 0 });
    this.titleText = "Información de la persona";
    this.ratingService.getRatingUser({ user: this.currentCandidate._id }).subscribe((data: any) => {
      console.log(data);
      if (data.status == 200) {
        if (data.data.length == 0) {
          this.form.controls.rating.setValue(0);
        }
      }
    }, (err) => {
      console.log(err);
      this.openModalError("Ocurrió un error al obtener la calificación actual.");
      this.form.controls.rating.setValue(0);
    })
  }

  calificateUsePage() {
    this.isUserInfoPage = false;
    this.titleText = "Calificar Persona";
    this.ratingForm.controls.rating1.setValue(0);
    this.ratingForm.controls.rating2.setValue(0);
    this.ratingForm.controls.rating3.setValue(0);
    this.ratingForm.controls.rating4.setValue(0);
    this.isCalificateUserPage = true;
  }

  sendCalification() {
    this.incompletedFields = false;
     if (
      this.ratingForm.controls.rating1.value == 0 ||
      this.ratingForm.controls.rating2.value == 0 ||
      this.ratingForm.controls.rating3.value == 0 ||
      this.ratingForm.controls.rating4.value == 0
    ) {
      this.incompletedFields = true;
      return;
    }

    let data: addCalificationForUserDTO = {
      diciplina: this.ratingForm.controls.rating4.value,
      user: this.currentCandidate.user._id,
      puntualidad: this.ratingForm.controls.rating3.value,
      observaciones: this.ratingForm.controls.inputData.value,
      habilidad: this.ratingForm.controls.rating1.value,
      presentacion: this.ratingForm.controls.rating2.value,
    }
    console.log(data);

    this.isLoading = true;
    this.ratingService.addRatingUser(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.openNotificationModal();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde. Recuerda que no puedes evaluar al mismo usuario más de una vez.");
      console.log(err);
    })
  }

  report() {
    this.isReportPage = true;
    this.isUserInfoPage = false;
    this.titleText = "Denunciar";
  }

  doReport() {
    this.isSubmitted = true;
    let data = {
      user: this.currentCandidate.user._id,
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

  get error() {
    return this.reportForm.controls;
  }
}
