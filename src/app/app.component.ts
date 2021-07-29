import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from './service/api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TestBed } from '@angular/core/testing';
import { first, isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
  ]
})
export class AppComponent implements OnInit {
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
      , 4: { ecg: [], res: [] }
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

  // getUserData1() {
  //   for (let index = 0; index < 4; index++) {
  //     this.apiService.getFullJson(index).toPromise().then(data => {

  //       let newData: IData[] = [];
  //       let ecgData: IResData[] = [];
  //       // let ecgData: IEcgData[] = []; 
  //       let resData: IResData[] = [];
  //       let datas = data.toString().split("\n");
  //       let bIsEmpty: boolean = false;

  //       let standardTs = JSON.parse(datas[0]).ts; //기준이 되는 ts
  //       let standardIndex = 0;
  //       let l = 0;

  //       for (let i = 0; i < datas.length; i++) {
  //         newData.push(JSON.parse(datas[i]));

  //         let inputEcg;
  //         let inputRes;
  //         let resAddedIndex = 0;

  //         //이후 데이터의 ts와 100ms이상 차이나거나, 이후 데이터의 index와 비교해서 이후 index가 더 작으면 공백으로 인식 - 데이터가 누락된 경우 null을 넣고, 시간값은 넣어주기. 
  //         if (i > 0
  //           && ((newData[i].ts - newData[i - 1].ts > 100) || (newData[i].index && newData[i - 1].index > newData[i].index))) {
  //           const previousData = newData[i - 1].ts + 40;
  //           let n = 0;

  //           while (true) {
  //             if (previousData + 8 * (n + 1) > newData[i].ts) {
  //               break;
  //             }
  //             ecgData[l] = { ts: previousData + 8 * (n + 1), val: undefined };
  //             n++;
  //             l++;
  //           }
  //           while (true) {
  //             if (previousData + 40 * (resAddedIndex + 1) > newData[i].ts) {
  //               break;
  //             }
  //             resData[i + resAddedIndex] = { ts: previousData + 40 * (resAddedIndex + 1), val: undefined };
  //             resAddedIndex++;
  //           }
  //           standardTs = newData[i].ts
  //           standardIndex = i;
  //         }

  //         const ecgSize = newData[i].dp.ecg.length ? newData[i].dp.ecg.length : 5;

  //         //1개의 ts에 5개의 ecg가 매핑되어 있어서, 1개의 ts에 1개의 ecg가 매핑되도록
  //         //맨 처음 시간을 기준으로 이후의 심전도 데이터 시간을 8ms씩 더해서 넣기
  //         for (let j = 0; j < ecgSize; j++) {
  //           let inputTs = standardTs + 8 * (5 * (i - standardIndex) + j);

  //           inputEcg = newData[i].dp.ecg[j];

  //           ecgData[l] = { ts: inputTs, val: inputEcg };
  //           l++;
  //         }
  //         resData[i + resAddedIndex] = { ts: standardTs + 8 * (5 * (i + resAddedIndex - standardIndex)), val: newData[i].dp.F1 }

  //       }
  //       this.totalData[index] = newData;
  //       this.totalConvertedData[index].ecg = ecgData;
  //       this.totalConvertedData[index].res = resData;
  //       this.totalTimeData[index] = this.getTime(newData);
  //       console.log("ecg", ecgData)
  //       console.log("Res", resData)
  //     });
  //   }
  // }

  getUserData() {
    for (let index = 0; index < 4; index++) {
      this.apiService.getFullJson(index).toPromise().then(data => {

        let newData: IData[] = [];
        let ecgData: IResData[] = [];
        // let ecgData: IEcgData[] = []; 
        let resData: IResData[] = [];
        let datas = data.toString().split("\n");
        let resAddedIndex = 0;
        let l = 0;

        let standardTs = JSON.parse(datas[0]).ts; //기준이 되는 ts
        let standardIndex = 0;
        for (let i = 0; i < datas.length; i++) {
          
          newData.push(JSON.parse(datas[i]));

          const ecgSize = newData[i].dp.ecg.length;

          //텀이 100 차이가 나거나 index가 달라진 경우
          if (i > 0
            && ((newData[i].ts - newData[i - 1].ts > 100) || (newData[i].index && newData[i - 1].index > newData[i].index))) {
            const previousData = newData[i - 1].ts;
            let n = 0;

            while (true) {
              if (previousData + 40 + 8 * n > newData[i].ts) {
                break;
              }
              ecgData[l] = { ts: previousData + 40 + 8 * n, val: undefined };
              n++;
              l++;
            }
            while (true) {
              if (previousData + 40 * (resAddedIndex + 1) >= newData[i].ts) {
                break;
              }
              resData[i + resAddedIndex] = { ts: previousData + 40 * (resAddedIndex + 1), val: undefined };
              resAddedIndex++;
            }
            standardTs = newData[i].ts
            standardIndex = i;
          }

          //1개의 ts에 5개의 ecg가 매핑되어 있어서, 1개의 ts에 1개의 ecg가 매핑되도록
          for (let j = 0; j < ecgSize; j++) {
            let inputTs;

            if (j === 0) {
              inputTs = newData[i].ts;
            } else {
              //마지막 ts와 첫번째 ts를 비교해서, 마지막 ts가 첫번째보다 크면 기록안하기
              if (j === ecgSize - 1 && this.add8MiliSec(newData[i].ts, j) >= newData[i + 1]?.ts) {
                continue;
              }
              inputTs = this.add8MiliSec(newData[i].ts, j);
            }

            ecgData[l] = { ts: inputTs, val: newData[i].dp.ecg[j] };
            l++;
          }
          // resData[i + resAddedIndex] = { ts: newData[i].ts + 40 * (i + resAddedIndex), val: newData[i].dp.F1 };
          resData[i + resAddedIndex] = { ts: newData[i].ts, val: newData[i].dp.F1 }
        }

        this.totalData[index] = newData;
        this.totalConvertedData[index].ecg = ecgData;
        this.totalConvertedData[index].res = resData;
        this.totalTimeData[index] = this.getTime(newData);
        // console.log("tot", this.totalData)
        // console.log("ecg", ecgData)
      });
    }
  }

  //현재 시간 + (8 * index)ms를 반환
  private add8MiliSec(ts: number, index: number) {
    let originTs = new Date(ts);
    return originTs.setMilliseconds(originTs.getMilliseconds() + 8 * index);
  }

  getTime(data: IData[]): ITimeData {
    let timeDiff = data[data.length - 1].ts - data[0].ts;
    const totalHours = Math.floor(timeDiff / 1000 / 60 / 60);
    timeDiff -= totalHours * 60 * 60 * 1000;

    const totalMinutes = Math.floor(timeDiff / 1000 / 60);
    timeDiff -= totalMinutes * 60 * 1000;

    const totalSeconds = Math.round(timeDiff / 1000);

    const startTime: Date = new Date(data[0].ts);
    const endTime: Date = new Date(data[data.length - 1].ts);
    return { totalHours, totalMinutes, totalSeconds, startTime, endTime }
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