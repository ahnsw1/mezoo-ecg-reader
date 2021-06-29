import { Component } from '@angular/core';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mezoo-ecg-reader';

  constructor(private apiService: ApiService) {
    apiService.getJson(); 
  }
}
