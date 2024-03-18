import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { addCalificationForEmployerDTO } from '../../interfaces/addCalificationForEmployerDTO.interface';
import { addCalificationForUserDTO } from '../../interfaces/addCalificationForUserDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }
 
  addRatingEmployer(data: addCalificationForEmployerDTO) {
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
      environment.apiUrl + '/api/employer/rate', data,
      header
    );
  }

  getRatingEmployer(data: any) {  // {employer: ""}
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
      environment.apiUrl + '/api/employer/rates', data,
      header
    );
  }

  addRatingUser(data: addCalificationForUserDTO) {
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
      environment.apiUrl + '/api/user/rate', data,
      header
    );
  }

  getRatingUser(data: any) {  // {user: ""}
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
      environment.apiUrl + '/api/user/rates', data,
      header
    );
  }


}
