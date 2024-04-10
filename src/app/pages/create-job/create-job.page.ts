import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subscription } from 'rxjs';
import { AddUserLanguageDTO } from 'src/app/shared/interfaces/addUserLanguageDTO.interface';
import { CreateJobDTO } from 'src/app/shared/interfaces/createJobDTO.interface';
import { CreateJobService } from 'src/app/shared/services/CreateJob/create-job.service';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';

declare let H: any;

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.page.html',
  styleUrls: ['./create-job.page.scss'],
})
export class CreateJobPage implements OnInit {
  createJobForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  primaryColour = '#0F857C ';
  salaryValue = 1000;
  distanceValue = 1;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  languageList: any = [];
  specializationAreaList: any = [];
  languageExpSelect = "BASIC";
  languageSelected = "";
  yrsExperienceList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  salaryRangeSelected = "";
  deviceLocationSelected = "";
  distanceRangeSelected = "";

  isSelectOtherLocationPage = false;
  coinSelected: string = "COLON";
  deviceLocalizationSelected: string = "";
  distanceMetricSelected: string = "KM";
  languageType = "BASIC";

  moneda: string = '';
  isSetGPSLocationPage = false;
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  platform: any;
  defaultLayers: any;
  map: any;
  modalErrroBody: string;
  otherLang: string = "";
  listLanguageSelected: any = [];
  address: any;
  isPremium: boolean = false;
  subscription = new Subscription();

  maxValueDistance = ""
  minValueDistance = ""
  minValueMoney = "";
  maxValueMoney = "";
  searchTerm: string = '';
  searchResults: any[] = [];
  
  userData: any;

  listDistanceValueKM = [5, 10, 25, 50];
  listDistanceValueMI = [3.1, 6.2, 15.5, 31];

  salaryValueColon = [300000, 1000000, 1500000, 1500000];
  salaryValueDollar = [1000, 2000, 4000, 4000];

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private createJobService: CreateJobService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private platformNative: Platform,
    private localStorageService: LocalStorageService,
  

  ) {
    this.createJobForm = this.formBuilder.group({
      job_name: ['', [Validators.required]],
      job_identifier: ['', [Validators.required]],
      professional_area: ['', [Validators.required]],
      work_from_home: [false],
      salary: [''],
      job_description: ['', [Validators.required]],
      ready_availability: [false],
      experience: ['', [Validators.required]],
      travelAvailability: [false],
      changeResidence: [false],
      knowledge: ['', [Validators.required]],
      require_criminal_record: [false],
      requires_license: [false],
      locationSearch: ['']
    });
    this.createJobForm.reset();
    this.createJobForm.controls.ready_availability.setValue(false);
    this.createJobForm.controls.work_from_home.setValue(false);
    this.createJobForm.controls.travelAvailability.setValue(false);
    this.createJobForm.controls.require_criminal_record.setValue(false);
    this.createJobForm.controls.requires_license.setValue(false);
  }

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  ionViewWillEnter() {
    this.subscription = this.platformNative.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.minValueDistance = "1";
    this.maxValueDistance = "4"
    this.minValueMoney = "1";
    this.maxValueMoney = "4"
    this.salaryValue = 1;
    this.distanceValue = 1;

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
        // this.createJobForm.controls.professional_area.setValue(this.specializationAreaList[0]._id)
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

  ngOnInit() {

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

  goBack() {
    this.router.navigateByUrl('/tabs/home');
  }

  goExplorePage() {
    this.router.navigateByUrl('/tabs/home');
  }

  get errorControl() {
    return this.createJobForm.controls;
  }

  createJob() {
    this.isSubmitted = true;
    if (!this.createJobForm.valid) {
      return;
    }

    if (this.distanceMetricSelected == "KM") {
      this.distanceValue = this.listDistanceValueKM[this.distanceValue - 1];
    } else if (this.distanceMetricSelected == "MI") {
      this.distanceValue = this.listDistanceValueMI[this.distanceValue - 1];
    }
   
    if (this.coinSelected == "DOLAR") {
      this.moneda = 'USD';
      this.salaryValue = this.salaryValueDollar[this.salaryValue - 1];
    } else if (this.coinSelected == "COLON") {
      this.moneda = 'CRC';

      this.salaryValue = this.salaryValueColon[this.salaryValue - 1];
    }

    let data: CreateJobDTO = {
      job_name: this.createJobForm.controls.job_name.value,
      max_distance: this.distanceValue,
      job_identifier: this.createJobForm.controls.job_identifier.value,
      location: this.latitude + "," + this.longitude,
      professional_area: this.createJobForm.controls.professional_area.value,
      work_from_home: this.createJobForm.controls.work_from_home.value || false,
      salary: this.salaryValue,
      job_description: this.createJobForm.controls.job_description.value,
      ready_availability: this.createJobForm.controls.ready_availability.value || false,
      experience: this.createJobForm.controls.experience.value,
      travelAvailability: this.createJobForm.controls.travelAvailability.value || false,
      knowledge: this.createJobForm.controls.knowledge.value,
      require_criminal_record: this.createJobForm.controls.require_criminal_record.value || false,
      requires_license: this.createJobForm.controls.requires_license.value || false,
      languages: this.listLanguageSelected,
      locationName: this.address,
      licenses: [],
      max_distance_measure: this.distanceMetricSelected,
      salaryCurrency: this.moneda
    };


    
    if (this.latitude == "" || this.longitude == "") {
      this.deviceLocalizationSelected = "";
      return;
    }
    this.isLoading = true;
    console.log(JSON.stringify(data));
    this.createJobService.createJobOffer(data).subscribe((data: any) => {
      this.isLoading = false;
      
      if (data.status == 200) {
        this.createJobForm.reset();
        this.listLanguageSelected = [];
        this.openNotificationModal();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.openModalError("Por favor intenta de nuevo más tarde");
    })

  }

  openNotificationModal() {
    const modal = document.querySelector("#modalCameraCreatejob");
    const overlay = document.querySelector("#overlayCameraCreateJob");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closeNotificationModal() {
    const modal = document.querySelector("#modalCameraCreatejob");
    const overlay = document.querySelector("#overlayCameraCreateJob");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
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
      if (element.language == this.otherLang) {
        return true;
      }
    }
    return false;
  }

  removeUserLanguage(id: string) {
    this.listLanguageSelected = this.listLanguageSelected.filter(((l: { language: string; }) => l.language != id))
  }

  getLanguageName(lang: any) {
    let langSelected = this.languageList.filter((l: { _id: any; }) => l._id == lang.language)
    return langSelected[0].name;
  }


  openModalPremiumGPS() {
    const modal = document.querySelector("#modalPremiumCreateJob");
    const overlay = document.querySelector("#overlayCameraCreateJob");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalPremiumGPS() {
    this.deviceLocalizationSelected = "";
    const modal = document.querySelector("#modalPremiumCreateJob");
    const overlay = document.querySelector("#overlayCameraCreateJob");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorCreateJob");
    const overlay = document.querySelector("#overlayErrorCreateJob");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorCreateJob");
    const overlay = document.querySelector("#overlayErrorCreateJob");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  addLanguage() {

  }


  selectLocation(location:any) {
    // Captura la longitud y latitud de la ubicación seleccionada
    const latitude = location.geometry.location.lat;
    const longitude = location.geometry.location.lng;
    
    // Haz lo que necesites con estas coordenadas, como guardarlas en una base de datos o mostrarlas en pantalla.
  }



  selectNewLocalization() {
    console.log(this.latitude, this.longitude)
    this.isSetGPSLocationPage = false;
    this.getAddress();
  }

  selectCoin(value: string) {
    this.coinSelected = value;
  }

  selectDeviceLocalization(value: string) {
    let usInfo = this.localStorageService.getData("userData");
    this.userData =  JSON.parse(usInfo!!);
    console.log(this.userData);
    this.isPremium = this.userData.profiles.employer.premium;
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
      }, (err) => {
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

  selectDistanceMetric(value: string) {
    this.distanceMetricSelected = value;
  }

  goToPremiumPage() {
    this.closeModalPremiumGPS();
    this.router.navigateByUrl("/premium-plan");
  }

}
