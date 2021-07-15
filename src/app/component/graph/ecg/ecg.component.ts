import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { TTotalConvertedDatas, IResData } from '../../../app.component';

@Component({
  selector: 'app-ecg',
  templateUrl: './ecg.component.html',
  styleUrls: ['./ecg.component.css']
})
export class EcgComponent implements OnInit, OnChanges {

  constructor() { 
    this.width = 1450
    //  - this.margin.right - this.margin.left;
    this.height = 330;
    
  }
  width: number;
  height: number;
  margin = {
    top: 20, right: 40, left: 20, bottom: 20
  };

  @Input() totalConvertedData: TTotalConvertedDatas = {};
  @Input() ecgConvertedData: IResData[] = [];
  @Input() xEcgAddedData: IResData;

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ecgConvertedData?.currentValue?.length > 0) {
      this.getEcgChart();
    }

    if (changes.xEcgAddedData?.currentValue) {
      this.getEcgChart();
    }
  }

  getEcgChart() {
    if (this.ecgConvertedData.length === 0){
      return;
    }
    
      d3.selectAll("#ecg-container svg").remove();

      const ecgSvg = d3.select("#ecg-container").append("svg")
        .attr("class", "ecg")
        .attr('width', this.width)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .attr('viewBox', `0 0 ${this.width} ${this.height}`);

      const ecgG = ecgSvg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      const xEcg = d3.scaleTime().range([0, this.width - this.margin.left - this.margin.right]).domain(d3.extent(this.ecgConvertedData, d => d.ts));
      const yEcg = d3.scaleLinear().range([this.height, 0]).domain(d3.extent(this.ecgConvertedData, d => d.val));

      const xEcgAxis = d3.axisBottom(xEcg);
      const yEcgAxis = d3.axisLeft(yEcg);

      const ecgLine: any = d3.line()
        .x((d: any) => xEcg(d.ts))
        .y((d: any) => yEcg(d.val))
        .curve(d3.curveBumpX);

      const ecg = ecgG.append("g")

      //ecg x축
      ecg.append("g")
        .attr("class", "axis--x")
        .attr("transform", `translate(${this.margin.left}, ${this.height - this.margin.bottom})`)
        .call(xEcgAxis);

      //ecg y축
      ecg.append("g")
        .attr("class", "axis--y")
        .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
        .call(yEcgAxis);

      //ecg 그리기
      ecg.append('path')
        .datum(this.ecgConvertedData)
        .attr('class', 'line-path')
        .attr("fill", "none")
        .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
        .attr("width", this.width - this.margin.left - this.margin.right)
        .attr("stroke", "blue")
        .attr("stroke-width", ".2px")
        .attr('d', ecgLine);
  }
}
