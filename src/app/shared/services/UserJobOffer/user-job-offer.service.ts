import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserJobOfferService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }

  getOffers() {
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
      environment.apiUrl + '/api/jobOffer/get',
      header
    );
  }

  getByUser(){
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
      environment.apiUrl + '/api/jobOffer/getByUser',
      header
    );
  }

  likeJobOffer(data: any){
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
      environment.apiUrl + '/api/jobOffer/like', data,
      header
    );
  }

  dislikeJobOffer(data: any){
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
      environment.apiUrl + '/api/jobOffer/dislike', data,
      header
    );
  }

  getOfferById(data: any){
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
      environment.apiUrl + '/api/jobOffer/details', data,
      header
    );
  }



}
