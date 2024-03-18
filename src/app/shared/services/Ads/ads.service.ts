import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { addAdsDTO } from '../../interfaces/addAdsDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  modalErrroBody: string;
  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) {}

  createAds(data: any) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    
    return this.httpClient.post(environment.apiUrl + '/api/ads', data, header);
  }

  getAds() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    
    return this.httpClient.get(environment.apiUrl + '/api/ads', header);
  }

  getCountries() {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };
    return this.httpClient.get(environment.apiUrl + '/api/country', header);
  }

  getStates(codeCountry: string) {
    let userData = this.localStorageService.getData('userData');
    let token = '';
    if (userData) {
      token = JSON.parse(userData).JWToken;
    }
    var header = {
      headers: new HttpHeaders().set('Authorization', token),
    };

    return this.httpClient.get(environment.apiUrl + '/api/states?country='+codeCountry, header );
  }

  removeads(data: any) {
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
      environment.apiUrl + '/api/ads/remove', data,
      header
    );
  }


  openModalError(text: string) {
    const modal = document.querySelector("#modalError");
    const overlay = document.querySelector("#overlayError");
    this.modalErrroBody = text;
    modal?.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  }

  closeModalError() {
    const modal = document.querySelector("#modalError");
    const overlay = document.querySelector("#overlayError");
    modal?.classList.add("hidden");
    overlay?.classList.add("hidden");
  }
}
