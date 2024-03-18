import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddAcademicDegree } from '../../interfaces/addAcademicDegree.interface';
import { AddUserCertificationDTO } from '../../interfaces/addUserCertificationDTO.interface';
import { AddUserLanguageDTO } from '../../interfaces/addUserLanguageDTO.interface';
import { addUserLicenseDTO } from '../../interfaces/addUserLicenseDTO.interface';
import { AddWorkExpDTO } from '../../interfaces/addWorkExpDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }

  getLanguages() {
    let userData = this.localStorageService.getData("userData");
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        token
      ),
    };
    return this.httpClient.get(
      environment.apiUrl + '/api/language/get',
      header
    );
  }

  getUserLanguages() {
    console
    let userData = this.localStorageService.getData("userData");
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        token
      ),
    };
    return this.httpClient.get(
      environment.apiUrl + '/api/userLanguage/get',
      header
    );
  }

  addUserLanguages(data: AddUserLanguageDTO) {
    let userData = this.localStorageService.getData("userData");
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        token
      ),
    };
    return this.httpClient.post(
      environment.apiUrl + '/api/userLanguage/add', data,
      header
    );
  }

  removeUserLanguages(data: any) {
    let userData = this.localStorageService.getData("userData");
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        token
      ),
    };
    return this.httpClient.post(
      environment.apiUrl + '/api/userLanguage/remove', data,
      header
    );
  }

  //Attachements
  getuserDocs() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/user/getDocs', header);
  }

  addUserIdDoc(fileData: any) {
    const form = new FormData();
    form.append("file", fileData);
    
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/user/addID', form, header);
  }

  addUserCriminalRecordDoc(fileData: any) {
    const form = new FormData();
    form.append("file", fileData);
    
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/user/addCriminalRecord', form, header);
  }

  //Certifications
  getUserCertifications() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/certification/get', header);
  }

  addUserCertifications(data: AddUserCertificationDTO) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/certification/add', data, header);
  }

  removeUserCertifications(data: any) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/certification/remove', data, header);
  }

  // Licenses
  getLicenses() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/license/get', header);
  }

  getUserLicenses() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/userLicense/get', header);
  }

  addLicense(data: addUserLicenseDTO) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/userLicense/add', data, header);
  }

  removeLicense(data: any) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/userLicense/remove', data, header);
  }


  // Grades
  getGrades() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/grades/get', header);
  }

  getUserGrades() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/academicDegree/get', header);
  }

  addUserGrade(data: AddAcademicDegree) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/academicDegree/add', data, header);
  }

  removeUserGrade(data: any) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/academicDegree/remove', data, header);
  }

  // Work experience
  getExperienceWork() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/experience/get', header);
  }

  addUserWorkExperience(data: AddWorkExpDTO) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/experience/add', data, header);
  }

  removeUserWorkExperience(data: any) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/experience/remove', data, header);
  }

  sendCV() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.post(environment.apiUrl + '/api/user/sendCV', {}, header);
  }
}
