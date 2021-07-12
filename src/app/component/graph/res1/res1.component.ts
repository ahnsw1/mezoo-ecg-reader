import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { IResData } from '../../../app.component';

@Component({
  selector: 'app-res1',
  templateUrl: './res1.component.html',
  styleUrls: ['./res1.component.css']
})
export class Res1Component implements OnInit, OnChanges {

  constructor() {
    this.width = 1500 - this.margin.right - this.margin.left;
    this.height = 330;
  }

  width: number;
  height: number;
  margin = {
    top: 20, right: 40, left: 20, bottom: 20
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.getResChart();
  }

  @Input() resConvertedData: IResData[] = [];

  ngOnInit(): void {
  }

  getResChart() {
    if (this.resConvertedData.length === 0) {
      return;
    }

    d3.selectAll("#res-container svg").remove();

    const resSvg = d3.select("#res-container").append("svg")
      .attr("class", "res")
      .attr('width', this.width)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      // .attr("transform", `translate(${this.margin.left}, 0)`)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    const resG = resSvg.append('g')
    // .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const xRes = d3.scaleTime().range([0, this.width]).domain(d3.extent(this.resConvertedData, d => d.ts));
    const yRes = d3.scaleLinear().range([this.height, 0]).domain(d3.extent(this.resConvertedData, d => d.val));

    const xResAxis = d3.axisBottom(xRes);
    const yResAxis = d3.axisLeft(yRes);

    const resLine: any = d3.line()
      .x((d: any) => xRes(d.ts))
      .y((d: any) => yRes(d.val))
      .curve(d3.curveBumpX);

    const res = resG.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)

    //res x축
    res.append("g")
      .attr("class", "axis--x")
      .attr("transform", `translate(${this.margin.left}, ${this.height - this.margin.bottom})`)
      .call(xResAxis);

    //res y축
    res.append("g")
      .attr("class", "axis--y")
      .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
      .call(yResAxis);

    //res 그리기
    // const resPath = 
    res.append('path')
      .datum(this.resConvertedData)
      .attr('class', 'line-path')
      // .attr("clip-path", "url(#clip)")
      .attr("fill", "none")
      .attr("transform", `translate(${this.margin.left}, ${-this.margin.bottom})`)
      .attr("width", this.width)
      .attr("stroke", "red")
      .attr("stroke-width", ".2px")
      .attr('d', resLine);

  }

}
