import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ApiService } from 'app/service/api.service';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Shape from 'd3-shape';
import { IEcgData, TEcgData } from 'app/app.component';


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
    if(changes.currentIndex.currentValue !== undefined) {
      this.getPeriodChart(this.totalEcgData[changes.currentIndex.currentValue], changes.currentIndex.previousValue);
    }
  }
  
  @Input() currentIndex: number;
  @Input() totalEcgData: TEcgData = {};
  previousIndex: number;
  width :number;
  height :number;
  margin = {
    top: 20, right: 60, left: 40, bottom: 20
  };
  
  getPeriodChart(data: IEcgData[], previousIndex: number) {
    const existSvg = d3.select(`#prd_${this.currentIndex}`);

    if (!existSvg.empty()) {
      d3.select(`#prd_${previousIndex}`).attr("display", "none");      
      existSvg.attr("display", "display");
      return;
    } else {
      d3.selectAll('.prd').attr("display", "none");
    }
    //initSvg
    const svg = d3.select('#period-container').append('svg')
      .attr("id", `prd_${this.currentIndex}`)
      .attr("class", "prd")
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 1300 130')
    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    //initAxis
    const x = d3Scale.scaleTime().range([0, this.width]);
    const y = d3Scale.scaleLinear().range([this.height, 0]);
    x.domain(d3Array.extent(data, d => new Date(d.ts)));
    // y.domain([4000, 12000]);
    y.domain(d3Array.extent(data, d => d.ecg));

    //drawAxis!
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