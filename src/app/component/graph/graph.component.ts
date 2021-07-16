import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
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
    this.width = 1450 - this.margin.right - this.margin.left;
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
  xEcgLeftIndex: number = 0;
  xEcgRightIndex: number = 0;
  xLeftIndex: number = 0;
  xRightIndex: number = 0;
  xResAddedData: IResData;
  xEcgAddedData: IResData;
  xResLeftTs: number = 0;
  xResRightTs: number = 0;
  xEcgLeftTs: number = 0;
  xEcgRightTs: number = 0;
  xLeftTs: number = 0;
  currentTs: number = 0;
  xRightTs: number = 0;
  xLeft: number = 0;
  xRight: number = 0;
  previousIndex: number;
  width: number;
  height: number;
  maxEcgYAxisValue;
  maxResYAxisValue;
  brushWidth: number;
  margin = {
    top: 20, right: 30, left: 20, bottom: 20
  };

  getPeriodChart(data: TTotalConvertedData, previousIndex: number) {
    d3.selectAll('svg').remove();

    const svg = d3
      .select('#period-container').append('svg')
      .attr("class", "prd")
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height}`)

    const g = svg.append('g')
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)

    let maxYAxisValue = -Infinity;
    for (let key of Object.keys(data)) {
      const maxYAxisValuePerBucket = Math.ceil(d3.max<object, number>(data[key], d => d["val"]));
      maxYAxisValue = Math.max(maxYAxisValuePerBucket, maxYAxisValue);
    }

    this.maxEcgYAxisValue = -Infinity;
    this.maxResYAxisValue = -Infinity;
    { //for ecg
      const maxYAxisValuePerBucket = Math.ceil(d3.max<object, number>(data["ecg"], d => d["val"]));
      this.maxEcgYAxisValue = Math.max(maxYAxisValuePerBucket, this.maxEcgYAxisValue);
    }

    { //for res
      const maxYAxisValuePerBucket = Math.ceil(d3.max<object, number>(data["res"], d => d["val"]));
      this.maxResYAxisValue = Math.max(maxYAxisValuePerBucket, this.maxResYAxisValue);
    }

    //initAxis
    const xAxis = d3.scaleTime().range([0, this.width]).domain(d3.extent(data.ecg, d => d.ts));
    const xPeriod = d3.scaleLinear().range([0, this.width]).domain([0, data.ecg.length - 1]); //배열의 [0번째, length - 1번째]
    const yPeriod = d3.scaleLinear().range([this.height, 0]).domain([0, maxYAxisValue]);

    const xPeriodAxis = d3.axisBottom(xAxis);

    const periodLine: any = d3.line()
      .x((d: any) => xAxis(d.ts))
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

    this.brushWidth = 11;

    const brushG = period.append("g")
      .attr("id", "brush")
      .attr("width", this.brushWidth).attr("x", 0)
      .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
      .attr("height", this.height);

    brushG
      .append("rect")
      .attr("fill", "black")
      .attr("id", "selection")
      .attr("fill-opacity", "0.3")
      .attr("width", this.brushWidth)
      .attr("height", this.height)
      .attr("x", "0")
      .style("z-index", 5)
      .style("cursor", "move");

    const selection = document.getElementById('selection');

    let b = selection.getBoundingClientRect()

    if (selection.style.left) {
      selection.style.left = "0px";
    }

    //ecg, res 초기값 설정
    {
      this.xLeftIndex = [0, this.brushWidth].map(xPeriod.invert, xPeriod)[0];
      this.xRightIndex = [0, this.brushWidth].map(xPeriod.invert, xPeriod)[1];

      this.ecgConvertedData = this.totalConvertedData[this.currentIndex].ecg.slice(this.xLeftIndex, this.xRightIndex);

      this.resConvertedData = this.totalConvertedData[this.currentIndex].res.slice(this.xLeftIndex, this.xRightIndex);
    }

    var pos1 = 0, pos3 = 0;

    selection.onmousedown = e => {
      pos3 = e.clientX; //처음 눌렀을 때의 마우스 x좌표

      selection.onmousemove = (event) => {
        pos1 = event.clientX - pos3; //이동후 마우스의 x좌표 - 처음 눌렀을 때의 마우스 x좌표

        if (+selection.getAttribute("x") < 0) {
          selection.setAttribute("x", "0");
          return;

        } else if (+selection.getAttribute("x") - b.left + b.right > this.width) {
          selection.setAttribute("x", `${this.width - (b.right - b.left)}`);
          return;
        }

        selection.setAttribute("x", `${+selection.getAttribute("x") + pos1}`);

        pos3 = event.clientX; //움직였을때의 마지막 x좌표
      }

      selection.onmouseup = () => {
        selection.onmouseup = null;
        selection.onmousemove = null;
      };

      selection.onmouseleave = () => {
        selection.onmousemove = null;
      }
    };

    let observer = new MutationObserver(mutations => {
      if (mutations[0].attributeName === 'x') {

        this.xLeft = selection.getBoundingClientRect().left - document.querySelector(".prd .axis--x").getBoundingClientRect().left + 5;
        this.xRight = selection.getBoundingClientRect().right - document.querySelector(".prd .axis--x").getBoundingClientRect().left + 5;

        this.xLeftIndex = Math.floor([this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[0]);
        this.xRightIndex = Math.floor([this.xLeft, this.xRight].map(xPeriod.invert, xPeriod)[1]);

        // if (this.xLeftIndex < 0) {
        //   this.xLeftIndex = 0;
        //   return;
        // }

        // this.currentTs = (this.xLeftTs + this.xRightTs) / 2;

        while (true){
          //왼쪽 index 값을 맨 처음 값으로 만들기(이동해서 얻은 왼쪽 index가 ecg배열의 가장 왼쪽 index 보다 작으면 빼지 않기)
          if (this.totalConvertedData[this.currentIndex].ecg[this.xLeftIndex].ts > this.ecgConvertedData[0].ts) {
            this.ecgConvertedData.shift();
          } else {
            break;
          }
        }
        // 이동해서 얻은 index 값을 맨 오른쪽에 더하기(ecg배열의 마지막 값보다 작거나 같으면 더하지 않기)
        if (this.totalConvertedData[this.currentIndex].ecg[this.xRightIndex].ts > this.ecgConvertedData[this.ecgConvertedData.length - 1].ts) {
          this.xEcgAddedData = this.totalConvertedData[this.currentIndex].ecg[this.xRightIndex];
          this.ecgConvertedData.push(this.xEcgAddedData);
        }

        // this.xEcgAddedData = this.totalConvertedData[this.currentIndex].ecg[this.xRightIndex];
        // this.ecgConvertedData = this.totalConvertedData[this.currentIndex].ecg.slice(this.xLeftIndex, this.xRightIndex);

        // this.ecgConvertedData.shift();
        // this.xEcgAddedData = this.totalConvertedData[this.currentIndex].ecg[this.xRightIndex];
        // this.ecgConvertedData.push(this.xEcgAddedData);

        while (true) {
          //왼쪽 index 값을 맨 처음 값으로 만들기
          if (this.totalConvertedData[this.currentIndex].res[this.xLeftIndex].ts > this.resConvertedData[0].ts) {
            this.resConvertedData.shift();
          } else {
            break;
          }
        }
        // 오른쪽 index 값을 맨 오른쪽에 더하기 (res배열의 마지막 값보다 작거나 같으면 더하지 않기)
        if (this.totalConvertedData[this.currentIndex].res[this.xRightIndex].ts > this.resConvertedData[this.resConvertedData.length - 1].ts) {
          this.xResAddedData = this.totalConvertedData[this.currentIndex].res[this.xRightIndex];
          this.resConvertedData.push(this.xResAddedData);
        }
        
        // this.xResAddedData = this.totalConvertedData[this.currentIndex].res[this.xRightIndex];
        // this.resConvertedData = this.totalConvertedData[this.currentIndex].res.slice(this.xLeftIndex, this.xRightIndex);
        
        // this.xResAddedData = this.totalConvertedData[this.currentIndex].res[this.xRightIndex];
        // this.resConvertedData.shift();
        // this.resConvertedData.push(this.xResAddedData);
      }
    })
    let config = { attributes: true };
    observer.observe(selection, config);
  }

  clickButtonHandler(event) {
    const selection = document.getElementById("selection");

    if (!d3.select("#selection").empty()) {
      if (event.isPlay) {
        d3.select("#selection").transition().duration(1400000).ease(easeLinear).attr("x", this.width - this.brushWidth)
      } else {
        d3.select("#selection").transition().duration(0).ease(easeLinear).attr("x", selection.getAttribute("x"));
      }
      this.isPlay = event.isPlay;
    }
  }
}
