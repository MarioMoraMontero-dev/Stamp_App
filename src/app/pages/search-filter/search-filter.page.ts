import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AddUserFilterDTO } from 'src/app/shared/interfaces/AddUserFilterDTO.interface';
import { CreateJobService } from 'src/app/shared/services/CreateJob/create-job.service';
import { FilterForUserService } from 'src/app/shared/services/FilterForUser/filter-foruser.service';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

declare let H: any;

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.page.html',
  styleUrls: ['./search-filter.page.scss'],
})
export class SearchFilterPage implements OnInit {
  userData: any;
  searchFilterForm: FormGroup;
  isSubmitted = false;
  primaryColour = '#0F857C ';
  isLoading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  languageList: any = [];
  specializationAreaList: any = [];
  languageExpSelect = "BASIC";
  languageSelected = "";
  yrsExperienceList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  salaryRangeSelected = "";
  deviceLocationSelected = "";
  distanceRangeSelected = "";

  salaryValue = 1000;
  distanceValue = 5;

  isSelectOtherLocationPage = false;
  coinSelected: string = "$";
  deviceLocalizationSelected: string = "";
  distanceMetricSelected: string = "KM";
  languageType = "BASIC";

  isSetGPSLocationPage = false;
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  platform: any;
  defaultLayers: any;
  map: any;
  modalErrroBody: string;
  userConfig: any;
  isPremium: boolean = false;
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
    private router: Router,
    public formBuilder: FormBuilder,
    private geolocation: Geolocation,
    private createJobService: CreateJobService,
    private filterForUserService: FilterForUserService,
    private localStorageService: LocalStorageService,
    private platformNative: Platform

  ) {
    this.searchFilterForm = this.formBuilder.group({
      professional_area: ['', [Validators.required]],
      work_from_home: [false, [Validators.required]],
      ready_availability: [false, [Validators.required]],
      legally: [false, [Validators.required]],
    });
  }

  ionViewWillEnter() {
    
    this.subscription = this.platformNative.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.deviceLocalizationSelected = "";
    this.searchFilterForm.reset();
    this.isLoading = true;
    this.filterForUserService.getSearchConfig().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        if (data.data) {
          console.log(data.data);

          this.userConfig = data.data;
          console.log(this.userConfig);
          this.setData();
        }
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log(err);
    })


    this.createJobService.getSpecializationArea().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        if (data.data) {
          this.specializationAreaList = data.data;
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


  setData() {
    this.isLoading = true;
    this.coinSelected = this.userConfig.currency == null ? "$" : this.userConfig.currency;
    this.distanceValue = this.userConfig.max_distance;
    this.salaryValue = this.userConfig.max_salary;
    this.distanceMetricSelected = this.userConfig.max_distance_measure;;
    this.searchFilterForm.controls.legally.setValue(this.userConfig.legally);
    console.log(this.userConfig.professional_area + 'Salida area laboral');
    this.searchFilterForm.controls.professional_area.setValue(this.userConfig.professional_area);
    this.searchFilterForm.controls.ready_availability.setValue(this.userConfig.ready_availability);
    this.searchFilterForm.controls.work_from_home.setValue(this.userConfig.work_from_home);
    this.latitude = this.userConfig.location[0] ? this.userConfig.location[0] : 0;
    this.longitude = this.userConfig.location[1] ? this.userConfig.location[1] : 0;

    if (this.distanceMetricSelected == "KM") {
      this.minValueDistance = "1";
      this.maxValueDistance = "4"
      this.distanceValue = this.getIdxValue(this.listDistanceValueKM, this.distanceValue);
    } else if (this.distanceMetricSelected == "MI") {
      this.minValueDistance = "1";
      this.maxValueDistance = "4"
      this.distanceValue = this.getIdxValue(this.listDistanceValueMI, this.distanceValue);
    }

    if (this.coinSelected == "$") {
      this.minValueMoney = "1";
      this.maxValueMoney = "4"
      this.salaryValue = this.getIdxValue(this.salaryValueDollar, this.salaryValue);
    } else {
      this.minValueMoney = "1";
      this.maxValueMoney = "4"
      this.salaryValue = this.getIdxValue(this.salaryValueColon, this.salaryValue);
    }

    this.isLoading = false;
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
      this.isLoading = false;

      this.map = new H.Map(document.getElementById('map'),
        this.defaultLayers.vector.normal.map, {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 15,
        pixelRatio: window.devicePixelRatio || 1
      });

      window.addEventListener('resize', () => oldThis.map.getViewPort().resize());
      var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(oldThis.map));
      var ui = H.ui.UI.createDefault(oldThis.map, oldThis.defaultLayers, 'en-US');
      this.addDraggableMarker(oldThis.map, behavior, this.latitude, this.longitude);

    }, (err) => {
      this.isLoading = false;
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


  get errorControl() {
    return this.searchFilterForm.controls;
  }

  goBack() {
    this.router.navigateByUrl("/tabs/home");
  }

  selectCoin(value: string) {
    this.coinSelected = value;
  }

  selectDeviceLocalization(value: string) {
    let usInfo = this.localStorageService.getData("userData");
    this.userData =  JSON.parse(usInfo!!);
    if(this.userData.profiles.user.premium === true){
      this.isPremium = this.userData.profiles.user.premium;
    }else {
      this.isPremium = this.userData.profiles.employer.premium;
    }
    
    this.deviceLocalizationSelected = value;
    // Verify if is premium or not
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
      }, (err) => {
        this.isLoading = false;
        this.openModalError("Ocurrió un error al obtener la ubicación del dispositivo. Reintente de nuevo.")
        console.log('Error getting location', err);
      });
    }
  }


  selectDistanceMetric(value: string) {
    this.distanceMetricSelected = value;
  }

  addFilter() {
    this.isSubmitted = true;
    if (!this.searchFilterForm.valid || this.deviceLocalizationSelected == "") {
      return;
    } else {
      if (this.distanceMetricSelected == "KM") {
        this.distanceValue = this.listDistanceValueKM[this.distanceValue - 1];
      } else if (this.distanceMetricSelected == "MI") {
        this.distanceValue = this.listDistanceValueMI[this.distanceValue - 1];
      }

      if (this.coinSelected == "$") {
        this.salaryValue = this.salaryValueDollar[this.salaryValue - 1];
      } else if (this.coinSelected == "₡") {
        this.salaryValue = this.salaryValueColon[this.salaryValue - 1];
      }

      let data: AddUserFilterDTO = {
        legally: this.searchFilterForm.controls.legally.value || false,
        location: this.latitude + "," + this.longitude,
        location_type: '',
        max_distance: this.distanceValue,
        max_distance_measure: this.distanceMetricSelected,
        professional_area: this.searchFilterForm.controls.professional_area.value,
        min_salary: this.salaryValue,
        max_salary: this.salaryValue,
        ready_availability: this.searchFilterForm.controls.ready_availability.value || false,
        work_from_home: this.searchFilterForm.controls.work_from_home.value || false,
        notifications: 'MAIL'
      }

      this.isLoading = true;
      this.filterForUserService.addUserFilter(data).subscribe((resp: any) => {
        this.isLoading = false;
        if (resp.status == 200) {
          this.goBack();

        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
      }, (err) => {
        console.log(err);
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
      })

    }
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorFilter");
    const overlay = document.querySelector("#overlayErrorFilter");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorFilter");
    const overlay = document.querySelector("#overlayErrorFilter");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
    this.goBack();
  }

  openModalPremiumGPS() {
    const modal = document.querySelector("#modalFilter");
    const overlay = document.querySelector("#overlayErrorFilter");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalPremiumGPS() {
    this.deviceLocalizationSelected = "";
    const modal = document.querySelector("#modalFilter");
    const overlay = document.querySelector("#overlayErrorFilter");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  goToPremiumPage() {
    this.closeModalPremiumGPS();
    this.router.navigateByUrl("/premium-plan");
  }

  selectNewLocalization() {
    console.log(this.latitude, this.longitude)
    this.isSetGPSLocationPage = false;
  }

}
