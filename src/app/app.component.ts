import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './shared/services/LocalStorage/local-storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  splash = true
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,

  ) {
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.router.navigateByUrl("/login")
    this.localStorageService.deleteData("isPremium");
    this.localStorageService.deleteData("userData");
    let firstTimeApp = this.localStorageService.getData("firstTimeApp");
    if (!firstTimeApp) {
      this.localStorageService.setData("firstTimeApp", "true");
      this.router.navigateByUrl("stepper-app-first-time");
    }
   
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('hello');
        }, false);
      });
    });
  }

}
