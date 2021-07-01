import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toTypeScript } from '@angular/compiler';
import { Observable, of  } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  

  constructor(private http: HttpClient) {}

  getJson(index: number): Observable<File> {
    const dataUrl0 = "60a310df8fdd8f241db2804a.json";
    const dataUrl1 = "60cab53668692b5e18fd60ba.json";
    const dataUrl2 = "60cab54568692b5e18fd6344.json";
    const dataUrl3 = "60d19db168692b5e180a2d9f.json";
    let title: string;

    switch (index) {
      case 0: 
        title = dataUrl0;
        break;
      case 1: 
        title = dataUrl1;
        break;
      case 2:
        title = dataUrl2;
        break;
      case 3:
        title = dataUrl3;
        break;
      default:
        title = dataUrl0;
        break;
    }

    return this.http.get<File>(`http://localhost:4200/data/original/${title}`, { responseType: "text" as "json" }).pipe(
      tap(_ => console.log("success")),
      catchError(this.handleError<File>('getJson'))
    )
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}

