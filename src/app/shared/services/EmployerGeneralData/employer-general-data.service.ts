import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { updateEmployerDataDTO } from '../../interfaces/UpdateEmployerDataDTO.interface';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EmployerGeneralDataService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }

  getEmployerData() {
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
      environment.apiUrl + '/api/employer/get',
      header
    );
  }

  updateEmployerData(data: any) {
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
    console.log(data);
    return this.httpClient.post(
      environment.apiUrl + '/api/employer/update', data,
      header
    );
  }
}
