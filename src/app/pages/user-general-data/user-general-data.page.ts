import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subscription } from 'rxjs';
import { UpdateUserDataDTO } from 'src/app/shared/interfaces/UpdateUserDataDTO.interface';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { UserGeneralDataService } from 'src/app/shared/services/UserGeneralData/user-general-data.service';
import { environment } from 'src/environments/environment';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/Camera/ngx';

@Component({
  selector: 'app-user-general-data',
  templateUrl: './user-general-data.page.html',
  styleUrls: ['./user-general-data.page.scss'],
})
export class UserGeneralDataPage implements OnInit {

  isSubmitted = false;
  isLoading = false;
  primaryColour = '#0F857C ';
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
  updateUserForm: FormGroup;
  profileImg: any = "";

  passwordType = "password";
  passwordIcon = "eye-off"
  subscription = new Subscription();


  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public userGeneralDataService: UserGeneralDataService,
    public localStorageService: LocalStorageService,
    private platform: Platform,
    private camera: Camera

  ) {
    this.updateUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birth_date: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      phtoto: [''],
      oldPassword: ['',],
      confirmPassword: [''],
      newPassword: [''],
      notifications: ['']
    });

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.imgObj = null;
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.updateUserForm.reset();
    let userData = this.localStorageService.getData("userData");
    if (userData) {
      let img = JSON.parse(userData).profiles.user.photo;
      if (img != "") {
        this.profileImg = environment.apiAmazonStorage + img;
      }
    }
    this.isLoading = true;
    this.userGeneralDataService.getUserData().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.userData = data.data;
        this.setData();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
        this.goBack();
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

  setData() {
    this.isLoading = true;
    this.updateUserForm.controls.name.setValue(this.userData.name);
    this.updateUserForm.controls.last_name.setValue(this.userData.last_name);
    this.updateUserForm.controls.email.setValue(this.userData.email);
    this.updateUserForm.controls.phone_number.setValue(this.userData.phone_number);
    this.updateUserForm.controls.notifications.setValue(this.userData.notifications);
    let formattedDateArray = this.userData.birth_date.split("T")[0].split("-");
    if (formattedDateArray) {
      this.birthDay = formattedDateArray[2];
      this.birthMonth = formattedDateArray[1];
      this.birthyear = formattedDateArray[0];
      this.birthDateValue = this.birthDay + "/" + this.birthMonth + "/" + this.birthyear;
      this.updateUserForm.controls.birth_date.setValue(this.birthDateValue);
    }
    this.isLoading = false;
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

  get error() {
    return this.updateUserForm.controls;
  }

  goBack() {
    this.router.navigateByUrl("tabs/home");
  }

  openPhotoModal() {
    const modal = document.querySelector("#modalCameraUser");
    const overlay = document.querySelector("#overlayCameraUser");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closePhotoModal() {
    const modal = document.querySelector("#modalCameraUser");
    const overlay = document.querySelector("#overlayCameraUser");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openDateModal() {
    const modal = document.querySelector("#modaDateUser");
    const overlay = document.querySelector("#overlayDateUser");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeDateModal() {
    const modal = document.querySelector("#modaDateUser");
    const overlay = document.querySelector("#overlayDateUser");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorUserGeneral");
    const overlay = document.querySelector("#overlayErrorUserGeneral");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorUserGeneral");
    const overlay = document.querySelector("#overlayErrorUserGeneral");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
    this.goBack();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
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

  setBirthDate() {
    this.wrongDay = false;
    this.wrongMonth = false;
    this.wrongyear = false;
    this.incompletedFields = false;

    if (this.birthDay && this.birthMonth && this.birthyear) {
      if (Number.isNaN(this.birthDay) || (this.birthDay == 0 || this.birthDay > 31)) {
        this.wrongDay = true;
        return;
      }
      if (Number.isNaN(this.birthMonth) || (this.birthMonth == 0 || this.birthMonth > 12)) {
        this.wrongMonth = true;
        return;
      }

      if (Number.isNaN(this.birthyear) || (this.birthyear < 1900)) {
        this.wrongyear = true;
        return;
      }

      this.birthDateValue = this.birthDay + "/" + this.birthMonth + "/" + this.birthyear;
      this.updateUserForm.controls.birth_date.setValue(this.birthDateValue);
      this.closeDateModal();
    } else {
      this.incompletedFields = true;
    }
  }

  samePassword() {
    if (this.updateUserForm.controls.newPassword.value == this.updateUserForm.controls.confirmPassword.value) {
      return true;
    }
    return false;
  }


  updateData() {
    this.isSubmitted = true;
    if (!this.updateUserForm.valid) {
      return;
    }
    let data: UpdateUserDataDTO = {
      name: this.updateUserForm.controls.name.value,
      last_name: this.updateUserForm.controls.last_name.value,
      email: this.updateUserForm.controls.email.value,
      birth_date: this.updateUserForm.controls.birth_date.value,
      phone_number: this.updateUserForm.controls.phone_number.value,
      oldPassword: this.updateUserForm.controls.oldPassword.value,
      newPassword: this.updateUserForm.controls.newPassword.value,
      notifications: this.updateUserForm.controls.notifications.value,
    }

    const form = new FormData();
    form.append("name", data.name);
    form.append("last_name", data.last_name);
    form.append("email", data.email);
    form.append("birth_date", data.birth_date);
    form.append("phone_number", data.phone_number);
    if (data.oldPassword != null) {
      form.append("oldPassword", data.oldPassword);
    }
    if (data.newPassword != null) {
      form.append("newPassword", data.newPassword);
    }
    form.append("notifications", data.notifications);

    if (this.imgObj != null || this.imgObj != undefined) {
      form.append("photo", this.imgObj);
    } else {
      form.append("photo", undefined as any);
    }
    this.isLoading = true;

    this.userGeneralDataService.updateUserData(form).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        let userData = this.localStorageService.getData("userData");
        if (userData) {
          let user = JSON.parse(userData);
          if (user.profiles.user != "") {
            user.profiles.user.name = data.data.name + " " + data.data.last_name;
            if (data.data.photo != "") {
              user.profiles.user.photo = data.data.photo;
            }
          }
          this.localStorageService.setData("userData", JSON.stringify(user));
        }
        this.goBack();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }

    }, (err) => {
      this.isLoading = false;
      if (err.status == 409) {
        this.openModalError("La contraseña actual ingresada es incorrecta.");
      } else {
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