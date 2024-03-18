import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { setMatchEmployer } from '../../interfaces/setMatchEmployer.interface';
import { updateJobOfferDTO } from '../../interfaces/UpdateJobOfferDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OffersJobService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }

  getOffersJob() {
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
      environment.apiUrl + '/api/employer/offers',
      header
    );
  }

  updateJobOffer(data: updateJobOfferDTO) {
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
      environment.apiUrl + '/api/jobOffer/update', data,
      header
    );
  }


  removeJobOffer(data: any) {
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
      environment.apiUrl + '/api/jobOffer/remove', data,
      header
    );
  }

  getdetailsWithUsers(data: any){
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
      environment.apiUrl + '/api/jobOffer/getDetailsWithUsers', data,
      header
    );
  }

  getOfferJobDetails(data: any){
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


  matchCandidate(data: setMatchEmployer){
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
      environment.apiUrl + '/api/jobOffer/matchOffer', data,
      header
    );
  }

}
 