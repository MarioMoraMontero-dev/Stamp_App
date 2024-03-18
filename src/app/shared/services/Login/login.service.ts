import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginDTO } from '../../interfaces/loginDTO.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( public httpClient: HttpClient) { }

  doAuthentication(data: loginDTO){
    return this.httpClient.post(environment.apiUrl + "/api/auth/login", data);
  }

}
