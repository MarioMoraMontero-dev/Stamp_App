import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../LocalStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    public httpClient: HttpClient,
    public localStorageService: LocalStorageService
  ) { }

  addReportEmployer(data: any) {
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
      environment.apiUrl + '/api/user/complaint', data,
      header
    );
  }
}
