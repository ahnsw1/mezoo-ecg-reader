import { Component, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ApiService } from 'app/service/api.service';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
// import { Observable, Timestamp } from 'rxjs';
// import { JsonpClientBackend } from '@angular/common/http';
// import { timeStamp } from 'console';
// import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent implements OnInit, OnChanges {

  constructor(private service: ApiService) { 
    this.width = 1300 - this.margin.left - this.margin.right;
    this.height = 130 - this.margin.top - this.margin.bottom;
  }
  
  ngOnInit(): void {    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.currentIndex.previousValue >= 0) {
      this.getUserData(this.currentIndex, changes.currentIndex.previousValue);
    }
  }
  
  @Input() currentIndex: number;
  
  width :number;
  height :number;
  margin = {
      top: 20, right: 60, left: 40, bottom: 20
  };
  periodData = [];
  render(data: IData[]) {
    const height = 140;
    const width = 1400;

    const svg: any = d3.select("#period-container").append("svg").attr("width", width).attr("height", height);

    const xValue = d => d.ts;
    const yValue = d => d.ecg;

    const innerWidth = width - this.margin.right - this.margin.left;
    const innerHeight = height - this.margin.top - this.margin.bottom;
    const xScale = d3Scale.scaleTime().domain(d3Array.extent(data, xValue)).range([0, innerWidth]).nice();
    // const yScale = d3Scale.scaleLinear().domain(d3Array.extent(data, yValue[0])).range([0, innerHeight]).nice();

    const g = svg.append("g").attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    
    g.append("g").call(d3Axis.axisBottom(xScale).tickSize(-innerHeight).tickPadding(5))
      .attr("transform", `translate(0, ${innerHeight})`).attr("");

    // g.append("g")
    //   .attr("class", "grid")
    //   .attr("transform", `translat(0, 0)`)
    //   .call(d3.axisBottom(xScale).tickSize(-height));

  }

  //data.ts >> 시간
  //data.patchIndex >> 앞뒤구분
  getUserData(index: number, previousIndex: number){
    this.service.getJson(index).toPromise().then(data => {

      let newData: IData[] = [];
      let datas = data.toString().split("\n");
      // const size = datas.length;

      // for (let i = 0; i < size; i++) {
      //   newData.push(JSON.parse(datas[i]));
      // }

      
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

          this.periodData[l++] = {ts: inputTs, ecg: newData[i].dp.ecg[j]};  
        }
      }
      // this.render(newData);
      this.getPeriodChart(this.periodData, previousIndex);
    });
  }

  private add8MiliSec(ts: number, index: number) {
    let originTs = new Date(ts);
    return originTs.setMilliseconds(originTs.getMilliseconds() + 8 * index);
  }
  
  getPeriodChart(data: IPeriodData[], previousIndex: number) {
    // d3.selectAll("svg").remove();
    const existSvg = d3.select(`#svg_${this.currentIndex}`);

    if (!existSvg.empty()) {
      d3.select(`#svg_${previousIndex}`).attr("display", "none");      
      existSvg.attr("display", "display");
      return;
    } else {
      d3.selectAll('svg').attr("display", "none");
    }
    //initSvg
    const svg = d3.select('#period-container').append('svg')
      .attr("id", `svg_${this.currentIndex}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 1300 130')
    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    //initAxis
    // const x = d3Scale.scaleTime().domain(d3Array.extent(data, d => new Date(d.ts))).range([0, this.width]).nice();
    const x = d3Scale.scaleTime().range([0, this.width]);
    // const y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    const y = d3Scale.scaleLinear().range([this.height, 0]);
    // x.domain(data.map(d => new Date(d.ts)));
    x.domain(d3Array.extent(data, d => new Date(d.ts)));

    y.domain(d3Array.extent(data, d => d.ecg));
    // y.domain([0, d3Array.max(data, d => d.ecg)]);

    //drawAxis
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3Axis.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'middle')
      .text('ECG');


    const line: any = d3Shape.line()
      .x((d: any) => x(new Date(d.ts)))
      .y((d: any) => y(d.ecg))
      .curve(d3.curveBasis);

    //drawLineAndPath
    g.append('path')
      .datum(data)
      .attr('class', 'line-path')
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", ".1px")
      .attr('d', line);
  }

}

export interface IPeriodData {
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
