import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@awesome-cordova-plugins/Camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

// geolocation and native-geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,ReactiveFormsModule],
  providers: [
    Geolocation,
    NativeGeocoder,
    ScreenOrientation,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Camera, File],
  bootstrap: [AppComponent],
})
export class AppModule { }
