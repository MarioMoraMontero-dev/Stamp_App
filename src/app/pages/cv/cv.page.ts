import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AddAcademicDegree } from 'src/app/shared/interfaces/addAcademicDegree.interface';
import { AddUserCertificationDTO } from 'src/app/shared/interfaces/addUserCertificationDTO.interface';
import { AddUserLanguageDTO } from 'src/app/shared/interfaces/addUserLanguageDTO.interface';
import { addUserLicenseDTO } from 'src/app/shared/interfaces/addUserLicenseDTO.interface';
import { AddWorkExpDTO } from 'src/app/shared/interfaces/addWorkExpDTO.interface';
import { CvService } from 'src/app/shared/services/Cv/cv.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/Camera/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.page.html',
  styleUrls: ['./cv.page.scss'],
})
export class CvPage implements OnInit {
  headerText = "CV";
  isMainPage = true;
  isAcademicDegreePage: boolean = false;
  isLaboralExpPage: boolean = false;
  isCertificationsPage: boolean = false;
  isLanguagePage: boolean = false;
  isLicensesPage: boolean = false;
  isAttachPage: boolean = false;
  modalErrroBody: string = "";
  isLoading = false;
  isSubmitted = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  primaryColour = '#0F857C ';
  licenseList: any = [];
  wrongDay: boolean = false;
  wrongMonth: boolean = false;
  wrongyear: boolean = false;
  birthDateValue = "Año de Finalización";
  startDateJobValue = "Fecha de ingreso";
  endDateJobVale = "Fecha de salida"

  birthDay: any;
  birthMonth: any;
  birthyear: any;

  startDay: any;
  startMonth: any;
  startYear: any;
  endDay: any;
  endMonth: any;
  endYear: any;

  wrongStartDay: boolean = false;
  wrongStartMonth: boolean = false;
  wrongStartyear: boolean = false;
  wrongEndDay: boolean = false;
  wrongEndMonth: boolean = false;
  wrongEndyear: boolean = false;
  //Forms objects
  academicForm: FormGroup;
  workExpForm: FormGroup;
  certificationsForm: FormGroup;

  base64Img = "";
  criminalRecordImg = "";
  userIdImg = "";


  checkCompletedDegree = new FormControl(false);
  checkIncompletedDegree = new FormControl(false);
  checkCursingDegree = new FormControl(false);
  gradeList: any = [];
  incompletedFields: boolean;
  incompletedEndFields: boolean;
  incompletedStartFields: boolean;
  gradeUserList: any = [];
  userWorkExpList: any = [];
  userCertificationList: any = [];
  languagesSelectList: any = [];
  userNativeLangList: any = [];
  userOtherLangList: any = [];

  nativeLang = "";
  otherLang = "";
  languageType = "BASIC";

  prefixUrlImg = environment.apiAmazonStorage;
  docSelected: string = "";
  subscription = new Subscription();

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private cvService: CvService,
    private camera: Camera,
    private platform: Platform,
  ) {
    this.academicForm = this.formBuilder.group({
      degree: ['', [Validators.required]],
      state: ['', [Validators.required]],
      institution_Name: ['', [Validators.required]],
      finish_Date: ['', [Validators.required]],
    });

    this.workExpForm = this.formBuilder.group({
      company_Name: ['', [Validators.required]],
      job_Description: ['', [Validators.required]],
      from_Date: ['', [Validators.required]],
      to_Date: ['', [Validators.required]],
    });

    this.certificationsForm = this.formBuilder.group({
      certification_Name: ['', [Validators.required]],
      institution_Name: ['', [Validators.required]],
      length: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.cvService.getLanguages().subscribe((data: any) => {
      this.isLoading = false;
      this.languagesSelectList = data.data;
      console.log(data.data);
    }, (err) => {
      this.isLoading = false;
    })
  }

  ionViewWillEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      // prevent Android back button 
    })
    this.headerText = "CV";
    this.resetFlagsPage();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  resetFlagsPage() {
    this.isMainPage = true;
    this.headerText = "CV";
    this.isAcademicDegreePage = false;
    this.isLaboralExpPage = false;
    this.isCertificationsPage = false;
    this.isLanguagePage = false;
    this.isLicensesPage = false;
    this.isAttachPage = false;
    this.modalErrroBody = "";
    this.isSubmitted = false;
    this.academicForm.reset();
    this.certificationsForm.reset();
    this.workExpForm.reset();
    this.criminalRecordImg = "";
    this.userIdImg = "";
    this.docSelected = "";
  }

  goBack() {
    if (this.isMainPage) {
      this.router.navigateByUrl("/tabs/home");
      this.headerText = "CV";
    } else {
      this.resetFlagsPage();
    }
  }

  selectAcademicDegreePage() {
    this.isLoading = true;
    this.cvService.getGrades().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.headerText = "Grado Académico";
        this.isAcademicDegreePage = true;
        this.isMainPage = false;
        this.gradeList = data.data;

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
      // this.resetFlagsPage();
    });
    this.cvService.getUserGrades().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.headerText = "Grado Académico";
        this.isAcademicDegreePage = true;
        this.isMainPage = false;
        this.gradeUserList = data.data;
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
      // this.resetFlagsPage();
    });
  }

  selectLaboralExpPage() {
    this.isLoading = true;
    this.cvService.getExperienceWork().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.headerText = "Experiencia Laboral";
        this.isLaboralExpPage = true;
        this.isMainPage = false;
        this.userWorkExpList = data.data;
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
      // this.resetFlagsPage();
    });
  }

  selectCertificationsPage() {
    this.isLoading = true;
    this.cvService.getUserCertifications().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.headerText = "Certificaciones";
        this.isCertificationsPage = true;
        this.isMainPage = false;
        this.userCertificationList = data.data;
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
      // this.resetFlagsPage();
    });
  }

  selectLanguagePage() {
    this.isLoading = true;
    this.otherLang = "";
    this.nativeLang = "";
    this.cvService.getUserLanguages().subscribe((data: any) => {
      console.log(data)
      this.isLoading = false;
      if (data.status == 200) {
        this.headerText = "Idiomas";
        this.isLanguagePage = true;
        this.isMainPage = false;

        this.userNativeLangList = data.data.filter((l: { type: string; }) => l.type == "NATIVE");
        this.userOtherLangList = data.data.filter((l: { type: string; }) => l.type == "OTHER");
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
      // this.resetFlagsPage();
    });
  }

  selectLicensesPage() {
    this.isLoading = true;
    this.cvService.getUserLicenses().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.headerText = "Licencia de conducir";
        this.isLicensesPage = true;
        this.isMainPage = false;
        this.licenseList = data.data;
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
      // this.resetFlagsPage();
    });
  }

  selectAttachPage() {
    this.isLoading = true;
    this.cvService.getuserDocs().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.headerText = "Adjuntos";
        this.isAttachPage = true;
        this.isMainPage = false;
        if (data.data.ID !== "") {
          this.userIdImg = this.prefixUrlImg + data.data.ID.replace(".blob", "");
        }
        if (data.data.criminal_record !== "") {
          this.criminalRecordImg = this.prefixUrlImg + data.data.criminal_record.replace(".blob", "");
        }
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
      // this.resetFlagsPage();
    });
  }

  sendMeCV() {
    this.isLoading = true;
    this.cvService.sendCV().subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.openCVSentModal();
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      this.isLoading = false;
      console.log(err);
      this.openModalError("Por favor intenta de nuevo más tarde");
      // this.resetFlagsPage();
    });
  }

  openCVSentModal() {
    const modal = document.querySelector("#modalCVSent");
    const overlay = document.querySelector("#overlayErrorCV");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeCVSentModal() {
    const modal = document.querySelector("#modalCVSent");
    const overlay = document.querySelector("#overlayErrorCV");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }



  openModalError(text: string) {
    const modal = document.querySelector("#modalErrorCV");
    const overlay = document.querySelector("#overlayErrorCV");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalErrorCV");
    const overlay = document.querySelector("#overlayErrorCV");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
    this.resetFlagsPage();
  }

  openDateModal() {
    const modal = document.querySelector("#modalDate");
    const overlay = document.querySelector("#overlayDate");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeDateModal() {
    const modal = document.querySelector("#modalDate");
    const overlay = document.querySelector("#overlayDate");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openDateEndModal() {
    const modal = document.querySelector("#modalDateEnd");
    const overlay = document.querySelector("#overlayDate");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeDateEndModal() {
    const modal = document.querySelector("#modalDateEnd");
    const overlay = document.querySelector("#overlayDate");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  openPhotoModal(source: string) {
    this.docSelected = source;
    const modal = document.querySelector("#modalCamera");
    const overlay = document.querySelector("#overlayCamera");
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }


  closePhotoModal() {
    const modal = document.querySelector("#modalCamera");
    const overlay = document.querySelector("#overlayCamera");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }

  setDateValue(source = "") {
    if (this.isLaboralExpPage) {
      this.wrongStartDay = false;
      this.wrongStartMonth = false;
      this.wrongStartyear = false;
      this.wrongEndDay = false;
      this.wrongEndMonth = false;
      this.wrongEndyear = false;
      this.incompletedStartFields = false;
      this.incompletedEndFields = false;
      if (source == "start") {
        if (this.startDay && this.startMonth && this.startYear) {
          if (Number.isNaN(this.startDay) || (this.startDay == 0 || this.startDay > 31)) {
            this.wrongStartDay = true;
            return;
          }
          if (Number.isNaN(this.startMonth) || (this.startMonth == 0 || this.startMonth > 12)) {
            this.wrongStartMonth = true;
            return;
          }

          if (Number.isNaN(this.startYear) || (this.startYear < 1900)) {
            this.wrongStartyear = true;
            return;
          }

          this.startDateJobValue = this.startDay + "/" + this.startMonth + "/" + this.startYear;
          this.workExpForm.controls.from_Date.setValue(this.startDateJobValue);
          this.closeDateModal();
        } else {
          this.incompletedStartFields = true;
        }
      } else {
        if (source == "end") {
          if (this.endDay && this.endMonth && this.endYear) {
            if (Number.isNaN(this.endDay) || (this.endDay == 0 || this.endDay > 31)) {
              this.wrongEndDay = true;
              return;
            }
            if (Number.isNaN(this.endMonth) || (this.endMonth == 0 || this.endMonth > 12)) {
              this.wrongEndMonth = true;
              return;
            }

            if (Number.isNaN(this.endYear) || (this.endYear < 1900)) {
              this.wrongEndyear = true;
              return;
            }

            this.endDateJobVale = this.endDay + "/" + this.endMonth + "/" + this.endYear;
            this.workExpForm.controls.to_Date.setValue(this.endDateJobVale);
            this.closeDateEndModal();
          } else {
            this.incompletedEndFields = true;
          }
        }
      }
    } else {
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
        this.academicForm.controls.finish_Date.setValue(this.birthDateValue);
        this.closeDateModal();
      } else {
        this.incompletedFields = true;
      }
    }


  }

  addAcademicDegree() {
    this.isSubmitted = true;
    this.getStatusSelectedDegree();
    if (!this.academicForm.valid) {
      return;
    }

    let data: AddAcademicDegree = {
      grade: this.academicForm.controls.degree.value,
      status: this.academicForm.controls.state.value,
      institution_Name: this.academicForm.controls.institution_Name.value,
      finish_Date: this.academicForm.controls.finish_Date.value
    }
    this.isLoading = true;
    this.cvService.addUserGrade(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.gradeUserList.push(data.data);
        this.academicForm.reset();
        this.isSubmitted = false;
      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })

  }

  removeAcademicDegree(idDegree: any) {
    this.isLoading = true;
    let data: any = {
      id: idDegree
    };
    this.cvService.removeUserGrade(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.gradeUserList = this.gradeUserList.filter((g: { _id: any; }) => g._id != idDegree);
      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  getStatusSelectedDegree() {
    if (this.checkCompletedDegree.value) {
      this.academicForm.controls.state.setValue(1);
      return;
    } else if (this.checkCursingDegree.value) {
      this.academicForm.controls.state.setValue(0);
      return;
    } else if (this.checkIncompletedDegree.value) {
      this.academicForm.controls.state.setValue(-1);
      return;
    }
  }

  getGradeName(id: any) {
    let degree = this.gradeList.filter((g: { _id: any; }) => g._id == id);
    if (degree[0]) {
      return degree[0].name;
    }
  }


  addWorkExp() {
    this.isSubmitted = true;
    if (!this.workExpForm.valid) {
      return;
    }
    let data: AddWorkExpDTO = {
      company_Name: this.workExpForm.controls.company_Name.value,
      job_Description: this.workExpForm.controls.job_Description.value,
      from_Date: this.workExpForm.controls.from_Date.value,
      to_Date: this.workExpForm.controls.to_Date.value,
    }
    this.isLoading = true;
    this.cvService.addUserWorkExperience(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.userWorkExpList.push(data.data);
        this.workExpForm.reset();
        this.startDateJobValue = "Fecha de ingreso";
        this.endDateJobVale = "Fecha de salida"
        this.isSubmitted = false;
      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  removeWorkExp(idWork: any) {
    this.isLoading = true;
    let data: any = {
      id: idWork
    };
    this.cvService.removeUserWorkExperience(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.userWorkExpList = this.userWorkExpList.filter((g: { _id: any; }) => g._id != idWork);
      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  addCertification() {
    this.isSubmitted = true;
    this.getStatusSelectedCertification();
    if (!this.certificationsForm.valid) {
      return;
    }
    let data: AddUserCertificationDTO = {
      certification_Name: this.certificationsForm.controls.certification_Name.value,
      institution_Name: this.certificationsForm.controls.institution_Name.value,
      length: this.certificationsForm.controls.length.value,
      status: this.certificationsForm.controls.status.value
    }
    this.isLoading = true;
    this.cvService.addUserCertifications(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.userCertificationList.push(data.data);
        this.certificationsForm.reset();
        this.isSubmitted = false;
      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })

  }

  getStatusSelectedCertification() {
    if (this.checkCompletedDegree.value) {
      this.certificationsForm.controls.status.setValue(1);
      return;
    } else if (this.checkCursingDegree.value) {
      this.certificationsForm.controls.status.setValue(0);
      return;
    } else if (this.checkIncompletedDegree.value) {
      this.certificationsForm.controls.status.setValue(-1);
      return;
    }
  }

  removeCertification(idCert: any) {
    this.isLoading = true;
    let data: any = {
      id: idCert
    };
    this.cvService.removeUserCertifications(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.userCertificationList = this.userCertificationList.filter((g: { _id: any; }) => g._id != idCert);
      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  addUserLanguage(typeLanguage: string) {
    let data: AddUserLanguageDTO = {
      language: typeLanguage == "NATIVE" ? this.nativeLang as any : this.otherLang,
      type: typeLanguage,
      level: typeLanguage == "NATIVE" ? null as any : this.languageType
    }
    this.isLoading = true;
    this.cvService.addUserLanguages(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        if (data.data.type == "OTHER") {
          this.userOtherLangList.push(data.data)
        } else if (data.data.type == "NATIVE") {
          this.userNativeLangList.push(data.data)
        }
      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }

    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  getLanguageName(lang: any) {
    console.log(lang);
    if (lang.language.name) {
      return lang.language.name + " | " + lang.level;
    }
    let langSelected = this.languagesSelectList.filter((l: { _id: any; }) => l._id == lang.language)
    return langSelected[0].name;
  

  }



  removeUserLanguage(idLang: any) {
    this.isLoading = true;
    let data: any = {
      id: idLang
    };
    this.cvService.removeUserLanguages(data).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status == 200) {
        this.userNativeLangList = this.userNativeLangList.filter((g: { _id: any; }) => g._id != idLang);
        this.userOtherLangList = this.userOtherLangList.filter((g: { _id: any; }) => g._id != idLang);

      } else if (data.message) {
        this.openModalError(data.message);
      } else {
        this.openModalError("Por favor intenta de nuevo más tarde");
      }
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.openModalError("Por favor intenta de nuevo más tarde");
    })
  }

  addRemoveLicense(license: any) {
    this.isLoading = true;
    let data: addUserLicenseDTO = {
      id: license._id
    }
    if (license.added) {
      this.cvService.removeLicense(data).subscribe((data: any) => {
        this.isLoading = false;
        if (data.status == 200) {
        } else if (data.message) {
          this.openModalError(data.message);
        } else {
          this.openModalError("Por favor intenta de nuevo más tarde");
        }
      }, (err) => {
        console.log(err);
        this.isLoading = false;
        this.openModalError("Por favor intenta de nuevo más tarde");
      })
    } else {
      this.cvService.addLicense(data).subscribe((data: any) => {
        this.isLoading = false;
        if (data.status == 200) {
        } else if (data.message) {
          this.openModalError(data.message);
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
      this.base64Img = "data:image/jpeg;base64," + imageData;
      getFileImg(this.base64Img).then((data: any) => {
        var file = new File([data], "profile.jpg", { type: "image/jpg", lastModified: new Date().getTime() });
        if (this.docSelected == "USERID") {
          this.cvService.addUserIdDoc(file.name[0]).subscribe((data: any) => {
            this.isLoading = false;
            let photo = data.data.file;
            this.userIdImg = this.prefixUrlImg + photo;
            this.closePhotoModal();
          }, (err) => {
            console.log(err);
            this.closePhotoModal();
            this.isLoading = false;
            this.openModalError("Por favor intenta de nuevo más tarde");
          })
        } else if (this.docSelected == "CRIMINAL_RECORD") {
          this.cvService.addUserCriminalRecordDoc(file.name[0]).subscribe((data: any) => {
            this.isLoading = false;
            let photo = this.prefixUrlImg + data.data.file;
            this.criminalRecordImg = photo;
            this.closePhotoModal();
          }, (err) => {
            console.log(err);
            this.closePhotoModal();
            this.isLoading = false;
            this.openModalError("Por favor intenta de nuevo más tarde");
          })
        }
      });
    }, (err) => {
      console.log("err", err)
      this.isLoading = false;
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
    let oldThis = this;
    this.isLoading = true;
    this.camera.getPicture(options).then((imageData) => {
      this.base64Img = "data:image/jpeg;base64," + imageData;
      getFileImg(this.base64Img).then((data: any) => {
        var file = new File([data], "profile.jpg", { type: "image/jpg", lastModified: new Date().getTime() });
        if (this.docSelected == "USERID") {
          this.cvService.addUserIdDoc(file.name[0]).subscribe((data: any) => {
            this.isLoading = false;
            let photo = data.data.file;
            this.userIdImg = photo;
            this.closePhotoModal();

          }, (err) => {
            console.log(err);
            this.closePhotoModal();
            this.isLoading = false;
            this.openModalError("Por favor intenta de nuevo más tarde");
          })
        } else if (this.docSelected == "CRIMINAL_RECORD") {
          this.cvService.addUserCriminalRecordDoc(file.name[0]).subscribe((data: any) => {
            this.isLoading = false;
            let photo = data.data.file;
            this.criminalRecordImg = photo;
            this.closePhotoModal();
          }, (err) => {
            console.log(err);
            this.closePhotoModal();
            this.isLoading = false;
            this.openModalError("Por favor intenta de nuevo más tarde");
          })
        }
      });
    }, (err) => {
      console.log("err", err)
      this.isLoading = false;
    });
  }
}


async function getFileImg(base64Img: any): Promise<any> {
  const base64Response = await fetch(base64Img);
  const blob = await base64Response.blob();
  return blob;

}
