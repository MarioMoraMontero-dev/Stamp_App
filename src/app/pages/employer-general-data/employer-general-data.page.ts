import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { EmployerGeneralDataService } from 'src/app/shared/services/EmployerGeneralData/employer-general-data.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { updateEmployerDataDTO } from 'src/app/shared/interfaces/UpdateEmployerDataDTO.interface';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/Camera/ngx';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-employer-general-data',
  templateUrl: './employer-general-data.page.html',
  styleUrls: ['./employer-general-data.page.scss'],
})
export class EmployerGeneralDataPage implements OnInit {


  isSubmitted = false;
  isLoading = false;
  primaryColour = '#00A19A';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  userData: any;
  wrongDay: boolean = false;
  wrongMonth: boolean = false;
  wrongyear: boolean = false;
  birthDateValue = "Fecha de nacimiento";
  incompletedFields: boolean;
  base64Img = "";
  imgObj: any = null;
  modalErrroBody: string = "";

  birthDay: any;
  birthMonth: any;
  birthyear: any;

  latitude: any = 0; //latitude
  longitude: any = 0; //longitude

  updateEmployerForm: FormGroup;
  employerData: any;
  deviceLocalizationSelected: string = "";

  passwordType = "password";
  passwordIcon = "eye-off";
  profileImg: any = "";


  subscription = new Subscription();

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private geolocation: Geolocation,
    private employerGeneralDataService: EmployerGeneralDataService,
    private platform: Platform,
    private camera: Camera,
    public localStorageService: LocalStorageService
  ) {
    this.updateEmployerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      employer_Name: ['', [Validators.required]],
      enterprise_ID: [''],
      photo: [''],
      oldPassword: ['',],
      confirmPassword: [''],
      newPassword: [''],
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.updateEmployerForm.reset();
    let userData = this.localStorageService.getData("userData");
    if (userData) {
      let img = JSON.parse(userData).profiles.employer.photo;
      if (img != "") {
        this.profileImg = environment.apiAmazonStorage + img;
      }
    }
    this.isLoading = true;
    this.employerGeneralDataService.getEmployerData().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.employerData = data.data;
        this.setData();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  setData() {
    this.isLoading = true;
    this.updateEmployerForm.controls.name.setValue(this.employerData.name);
    this.updateEmployerForm.controls.description.setValue(this.employerData.description);
    this.updateEmployerForm.controls.email.setValue(this.employerData.email);
    this.updateEmployerForm.controls.phone_number.setValue(this.employerData.phone_number);
    this.updateEmployerForm.controls.employer_Name.setValue(this.employerData.employer_Name);
    if (this.employerData.enterprise_ID) {
      this.updateEmployerForm.controls.enterprise_ID.setValue(this.employerData.enterprise_ID);
    }
    // this.updateEmployerForm.controls.photo = this.employerData.photo;
    this.isLoading = false;
  }

  get error() {
    return this.updateEmployerForm.controls;
  }

  goBack() {
    this.router.navigateByUrl("tabs/home");
  }

  samePassword() {
    if (this.updateEmployerForm.controls.newPassword.value == this.updateEmployerForm.controls.confirmPassword.value) {
      return true;
    }
    return false;
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorEmployerData");
    const overlay = document.querySelector("#overlayErrorEmployerData");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorEmployerData");
    const overlay = document.querySelector("#overlayErrorEmployerData");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openPhotoModal() {
    const modal = document.querySelector(".modalCamera");
    const overlay = document.querySelector("#overlayCameraEmployerData");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closePhotoModal() {
    const modal = document.querySelector(".modalCamera");
    const overlay = document.querySelector("#overlayCameraEmployerData");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openModalPremiumGPS() {
    const modal = document.querySelector("#modalPremiumEmployerData");
    const overlay = document.querySelector("#overlayCameraEmployerData");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalPremiumGPS() {
    this.deviceLocalizationSelected = "";
    const modal = document.querySelector("#modalPremiumEmployerData");
    const overlay = document.querySelector("#overlayCameraEmployerData");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  goToPremiumPage() {
    this.closeModalPremiumGPS();
    this.router.navigateByUrl("/premium-plan");
  }

  selectDeviceLocalization(value: string) {
    this.deviceLocalizationSelected = value;
    // Verify if is premium or not
    if (value == 'OTHER') {
      this.openModalPremiumGPS();
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
      this.profileImg = "";
      this.base64Img = "data:image/jpeg;base64," + imageData;
      getFileImg(this.base64Img).then((data) => {
        var file = new File([data], "profile.jpg", { type: "image/jpg", lastModified: new Date().getTime() });
        this.imgObj = file.name[0];
        this.closePhotoModal();
      });
    }, (err) => {
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
      console.log("err")
    });
  }

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
      this.profileImg = ""
      this.base64Img = "data:image/jpeg;base64," + imageData;
      getFileImg(this.base64Img).then((data) => {
        var file = new File([data], "profile.jpg", { type: "image/jpg", lastModified: new Date().getTime() });
        this.imgObj = file.name[0];
        this.closePhotoModal()
      });
    }, (err) => {
      this.openModalError("Por favor intenta de nuevo más tarde");
      this.isLoading = false;
    });

  }

  updateData() {
    this.isSubmitted = true;
    if (!this.updateEmployerForm.valid || this.deviceLocalizationSelected == "") {
      return;
    }
    let data: updateEmployerDataDTO = {
      name: this.updateEmployerForm.controls.name.value,
      phone_number: this.updateEmployerForm.controls.phone_number.value,
      employer_Name: this.updateEmployerForm.controls.employer_Name.value,
      enterprise_ID: this.updateEmployerForm.controls.enterprise_ID.value,
      description: this.updateEmployerForm.controls.description.value,
      oldPassword: this.updateEmployerForm.controls.oldPassword.value,
      newPassword: this.updateEmployerForm.controls.newPassword.value
    }
console.log(data)
    const form = new FormData();
    form.append("name", data.name);
    form.append("phone_number", data.phone_number);
    form.append("employer_Name", data.employer_Name);
    if (data.enterprise_ID != null) {
      form.append("enterprise_ID", data.enterprise_ID);
    } else {
      form.append("enterprise_ID", "");
    }
    form.append("description", "");

    if (data.oldPassword != null) {
      form.append("oldPassword", data.oldPassword);
    }
    if (data.newPassword != null) {
      form.append("newPassword", data.newPassword);
    }

    if (this.imgObj != null || this.imgObj != undefined) {
      form.append("photo", this.imgObj);
    } else {
      form.append("photo", undefined as any);
    }

    console.log(form);
    this.isLoading = true;
    this.employerGeneralDataService.updateEmployerData(form).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        let userData = this.localStorageService.getData("userData");
        if (userData) {
          let user = JSON.parse(userData);
          if (user.profiles.employer != "") {
            user.profiles.employer.name = data.data.name;
            if (data.data.photo != "") {
              user.profiles.employer.photo = data.data.photo;
            }
          }
          this.localStorageService.setData("userData", JSON.stringify(user));
        }
        this.goBack();
      } else {
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      if (err.status == 409) {
        this.isLoading = false;
        this.openModalError("La contraseña actual ingresada es incorrecta.");
      } else {
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    })
  }

}

async function getFileImg(base64Img: any): Promise<any> {
  const base64Response = await fetch(base64Img);
  const blob = await base64Response.blob();
  return blob;

}
