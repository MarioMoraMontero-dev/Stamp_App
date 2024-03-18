import { Component } from '@angular/core';
import { UserAccountData } from '../interfaces/userAccountData.interface';
import { LocalStorageService } from '../services/LocalStorage/local-storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  userData: any;
  constructor(
    public localStorageService: LocalStorageService
  ) { }

  ionViewWillEnter() {
    let userInfo = this.localStorageService.getData("userData");
    if(userInfo){
      this.userData = JSON.parse(userInfo);
    }
  }

}
