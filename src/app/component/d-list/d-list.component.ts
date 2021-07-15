import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IData, ITimeData, TData, TTimeData } from 'app/app.component';
import { ApiService } from 'app/service/api.service';

@Component({
  selector: 'app-d-list',
  templateUrl: './d-list.component.html',
  styleUrls: ['./d-list.component.css']
})
export class DListComponent implements OnInit{

  constructor(private apiService: ApiService) { }

  totalTimes: ITimeData[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      for (let i = 0; i < Object.keys(this.totalTimeData).length; i++) {
        this.totalTimes.push(this.totalTimeData[i]);
      }
    }, 1600);
  }

  currentIndex: number;
  startTime: Date;
  a = {"a": 1}
  endTime: Date;
  @Input() totalTimeData: TTimeData = {};
  @Output() indexChanged: EventEmitter<number> = new EventEmitter();

  clicked(index: number) {
    this.currentIndex = index;
    this.indexChanged.emit(this.currentIndex); 
  }
}