import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IPassedData } from './component/d-list/d-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
  ]
})
export class AppComponent implements OnInit{
  title = 'mezoo-ecg-reader';

  currentIndex = 0;
  startTime: Date;
  endTime: Date;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
  }

  indexChangedHandler(passedData: IPassedData) {
    this.currentIndex = passedData.currentIndex;
    this.startTime = passedData.startTime;
    this.endTime = passedData.endTime;
  }
}


