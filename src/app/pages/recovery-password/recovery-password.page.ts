import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Subscription } from 'rxjs';
import { recoveryPassword } from 'src/app/shared/interfaces/recoveryPasswordDTO.interface';
import { resetPasswordDTO } from 'src/app/shared/interfaces/resetPasswordDTO.interface';
import { RecoveryPasswordService } from 'src/app/shared/services/RecoveryPassword/recovery-password.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.page.html',
  styleUrls: ['./recovery-password.page.scss'],
})
export class RecoveryPasswordPage implements OnInit {
  recoveryForm: FormGroup;
  passwordRecoveryForm: FormGroup;
  isSubmitted = false;
  isPasswordRecovered = false;
  isLoading = false;
  primaryColour = "#00A19A";
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  modalErrroBody: string;

  passwordType = "password";
  passwordIcon = "eye-off"
  subscription = new Subscription();

  constructor(
    public formBuilder: FormBuilder,
    public recoveryPasswordService: RecoveryPasswordService,
    private toastController: ToastController,
    private router: Router,
    private platform: Platform
  ) {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.passwordRecoveryForm = this.formBuilder.group({
      temporalPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]],
    });
    this.recoveryForm.reset();
    this.isSubmitted = false;
    this.isPasswordRecovered = false;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.isPasswordRecovered = false;
    this.isSubmitted = false;
    this.passwordRecoveryForm.reset();
    this.recoveryForm.reset()
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  registerAccount(){
    this.router.navigateByUrl("/register-account")
  }

  get errorControl() {
    return this.recoveryForm.controls;
  }

  get errorControRecoveredPassword() {
    return this.passwordRecoveryForm.controls;
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  recoverPassword() {
    this.isSubmitted = true;
    if (!this.recoveryForm.valid) {
      return;
    }
    this.isLoading = true;
    let dataRecovery: recoveryPassword = {
      email: this.recoveryForm.controls.email.value,
    };
    this.recoveryPasswordService.requestPassword(dataRecovery).subscribe((data: any) => {
      this.isSubmitted = false;
      this.isLoading = false;
      if (data.status == 200) {
        this.isPasswordRecovered = true;
        this.presentToast()
      } else {
        if (data.message) {
          this.openModalError(data.message);
        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
      }
    }, (err) => {
      this.openModalError("Por favor intenta de nuevo más tarde");
      this.isLoading = false;
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Se ha enviado un mensaje a su correo electrónico con la contraseña temporal',
      duration: 1500,
      mode: "ios",
      position: "bottom"
    });

    await toast.present();
  }

  samePassword() {
    if (this.passwordRecoveryForm.controls.confirmNewPassword.value == this.passwordRecoveryForm.controls.newPassword.value) {
      return true;
    }
    return false;
  }

  updatePassword() {
    this.isSubmitted = true;

    if (!this.passwordRecoveryForm.valid) {
      return;
    }
    let data: resetPasswordDTO = {
      email: this.recoveryForm.controls.email.value,
      tempPassword: this.passwordRecoveryForm.controls.temporalPassword.value,
      newPassword: this.passwordRecoveryForm.controls.confirmNewPassword.value
    };
    this.isLoading = true;
    this.recoveryPasswordService.resetPassword(data).subscribe((data: any) => {
      this.isLoading = true;
      if (data.status == 200) {
        this.isPasswordRecovered = false;
        this.router.navigateByUrl("/login")

      } else {
        if (data.message) {
          this.openModalError(data.message);
        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  openModalError(text: string) {
    const modal = document.querySelector("#modalError");
    const overlay = document.querySelector("#overlay");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalError");
    const overlay = document.querySelector("#overlay");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }




}
