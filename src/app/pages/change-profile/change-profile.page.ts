import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { Platform, ToastController } from '@ionic/angular';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subscription } from 'rxjs';
import { EmployerSignUpDTO } from 'src/app/shared/interfaces/employerSignUpDTO.interface';
import { UserSignUpDTO } from 'src/app/shared/interfaces/userSignUpDTO.interface';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { SignupAccountService } from 'src/app/shared/services/SignUpAccount/signup-account.service';
import { Utils } from 'src/app/utils/Utils';


@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.page.html',
  styleUrls: ['./change-profile.page.scss'],
})
export class ChangeProfilePage implements OnInit {

  isSelectView = true;
  isSubmitted = false;
  primaryColour = "#0F857C ";
  isLoading = false;

  birthDay: any;
  birthMonth: any;
  birthyear: any;

  subscription = new Subscription();
  headerTitle = "";
  userData: any;
  userSignUpForm: FormGroup;
  companySignUpForm: FormGroup;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  wrongDay: boolean = false;
  wrongMonth: boolean = false;
  wrongyear: boolean = false;
  birthDateValue = "Fecha de nacimiento";
  incompletedFields: boolean;
  base64Img = "";
  imgObj: any = null;
  modalErrroBody: string = "";

  passwordType = "password";
  passwordIcon = "eye-off"
  signUpPage: string = "";

  constructor(
    public localStorageService: LocalStorageService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController,
    public formBuilder: FormBuilder,
    public signupAccountService: SignupAccountService
  ) {
    this.userSignUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      notifications: ['', [Validators.required]]
    });

    this.companySignUpForm = this.formBuilder.group({
      companyName: ['', [Validators.required, Validators.required]],
      description: ['', [Validators.required, Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      enterprise_ID: [''],
      employerName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.signUpPage = "";
    this.userSignUpForm.reset();
    this.companySignUpForm.reset();
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    });
    this.headerTitle = "Perfil";
    let userInfo = this.localStorageService.getData("userData");
    if (userInfo) {
      this.userData = JSON.parse(userInfo);
      if (this.userData.userType == "EMPLOYER") {
        // this.bodyTitle = "Búsqueda de personal"
      } else {
        // this.bodyTitle = "Búsqueda de empleo"
      }
    }
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  goBack() {
    this.router.navigateByUrl("/tabs/home");
  }

  createUserType(type: string) {
    if (type == this.userData.userType) {
      this.presentToast();
      return;
    } else {
      if (type == "EMPLOYER") {
        if (this.userData.profiles.employer.email !== undefined) {
          this.userData.userType = "EMPLOYER";
          this.localStorageService.setData("userData", JSON.stringify(this.userData))
          this.router.navigateByUrl("/tabs/home")
        } else {
          this.companySignUpForm.controls.email.setValue(this.userData.profiles.user.email)
          this.signUpPage = "EMPLOYER";
          return;
        }
      } else if (type == "USER") {
        if (this.userData.profiles.user.email !== undefined) {
          // change
          this.userData.userType = "USER";
          this.localStorageService.setData("userData", JSON.stringify(this.userData))
          this.router.navigateByUrl("/tabs/home")
        } else {
          this.userSignUpForm.controls.email.setValue(this.userData.profiles.employer.email)
          this.signUpPage = "USER";
          return;
        }
      }
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usted ya tiene el perfil seleccionado',
      duration: 2000,
      position: "bottom"
    });

    await toast.present();
  }

  // from library
  async pickImageLibrary() {
    try {
      this.isLoading = true;

      const response = await Utils.takeOrPickImage(CameraSource.Photos);
      const {imgObj, base64Img} = response;
      this.base64Img = base64Img;
      this.imgObj = imgObj;
      this.isLoading = false;
      this.closePhotoModal()
    } catch (error) {
      console.log("🚀 ~ ChangeProfilePage ~ pickImageLibrary ~ error:", error)
      this.isLoading = false;
    }
  }


  // from camera
  async pickImageCamera() {
    try {
      this.isLoading = true;

      const response = await Utils.takeOrPickImage(CameraSource.Camera);
      const { imgObj, base64Img } = response;
      this.base64Img = base64Img;
      this.imgObj = imgObj;
      this.isLoading = false;
      this.closePhotoModal()
    } catch (error) {
      console.log("🚀 ~ ChangeProfilePage ~ pickImageCamera ~ error:", error)
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    }
  }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  get errorControlCompanyForm() {
    return this.companySignUpForm.controls;
  }

  get errorControlUserForm() {
    return this.userSignUpForm.controls;
  }


  isValidDate() {
    return false;
  }


  openPhotoModal() {
    const modal = document.querySelector(".modalCamera");
    const overlay = document.querySelector("#overlayCameraA");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closePhotoModal() {
    const modal = document.querySelector(".modalCamera");
    const overlay = document.querySelector("#overlayCameraA");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openDateModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector("#overlayDateA");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeDateModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector("#overlayDateA");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }


  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorRegisterAcc");
    const overlay = document.querySelector("#overlayErrorRegisterA");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorRegisterAcc");
    const overlay = document.querySelector("#overlayErrorRegisterA");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  registerUserAccount() {
    this.isSubmitted = true;
    if (!this.userSignUpForm.valid) {
      return;
    }
    let json: UserSignUpDTO = {
      name: this.userSignUpForm.controls.name.value,
      last_name: this.userSignUpForm.controls.lastName.value,
      email: this.userSignUpForm.controls.email.value,
      password: this.userSignUpForm.controls.password.value,
      birth_date: this.userSignUpForm.controls.birthDate.value,
      phone_number: this.userSignUpForm.controls.phoneNumber.value,
      notifications: this.userSignUpForm.controls.notifications.value,
      photo: undefined
    }

    const form = new FormData();
    form.append("name", json.name);
    form.append("last_name", json.last_name);
    form.append("email", json.email);
    form.append("password", json.password);
    form.append("birth_date", json.birth_date);
    form.append("phone_number", json.phone_number);
    form.append("notifications", json.notifications);

    if (this.imgObj != null || this.imgObj != undefined) {
      form.append("photo", this.imgObj);
    } else {
      form.append("photo", undefined as any);
    }

    this.isLoading = true;
    this.signupAccountService.registerUserFromEmployer(form).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.setUserEmployer(data.data, json);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.openModalError("Por favor intenta de nuevo más tarde");
      this.isLoading = false;
    })
  }

  setUserEmployer(data: any, json: UserSignUpDTO) {
    this.userData.userType = "EMPLOYER";
    this.userData.profiles.user.name = json.name;
    this.userData.profiles.user.email = json.email;
    this.userData.profiles.user.photo = data.photo;
    this.userData.profiles.user.rate = 0;
    this.userData.profiles.user.currentStep = 1;
    this.localStorageService.setData("userData", JSON.stringify(this.userData));
    this.router.navigateByUrl("/tabs/home");
  }

  registerEmployerAccount() {
    this.isSubmitted = true;
    if (!this.companySignUpForm.valid) {
      return;
    }
    let json: EmployerSignUpDTO = {
      photo: undefined,
      name: this.companySignUpForm.controls.companyName.value,
      email: this.companySignUpForm.controls.email.value,
      password: this.companySignUpForm.controls.password.value,
      phone_number: this.companySignUpForm.controls.phoneNumber.value,
      employer_Name: this.companySignUpForm.controls.employerName.value,
      enterprise_ID: this.companySignUpForm.controls.enterprise_ID.value,
      description: this.companySignUpForm.controls.description.value,
    }
    this.isLoading = true;

    const form = new FormData();
    form.append("name", json.name);
    form.append("email", json.email);
    form.append("password", json.password);
    form.append("phone_number", json.phone_number);
    form.append("employer_Name", json.employer_Name);
    if (json.enterprise_ID != null) {
      form.append("enterprise_ID", json.enterprise_ID);
    } else {
      form.append("enterprise_ID", undefined as any);
    }
    form.append("description", json.description);

    if (this.imgObj != null || this.imgObj != undefined) {
      form.append("photo", this.imgObj);
    } else {
      form.append("photo", undefined as any);
    }


    this.signupAccountService.registerEmployerFromUser(form).subscribe((data: any) => {
      this.isLoading = false;
      console.log(data);

      if (data.status == 200) {
        this.setEmployerData(data.data, json);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err: any) => {
      console.log(err);

      this.openModalError("Por favor intenta de nuevo más tarde");
      this.isLoading = false;
    })
  }

  setEmployerData(data: any, json: EmployerSignUpDTO) {
    this.userData.userType = "EMPLOYER";
    this.userData.profiles.employer.name = json.name;
    this.userData.profiles.employer.email = json.email;
    this.userData.profiles.employer.photo = data.photo;
    this.userData.profiles.employer.rate = 0;
    this.userData.profiles.employer.currentStep = 1;
    this.localStorageService.setData("userData", JSON.stringify(this.userData));
    this.router.navigateByUrl("/tabs/home");
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
      this.userSignUpForm.controls.birthDate.setValue(this.birthDateValue);
      this.closeDateModal();
    } else {
      this.incompletedFields = true;
    }
  }
}
