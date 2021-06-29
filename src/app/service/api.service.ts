import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  

  constructor(private http: HttpClient) {}

  getJson() {
    const prefixUrl = "http://localhost:4200/data/";
    const dataUrl1 = "60a310df8fdd8f241db2804a.json";
    const dataUrl2 = "60cab53668692b5e18fd60ba.json";
    const dataUrl3 = "60cab54568692b5e18fd6344.json";
    const dataUrl4 = "60d19db168692b5e180a2d9f.json";

    this.http.get<File>(prefixUrl + dataUrl1, { responseType: "text" as "json" }).subscribe(file => {
      // console.log(file.toString().split("\n"))
      console.log("success!");
    })
  }
}
