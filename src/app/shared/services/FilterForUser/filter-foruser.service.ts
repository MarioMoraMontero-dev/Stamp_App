import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddUserFilterDTO } from '../../interfaces/AddUserFilterDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FilterForUserService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }


  getSearchConfig() {
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
      environment.apiUrl + '/api/user/getSearchConfig', header
    );
  }

  addUserFilter(data: AddUserFilterDTO) {
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
      environment.apiUrl + '/api/user/addSearchConfig', data,
      header
    );
  }
}
