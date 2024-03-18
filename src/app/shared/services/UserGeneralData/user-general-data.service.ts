import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UpdateUserDataDTO } from '../../interfaces/UpdateUserDataDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserGeneralDataService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }

  getUserData() {
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
      environment.apiUrl + '/api/user/get',
      header
    );
  }

  updateUserData(data: any) {
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
      environment.apiUrl + '/api/user/update', data,
      header
    );
  }

}
