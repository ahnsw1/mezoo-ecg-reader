import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IEcgData, TEcgData, TTotalConvertedData } from 'app/app.component';
import * as d3 from 'd3';
import { axisLeft, axisRight, easeLinear, select, selectAll } from 'd3';
import { TTotalConvertedDatas, IResData } from '../../app.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {

  constructor() {
    this.width = 1500 - this.margin.right - this.margin.left;
    this.height = 130;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentIndex.currentValue !== undefined) {
      this.getPeriodChart(this.totalConvertedData[this.currentIndex], changes.currentIndex.previousValue);
    }
  }

  ngOnInit(): void {
  }

  isPlay: boolean = false;
  @Input() totalConvertedData: TTotalConvertedDatas = {};
  resConvertedData: IResData[] = [];
  ecgConvertedData: IResData[] = [];
  @Input() currentIndex: number;
  xResLeftIndex: number = 0;
  xResRightIndex: number = 0;
  xLeftIndex: number = 0;
  xRightIndex: number = 0;
  xResLeftTs: number = 0;
  xResRightTs: number = 0;
  xLeftTs: number = 0;
  xRightTs: number = 0;
  xLeft: number = 0;
  xRight: number = 0;
  previousIndex: number;
  width: number;
  height: number;
  brushWidth: number;
  margin = {
    top: 20, right: 40, left: 20, bottom: 20
  };

  getPeriodChart(data: TTotalConvertedData, previousIndex: number) {
    d3.selectAll('svg').remove();

    const svg = d3
      .select('#period-container').append('svg')
      .attr("class", "prd")
      .attr('width', this.width)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height}`)

    const g = svg.append('g')
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)

    let maxYAxisValue = -Infinity;
    for (let key of Object.keys(data)) {
      const maxYAxisValuePerBucket = Math.ceil(d3.max<object, number>(data[key], d => d["val"]));
      maxYAxisValue = Math.max(maxYAxisValuePerBucket, maxYAxisValue);
    }

    //initAxis
    const xPeriod = d3.scaleTime().range([0, this.width]).domain(d3.extent(data.ecg, d => d.ts));
    const yPeriod = d3.scaleLinear().range([this.height, 0]).domain([0, maxYAxisValue]);

    const xPeriodAxis = d3.axisBottom(xPeriod);

    const periodLine: any = d3.line()
      .x((d: any) => xPeriod(d.ts))
      .y((d: any) => yPeriod(d.val))
      .curve(d3.curveBumpX);

    const period = g.append("g")
      .attr("class", "period")
      .attr("width", this.width)

    //period x축
    period.append("g")
      .attr("class", "axis axis--x")
      // .attr("transform", `translate(0, ${this.height + .9})`)
      .attr("transform", `translate(${this.margin.left}, ${this.height - this.margin.bottom})`)
      .attr("width", this.width)
      .call(xPeriodAxis);

      //그리기
    period.append('path')
      .datum(data.ecg)
      .attr('class', 'line-path')
      .attr("fill", "none")
      .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
      .attr("stroke", "blue")
      .attr("width", this.width)
      .attr("stroke-width", ".2px")
      .attr('d', periodLine);

    period.append("path")
      .datum(data.res)
      .attr('class', 'line-path')
      .attr("fill", "none")
      .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
      .attr("width", this.width)
      .attr("stroke", "red")
      .attr("stroke-width", ".2px")
      .attr('d', periodLine);

    this.brushWidth = 200;
    //brush 그리기
    period
      .append("rect")
      .attr("fill", "black")
      .attr("id", "selection")
      .attr("fill-opacity", "0.3")
      .attr("width", this.brushWidth)
      // .attr("transform", `translate(0, ${-this.margin.bottom})`)
      .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
      .attr("height", this.height)
      .attr("x", "0")
      .style("z-index", 10)
      .style("cursor", "move");

    const selection = document.getElementById('selection');

    // this.getBrush(selection, this.width);
    let b = selection.getBoundingClientRect()

    if (selection.style.left) {
      selection.style.left = "0px";
    }

    //초기값
    this.xLeftTs = [0, this.brushWidth].map(xPeriod.invert, xPeriod)[0].getTime();
    this.xRightTs = [0, this.brushWidth].map(xPeriod.invert, xPeriod)[1].getTime();

    this.xLeftTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
    this.xRightTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

    this.xLeftIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xLeftTs);
    this.xRightIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xRightTs);

    this.xResLeftTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
    this.xResRightTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

    this.xResLeftIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResLeftTs);
    this.xResRightIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResRightTs);

    this.ecgConvertedData = this.totalConvertedData[this.currentIndex].ecg.slice(this.xLeftIndex, this.xRightIndex);
    this.resConvertedData = this.totalConvertedData[this.currentIndex].res.slice(this.xResLeftIndex, this.xResRightIndex);

    var pos1 = 0, pos3 = 0;

    selection.onmousedown = e => {
      pos3 = e.clientX; //처음 눌렀을 때의 마우스 x좌표

      selection.onmousemove = (event) => {
        pos1 = event.clientX - pos3; //이동후 마우스의 x좌표 - 처음 눌렀을 때의 마우스 x좌표

        if (+selection.getAttribute("x") < 0) {
          selection.setAttribute("x", "0");

          // this.xLeft = 0;
          // this.xRight = this.brushWidth;

          // this.xLeftTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[0].getTime();
          // this.xRightTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[1].getTime();

          // this.xLeftTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
          // this.xRightTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

          // this.xLeftIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xLeftTs);
          // this.xRightIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xRightTs);

          // this.xResLeftTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
          // this.xResRightTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

          // this.xResLeftIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResLeftTs);
          // this.xResRightIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResRightTs);

          // this.ecgConvertedData = this.totalConvertedData[this.currentIndex].ecg.slice(this.xLeftIndex, this.xRightIndex);
          // this.resConvertedData = this.totalConvertedData[this.currentIndex].res.slice(this.xResLeftIndex, this.xResRightIndex);
          return;

        } else if (+selection.getAttribute("x") - b.left + b.right > this.width) {
          selection.setAttribute("x", `${this.width - (b.right - b.left)}`);
          // this.xLeft = this.width - (b.right - b.left);
          // this.xRight = this.width;

          // this.xLeftTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[0].getTime();
          // this.xRightTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[1].getTime();

          // this.xLeftTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
          // this.xRightTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

          // this.xLeftIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xLeftTs);
          // this.xRightIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xRightTs);

          // this.xResLeftTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
          // this.xResRightTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

          // this.xResLeftIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResLeftTs);
          // this.xResRightIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResRightTs);

          // this.ecgConvertedData = this.totalConvertedData[this.currentIndex].ecg.slice(this.xLeftIndex, this.xRightIndex);
          // this.resConvertedData = this.totalConvertedData[this.currentIndex].res.slice(this.xResLeftIndex, this.xResRightIndex);
          return;
        }

        selection.setAttribute("x", `${+selection.getAttribute("x") + pos1}`);
        // this.xLeft = +selection.getAttribute("x");
        // this.xRight = +selection.getAttribute("x") + b.right - b.left;

        // this.xLeftTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[0].getTime();
        // this.xRightTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[1].getTime();

        // this.xLeftTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
        // this.xRightTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

        // this.xLeftIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xLeftTs);
        // this.xRightIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xRightTs);

        // this.xResLeftTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
        // this.xResRightTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

        // this.xResLeftIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResLeftTs);
        // this.xResRightIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResRightTs);

        // this.ecgConvertedData = this.totalConvertedData[this.currentIndex].ecg.slice(this.xLeftIndex, this.xRightIndex);
        // this.resConvertedData = this.totalConvertedData[this.currentIndex].res.slice(this.xResLeftIndex, this.xResRightIndex);

        pos3 = event.clientX; //움직였을때의 마지막 x좌표
      }

      selection.onmouseup = (event) => {
        selection.onmouseup = null;
        selection.onmousemove = null;
      };

      selection.onmouseleave = () => {
        selection.onmousemove = null;
      }
    };

    let observer = new MutationObserver(mutations => {
      if (mutations[0].attributeName === 'x') {

        this.xLeft = selection.getBoundingClientRect().left - document.querySelector(".prd .axis--x").getBoundingClientRect().left;
        this.xRight = selection.getBoundingClientRect().right - document.querySelector(".prd .axis--x").getBoundingClientRect().left;
        
        this.xLeftTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[0].getTime();
        this.xRightTs = [this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[1].getTime();

        this.xLeftTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
        this.xRightTs = this.totalConvertedData[this.currentIndex].ecg.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

        this.xLeftIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xLeftTs);
        this.xRightIndex = this.totalConvertedData[this.currentIndex].ecg.findIndex(item => item.ts === this.xRightTs);

        this.xResLeftTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xLeftTs) < Math.abs(prev.ts - this.xLeftTs) ? curr : prev).ts;
        this.xResRightTs = this.totalConvertedData[this.currentIndex].res.reduce((prev, curr) => Math.abs(curr.ts - this.xRightTs) < Math.abs(prev.ts - this.xRightTs) ? curr : prev).ts;

        this.xResLeftIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResLeftTs);
        this.xResRightIndex = this.totalConvertedData[this.currentIndex].res.findIndex(item => item.ts === this.xResRightTs);

        this.ecgConvertedData = this.totalConvertedData[this.currentIndex].ecg.slice(this.xLeftIndex, this.xRightIndex);
        this.resConvertedData = this.totalConvertedData[this.currentIndex].res.slice(this.xResLeftIndex, this.xResRightIndex);
      }
    })

    let config = { attributes: true, childList: true, characterData: true };
    observer.observe(selection, config);

    //brush 이동 이벤트

  }

  clickButtonHandler(event) {
    const selection = document.getElementById("selection");

    if (!d3.select("#selection").empty()) {
      if (event.isPlay){
        d3.select("#selection").transition().duration(40000).ease(easeLinear).attr("x", this.width - this.brushWidth)
      } else {
        d3.select("#selection").transition().duration(0).ease(easeLinear).attr("x", selection.getAttribute("x"));
      }
    }
    console.log(selection);
  }

}
