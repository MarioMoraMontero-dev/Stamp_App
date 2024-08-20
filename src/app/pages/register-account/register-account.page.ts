import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { UserSignUpDTO } from 'src/app/shared/interfaces/userSignUpDTO.interface';
import { SignupAccountService } from 'src/app/shared/services/SignUpAccount/signup-account.service';
import { EmployerSignUpDTO } from 'src/app/shared/interfaces/employerSignUpDTO.interface';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { Utils } from 'src/app/utils/Utils';
import { CameraSource } from '@capacitor/camera';



@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.page.html',
  styleUrls: ['./register-account.page.scss'],
})
export class RegisterAccountPage implements OnInit {
  isSelectView = true;
  isSubmitted = false;
  primaryColour = "#0F857C ";
  isLoading = false;
  headerTitle = "Stamp"

  birthDay: any;
  birthMonth: any;
  birthyear: any;

  signUpPage = "";
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
  subscription = new Subscription();

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public signupAccountService: SignupAccountService,
    private platform: Platform,
    private localStorageService: LocalStorageService

  ) {
    this.userSignUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      notifications: ['', [Validators.required]],
      terms: ['', [Validators.required]]
    });

    this.companySignUpForm = this.formBuilder.group({
      companyName: ['', [Validators.required, Validators.required]],
      description: ['', [Validators.required, Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      enterprise_ID: [''],
      employerName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      terms: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.signUpPage = "";
    this.isSubmitted = false;
    this.userSignUpForm.reset();
    this.companySignUpForm.reset();
    this.base64Img = "";
    this.imgObj = null;
    this.modalErrroBody = "";
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
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
      console.log("🚀 ~ RegisterAccountPage ~ pickImageLibrary ~ error:", error)
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    }
  }


  // from camera
  async pickImageCamera() {
    try {
      this.isLoading = true;

      const response = await Utils.takeOrPickImage(CameraSource.Camera);
      const {imgObj, base64Img} = response;
      this.base64Img = base64Img;
      this.imgObj = imgObj;
      this.isLoading = false;
      this.closePhotoModal()
    } catch (error) {
      console.log("🚀 ~ RegisterAccountPage ~ pickImageCamera ~ error:", error)
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

  goBack() {
    if (this.signUpPage != "") {
      this.companySignUpForm.reset();
      this.userSignUpForm.reset();
      this.signUpPage = "";
      this.headerTitle = "Stamp";
    } else {
      this.goToLoginPage();
    }
  }

  registerCompanyPage() {
    this.companySignUpForm.reset();
    this.signUpPage = "EMPLOYER";
    this.headerTitle = "";
  }

  registerUserPage() {
    this.userSignUpForm.reset();
    this.signUpPage = "USER";
    this.headerTitle = "Datos Personales";
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
      photo: null as any
    }

    const form = new FormData();
    form.append("name", json.name);
    form.append("last_name", json.last_name);
    form.append("email", json.email);
    form.append("birth_date", json.birth_date);
    form.append("password", json.password);
    form.append("phone_number", json.phone_number);
    form.append("notifications", json.notifications);

    if (this.imgObj != null || this.imgObj != undefined) {
      form.append("photo", this.imgObj);
    } else {
      form.append("photo", undefined as any);
    }

    this.isLoading = true;
    this.signupAccountService.registerUser(form).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.setUserData(data.data, json);
      } else {
        if (data.message) {
          this.openModalError(data.message);
        } else {
          this.openModalError("El correo electrónico utilizado ya se encuentra en uso");
        }
      }
    }, (err) => {
      const msg = err?.error?.message || "Por favor intenta de nuevo más tarde";
      this.openModalError(msg);
      this.isLoading = false;
    })


  }
  setUserData(data: any, formData: UserSignUpDTO) {
    let userD = {
      "userType": this.signUpPage,
      "profiles":
      {
        "user":
        {
          "name": formData.name + " " + formData.last_name,
          "email": formData.email,
          "rate": 0,
          "currentStep": 1,
          "photo": data.photo
        }, "employer": {}
      },
      "JWToken": data.token
    }
    this.localStorageService.setData("userData", JSON.stringify(userD));
    this.router.navigateByUrl("/tabs/home");
  }

  registerEmployerAccount() {
    this.isSubmitted = true;
    if (!this.companySignUpForm.valid) {
      return;
    }
    let json: EmployerSignUpDTO = {
      photo: null as any,
      name: this.companySignUpForm.controls.companyName.value,
      email: this.companySignUpForm.controls.email.value,
      password: this.companySignUpForm.controls.password.value,
      phone_number: this.companySignUpForm.controls.phoneNumber.value,
      employer_Name: this.companySignUpForm.controls.employerName.value,
      enterprise_ID: this.companySignUpForm.controls.enterprise_ID.value,
      description: this.companySignUpForm.controls.description.value,
    }

    const form = new FormData();
    form.append("name", json.name);
    form.append("email", json.email);
    form.append("password", json.password);
    form.append("phone_number", json.phone_number);
    form.append("employer_Name", json.employer_Name);
    form.append("enterprise_ID", json.enterprise_ID || "");
    form.append("description", json.description);

    if (this.imgObj != null || this.imgObj != undefined) {
      form.append("photo", this.imgObj);
    } else {
      form.append("photo", undefined as any);
    }

    this.isLoading = true;
    this.signupAccountService.registerEmployer(form).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.setEmployerData(data.data, json);
      } else {
        if (data.message) {
          this.openModalError(data.message);
        } else {
          this.openModalError("El correo electrónico utilizado ya se encuentra en uso");
        }
      }
    }, (err) => {
      this.openModalError("Por favor intenta de nuevo más tarde");
      this.isLoading = false;
    })
  }

  setEmployerData(data: any, formData: EmployerSignUpDTO) {
    let employerD = {
      "userType": this.signUpPage,
      "profiles":
      {
        "user": {},
        "employer": {
          "name": formData.name,
          "email": formData.email,
          "rate": 0,
          "currentStep": 1,
          "photo": data.photo
        }
      },
      "JWToken": data.token
    }
    this.localStorageService.setData("userData", JSON.stringify(employerD));
    this.router.navigateByUrl("/tabs/home");
  }

  goToLoginPage() {
    this.router.navigateByUrl("/login");
  }

  isValidDate() {
    return false;
  }


  openPhotoModal() {
    const modal = document.querySelector(".modalCamera");
    const overlay = document.querySelector("#overlayCamera");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closePhotoModal() {
    const modal = document.querySelector(".modalCamera");
    const overlay = document.querySelector("#overlayCamera");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openDateModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector("#overlayDate");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeDateModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector("#overlayDate");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }



  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorRegister");
    const overlay = document.querySelector("#overlayErrorRegister");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorRegister");
    const overlay = document.querySelector("#overlayErrorRegister");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
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

      this.birthDateValue = this.birthMonth + "/" + this.birthDay + "/" + this.birthyear;
      this.userSignUpForm.controls.birthDate.setValue(this.birthDateValue);
      this.closeDateModal();
    } else {
      this.incompletedFields = true;
    }
  }

}

