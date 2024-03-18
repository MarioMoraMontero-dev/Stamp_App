import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { recoveryPassword } from '../../interfaces/recoveryPasswordDTO.interface';
import { resetPasswordDTO } from '../../interfaces/resetPasswordDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class RecoveryPasswordService {

  constructor( public httpClient: HttpClient) { }

  requestPassword(data: recoveryPassword){
    return this.httpClient.post(environment.apiUrl + "/api/auth/requestResetPassword", data);
  }

  resetPassword(data: resetPasswordDTO){
    return this.httpClient.post(environment.apiUrl + "/api/aut/resetPassword", data);
  }
}
