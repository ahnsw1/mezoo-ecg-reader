import { Component, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from './service/api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  totalData: TData = {};
  totalEcgData: TEcgData = {};
  totalTimeData: TTimeData = {};
  totalConvertedData: TTotalConvertedDatas = {};
  startTime: Date;
  endTime: Date;

  constructor(private apiService: ApiService) {
    this.totalConvertedData = {
        0: { ecg: [], res: [] }
      , 1: { ecg: [], res: [] }
      , 2: { ecg: [], res: [] }
      , 3: { ecg: [], res: [] }
    }
  }

  ngOnInit() {
    this.getUserData();
  }

  indexChangedHandler(currentIndex: number) {
    this.currentIndex = currentIndex;
    this.startTime = this.totalTimeData[this.currentIndex].startTime;
    this.endTime = this.totalTimeData[this.currentIndex].endTime;
  }
  
  getUserData(){
    for (let index = 0; index < 4; index++){
      this.apiService.getFullJson(index).toPromise().then(data => {
        
        let newData: IData[] = [];
        let ecgData: IResData[] = []; 
        // let ecgData: IEcgData[] = []; 
        let resData: IResData[] = [];
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
  
            ecgData[l++] = {ts: inputTs, val: newData[i].dp.ecg[j]};
          }

          //호흡신호 데이터 변환
          resData[i] = {val: newData[i].dp.F1, ts: newData[i].ts}
        }
        this.totalData[index] = newData;
        // this.totalEcgData[index] = ecgData;
        this.totalConvertedData[index].ecg = ecgData;
        this.totalConvertedData[index].res = resData;
        this.totalTimeData[index] = this.getTime(newData);
      });
    }
  }

  private add8MiliSec(ts: number, index: number) {
    let originTs = new Date(ts);
    return originTs.setMilliseconds(originTs.getMilliseconds() + 8 * index);
  }

  getTime(data: IData[]): ITimeData {
      const timeDiff = data[data.length - 1].ts - data[0].ts;
      const totalHours = Math.floor(timeDiff / 1000 / 60 / 60); 
      const totalMinutes = Math.floor(timeDiff / 1000 / 60 - totalHours * 60);
      const totalSeconds = Math.round(timeDiff / 1000 - totalMinutes * 60);
      const startTime: Date = new Date(data[0].ts);
      const endTime: Date = new Date(data[data.length - 1].ts);
      return { totalHours, totalMinutes, totalSeconds, startTime, endTime}
  }
}

export interface IEcgData {
  ecg: number;
  ts: number;
}

export interface IResData {
  val: number;
  ts: number;
}

export interface IData {
  dp: {
    ecg: Array<number>,
    F1: number
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

export type TTimeData = {
  [key: number]: ITimeData;
}

export interface ITimeData {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  startTime: Date;
  endTime: Date;
}

export type TTotalConvertedDatas = {
  [key: number]: TTotalConvertedData;
}

export type TTotalConvertedData = {
  ecg: IResData[];
  res: IResData[];
}