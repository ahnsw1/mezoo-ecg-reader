import { Component, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  previousIndex = 0;
  currentIndex;
  startTime: Date;
  endTime: Date;
  totalData: TData = {};
  totalEcgData: TEcgData = {};

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.getUserData();
  }

  indexChangedHandler(passedData: IPassedData) {
    this.currentIndex = passedData.currentIndex;
    this.startTime = passedData.startTime;
    this.endTime = passedData.endTime;
  }
  
  getUserData(){
    for (let index = 0; index < 4; index++){
      this.apiService.getFullJson(index).toPromise().then(data => {
        
        let newData: IData[] = [];
        let ecgData: IEcgData[] = []; 
        let datas = data.toString().split("\n");
        
        let l = 0;
        
        for (let i = 0; i < datas.length; i++){
          newData.push(JSON.parse(datas[i]));

          const ecgSize = newData[i].dp.ecg.length;
          
          //1개의 ts에 5개의 ecg가 매핑되어 있어서, 1개의 ts에 1개의 ecg가 매핑되도록
          for (let j = 0; j < ecgSize; j++) {  
            let inputTs;
  
            if (j === 0) {
              inputTs = newData[i].ts;
            } else {
              //마지막 ts와 첫번째 ts를 비교해서, 마지막 ts가 첫번째보다 크면 기록안하기
              if (j === ecgSize - 1 && this.add8MiliSec(newData[i].ts, j) >= newData[i].ts){
                continue;
              }
              inputTs = this.add8MiliSec(newData[i].ts, j);
            }
  
            ecgData[l++] = {ts: inputTs, ecg: newData[i].dp.ecg[j]};  
          }
        }
        this.totalData[index] = newData;
        this.totalEcgData[index] = ecgData;
      });
    }
  }

  private add8MiliSec(ts: number, index: number) {
    let originTs = new Date(ts);
    return originTs.setMilliseconds(originTs.getMilliseconds() + 8 * index);
  }
}

export interface IEcgData {
  ecg: number;
  ts: number;
}

export interface IData {
  dp: {
    ecg: Array<number>
  };
  ts: number;
  index: number;
  patchIndex: string;
  rssi: number;
}

export type TEcgData = {
  [key: number]: IEcgData[];
}

export type TData = {
  [key: number]: IData[];
}