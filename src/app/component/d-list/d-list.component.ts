import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'app/service/api.service';
import { IData } from '../period/period.component';

@Component({
  selector: 'app-d-list',
  templateUrl: './d-list.component.html',
  styleUrls: ['./d-list.component.css']
})
export class DListComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  totalTimes: ITotalTime[] = [];

  ngOnInit(): void {
    this.getTotalTime(4);
  }

  currentIndex: number;
  startTime: Date;
  endTime: Date;

  @Output() indexChanged: EventEmitter<IPassedData> = new EventEmitter();

  clicked(index: number) {
    this.currentIndex = index;
    
    for (let i = 0; i < this.totalTimes.length; i++) {
      if (this.totalTimes[i].index === this.currentIndex) {
        this.startTime = this.totalTimes[i].startTime;
        this.endTime = this.totalTimes[i].endTime;
      }
    }

    this.indexChanged.emit({currentIndex: this.currentIndex, startTime: this.startTime, endTime: this.endTime});
  }

  getTotalTime(total: number){
    for (let i = 0; i < total; i++){
      this.apiService.getJson(i).toPromise().then(data => {
        let size = data.toString().split("\n").length;
        let convertedData: IData[] = [];
        let stringArrayData = data.toString().split("\n");

        for (let i = 0; i < size; i++){
          convertedData.push(JSON.parse(stringArrayData[i]));
        }

        const timeDiff = convertedData[convertedData.length - 1].ts - convertedData[0].ts;
        const totalHours = Math.floor(timeDiff / 1000 / 60 / 60); 
        const totalMinutes = Math.floor(timeDiff / 1000 / 60 - totalHours * 60);
        const totalSeconds = Math.round(timeDiff / 1000 - totalMinutes * 60);
        const startTime: Date = new Date(convertedData[0].ts);
        const endTime: Date = new Date(convertedData[convertedData.length - 1].ts);

        this.totalTimes.push({index: i, totalHours, totalMinutes, totalSeconds, startTime, endTime})
      })     
    }
  }
}

export interface ITotalTime {
  index: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  startTime: Date;
  endTime: Date;
}

export interface IPassedData {
  currentIndex: number;
  startTime: Date;
  endTime: Date;
}