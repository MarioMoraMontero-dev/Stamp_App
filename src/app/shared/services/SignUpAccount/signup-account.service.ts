import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserSignUpDTO } from '../../interfaces/userSignUpDTO.interface';
import { EmployerSignUpDTO } from '../../interfaces/employerSignUpDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SignupAccountService {

  constructor(public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }

  registerUser(data: any) {
    return this.httpClient.post(environment.apiUrl + "/api/user/register", data);
  }

  registerEmployer(data:any) {
    return this.httpClient.post(environment.apiUrl + "/api/employer/register", data);
  }

  registerEmployerFromUser(data: any) {
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
    return this.httpClient.post(environment.apiUrl + "/api/employer/secureregister", data, header);
  }

  registerUserFromEmployer(data: any) {
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
    return this.httpClient.post(environment.apiUrl + "/api/user/secureregister", data, header);
  }
}
