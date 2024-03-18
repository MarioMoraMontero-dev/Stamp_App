import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getData(key: string) {
    return localStorage.getItem(key);
  }

  setData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  deleteData(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }
}
