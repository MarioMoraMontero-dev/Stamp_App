import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { loginDTO } from 'src/app/shared/interfaces/loginDTO.interface';
import { LocalStorageService } from 'src/app/shared/services/LocalStorage/local-storage.service';
import { LoginService } from 'src/app/shared/services/Login/login.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  primaryColour = "#0F857C ";
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  modalErrroBody = "";
  passwordType = "password";
  passwordIcon = "eye-off"
  subscription = new Subscription();


  constructor(public formBuilder: FormBuilder,
    public loginService: LoginService,
    public router: Router,
    public localStorageService: LocalStorageService,
    private platform: Platform
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.loginForm.reset();

    this.isSubmitted = false;
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.loginForm.reset();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  get errorControl() {
    this.isSubmitted = false;
    return this.loginForm.controls;
  }

  loginAccount() {
    // this.localStorageService.setData("userData", JSON.stringify({ "userType": "EMPLOYER", "profiles": { "user": {}, "employer": { "name": "Wil Empresa edit", "email": "wilcr20@gmail.com", "rate": 0, "currentStep": 1, "photo": "63b4d0764450950016e79f79.jpg" } }, "JWToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIiLCJlbXBsb3llcklEIjoiNjNhYzU2NmQwZTRmZjYwMDE2NTM1Y2IyIiwidXNlcm5hbWUiOiJ3aWxjcjIwQGdtYWlsLmNvbSIsImlhdCI6MTY3MzI3NTI0OX0.iBUTSKwHJ46t06T6Bqb9SpIv6uMip20_OOjLcl4e4Us" }))
    // this.router.navigateByUrl("/tabs/home");

    // this.localStorageService.setData("userData", JSON.stringify({"userType":"EMPLOYER","profiles":{"user":{},"employer":{"name":"Stamp","email":"ofrezcoempleo@clicarts.com","rate":[0],"currentStep":1,"photo":"61e63b73447e6b0018c72105.jpg"}},"JWToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIiLCJlbXBsb3llcklEIjoiNjFlNjNiNzM0NDdlNmIwMDE4YzcyMTA2IiwidXNlcm5hbWUiOiJvZnJlemNvZW1wbGVvQGNsaWNhcnRzLmNvbSIsImlhdCI6MTY3NDE4NDk3Mn0.ne12ojEXO_xp-_c5jv8OcJRwtYzR0J6RKcN9M_vTNew"}))
    // this.router.navigateByUrl("/create-job");

    // this.router.navigateByUrl("/employer-general-data");

    // this.localStorageService.setData("userData", JSON.stringify({ "userType": "USER", "profiles": { "user": { "name": "testuser2@test.com Test", "email": "testuser2@test.com", "token": "", "rate": 0, "currentStep": 1, "photo": "" }, "employer": {} }, "JWToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2I5YmE1ZGI0MmE1MjAwMTY3ZGZmMDciLCJlbXBsb3llcklEIjoiIiwidXNlcm5hbWUiOiJ0ZXN0dXNlcjFAdGVzdC5jb20iLCJpYXQiOjE2NzM0OTQ1NDh9.vr_pXHRoeJgWFwfkD-h5hfrMYZCvYpsE_76bk7iZMTE" }))
    // this.router.navigateByUrl("/tabs/home");


    // this.localStorageService.setData("userData",JSON.stringify({"userType":"EMPLOYER","profiles":{"user":{"name":"Test Both sss","email":"testemp1@test.com","rate":0,"currentStep":1,"photo":""},"employer":{"name":"emp1 edit","email":"testemp1@test.com","rate":[0],"currentStep":1,"photo":""}},"JWToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2NlZWYyY2M5N2IzNDAwMTYyYWE4NWUiLCJlbXBsb3llcklEIjoiNjNiOWNkYWIxYmY1ZjAwMDE2MTRmMzQ5IiwidXNlcm5hbWUiOiJ0ZXN0ZW1wMUB0ZXN0LmNvbSIsImlhdCI6MTY3NDUwOTAzN30._nYxSEqQJUluL-kefPKDHVcbv3NnzOfXe6E7QbMVbrI"}))
    // this.router.navigateByUrl("/change-profile");

    // this.localStorageService.setData("userData", JSON.stringify({"userType":"USER","profiles":{"user":{"name":"Luisa Andrea Solano Céspedes","email":"buscoempleo@clicarts.com","token":"","rate":0,"currentStep":3,"photo":"63c9d9871a2f080016a1aeeb.jpg"},"employer":{}},"JWToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MWU2MzZiYzQ0N2U2YjAwMThjNzIwZWQiLCJlbXBsb3llcklEIjoiIiwidXNlcm5hbWUiOiJidXNjb2VtcGxlb0BjbGljYXJ0cy5jb20iLCJpYXQiOjE2NzQ1MzI5Njl9.wyjG0sybn47TqahB_m6H7c1kfPqpkhV0kGWYCgR4PdY"}))
    // this.router.navigateByUrl("/tabs/home");

    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    let data: loginDTO = {
      username: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    };
    this.loginService.doAuthentication(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status === 200) {
        
        this.localStorageService.setData("userData", JSON.stringify(data.data))
        this.router.navigateByUrl("tabs/home");
      } else {
        this.openModalError(data.message);
      }
    }, (err: any) => {
      this.openModalError("Por favor intenta de nuevo más tarde");
      this.isLoading = false;
    })
  }

  recoveryPassword() {
    this.router.navigateByUrl("/recovery-password")
  }

  registerAccount() {
    this.router.navigateByUrl("/register-account")
  }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  openModalError(text: string) {
    const modal = document.querySelector(".modalError");
    const overlay = document.querySelector(".overlay");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector(".modalError");
    const overlay = document.querySelector(".overlay");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

}
