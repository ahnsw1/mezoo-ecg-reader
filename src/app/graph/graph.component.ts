import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IEcgData, TEcgData } from 'app/app.component';
import * as d3 from 'd3';
import { easeLinear, zoom } from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {

  constructor() { 
    this.width = 1300 - this.margin.left - this.margin.right;
    this.height = 230 - this.margin.top - this.margin.bottom;
    this.periodHeight = this.height - 120;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.currentIndex.currentValue !== undefined) {
      this.getPeriodChart(this.totalEcgData[this.currentIndex], changes.currentIndex.previousValue);
      // this.getEcgChart(this.totalEcgData[this.currentIndex], changes.currentIndex.previousValue);
    }
  }

  ngOnInit(): void {
    console.log(1);
  }

  @Input() currentIndex: number;
  @Input() totalEcgData: TEcgData = {};
  previousIndex: number;
  isPlay: boolean;
  isStop: boolean;
  playButton;
  width: number;
  height: number;
  stopButton;
  periodHeight: number;
  margin = {
    top: 20, right: 60, left: 40, bottom: 20
  };

  getPeriodChart(data: IEcgData[], previousIndex: number) {
    const existPeriodSvg = d3.select(`#prd_${this.currentIndex}`);
    const existEcgSvg = d3.select(`#ecg_${this.currentIndex}`);

    if (!existPeriodSvg.empty() && !existEcgSvg.empty()) {
      d3.select(`#prd_${previousIndex}`).attr("display", "none");
      d3.select(`#ecg_${previousIndex}`).attr("display", "none");
      existEcgSvg.attr("display", "display");
      existPeriodSvg.attr("display", "display");
      return;
    } else {
      d3.selectAll('.prd').attr("display", "none");
      d3.selectAll('.ecg').attr("display", "none");
    }
    //initSvg - Period
    const svg = d3.select('#period-container').append('svg')
      .attr("id", `prd_${this.currentIndex}`)
      .attr("class", "prd")
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 1300 130')

    const ecgSvg = d3.select("#ecg-container").append("svg")
      .attr("id", `ecg_${this.currentIndex}`)
      .attr("class", "ecg")
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 1300 250')

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const ecgG = ecgSvg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    //initAxis
    const xPeriod = d3.scaleTime().range([0, this.width]);
    const xEcg = d3.scaleTime().range([0, this.width]);
    const yPeriod = d3.scaleLinear().range([this.periodHeight, 0]);
    const yEcg = d3.scaleLinear().range([this.height, 0]);

    const xPeriodAxis = d3.axisBottom(xPeriod.domain(d3.extent(data, d => d.ts)));
    const xEcgAxis: any = d3.axisBottom(xEcg.domain(xPeriod.domain()));
    // y.domain([4000, 12000]);
    yPeriod.domain(d3.extent(data, d => d.ecg));
    const yEcgAxis = d3.axisLeft(yEcg.domain(yPeriod.domain()));

    //ecg clip
    svg.append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height);

    const ecgLine: any = d3.line()
      .x((d: any) => xEcg(d.ts))
      .y((d: any) => yEcg(d.ecg))
      .curve(d3.curveBumpX);

    const periodLine: any = d3.line()
      .x((d: any) => xPeriod(d.ts))
      .y((d: any) => yPeriod(d.ecg))
      .curve(d3.curveBumpX);

    // const line: any = d3.line()
    //   .x((d: any) => xPeriod(d.ts))
    //   .y((d: any) => yPeriod(d.ecg))
    //   .curve(d3.curveBasis);

    const period = g.append("g")
      .attr("class", "period")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    
    const ecg = ecgG.append("g")
      .attr("class", "context")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)

    const zoom: any = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on("zoom", zoomed);

    //brush
    const brush: any = d3.brushX().extent([[0, 0], [this.width, this.periodHeight]]).on("brush end", brushed);
    
    //period x축
    period.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0, ${this.periodHeight + .9})`)
      .call(xPeriodAxis);

    //ecg x축
    ecg.append("g")
      .attr("class", "axis--x")
      .attr("transform", `translate(0, ${this.height})`)
      .call(xEcgAxis);

    //ecg y축
    ecg.append("g")
      .attr("class", "axis--y")
      .call(yEcgAxis);

    //period 그리기
    const periodPath = period.append('path')
      .datum(data)
      .attr('class', 'line-path')
      .attr("fill", "none")
      .attr("clip-path", "url(#clip)")
      .attr("stroke", "blue")
      // .attr("height", `${this.periodHeight}`)
      .attr("stroke-width", ".1px")
      .attr('d', periodLine);
    
      //ecg 그리기
    const ecgPath = ecg.append('path')
      .datum(data)
      .attr('class', 'line-path')
      .attr("clip-path", "url(#clip)")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", ".1px")
      .attr('d', ecgLine);
    
      //brush 그리기
    const brushPath = period.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, [0, this.width / 8]);

    // const newBrush = period.append("g")
    //   .attr("fill", "black")
    //   .attr("width", "200px")
    //   .attr("height", this.periodHeight)
    //   .attr("class", "brush");
    

    //zoom 그리기
    ecgSvg.append("rect")
      .attr("class", "zoom")
      .attr("cursor", "move")
      .attr("fill", "none")
      // .attr("pointer-events", "all")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("transform", "translate(20, 0)")
      .call(zoom);

    //controller
    if (d3.select("#btn-play").empty()) {
      this.playButton = d3.select("#controller-container").append("button").attr("id", "btn-play").text("재생");
      this.stopButton = d3.select("#controller-container").append("button").attr("id", "btn-stop").text("멈춤");
    }
    

    this.playButton.on("click", () => {
      
      brushPath.attr("transform", null)
        .transition().duration(50000)
        .ease(easeLinear)
        .call(brush.move, [this.width - +brushPath.select(".selection").attr("width"), this.width])
    });

    this.stopButton.on("click", () => {
      const selection = brushPath.select(".selection")
      brushPath.call(brush.move, [+selection.attr("x"), +selection.attr("x") + +selection.attr("width")]);
    })

    //drawAxis!
    // g.append('g')
    //   .attr('class', 'axis axis--x')
    //   .attr('transform', `translate(0, ${this.height})`)
    //   .call(d3.axisBottom(xPeriod));

    // g.append('g')
    //   .attr('class', 'axis axis--y')
    //   .call(d3.axisLeft(yPeriod))
    //   .append('text')
    //   .attr('class', 'axis-title')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', -50)
    //   .attr('dy', '0.71em')
    //   .attr('text-anchor', 'middle')
    //   .text('ECG');


    

    //drawLineAndPath
    // const periodPath = g.append('path')
    //   .datum(data)
    //   .attr('class', 'line-path')
    //   .attr("fill", "none")
    //   .attr("stroke", "blue")
    //   .attr("stroke-width", ".1px")
    //   .attr('d', line);
    
    // const ecgPath = g.append('path')
    //   .datum(data)
    //   .attr('class', 'line-path')
    //   .attr("fill", "none")
    //   .attr("stroke", "blue")
    //   .attr("stroke-width", ".1px")
    //   .attr('d', line);

    

    function brushed(event) {
      if (event.type === "zoom") return;
      const s = event.selection || xPeriod.range();

      xEcg.domain(s.map(xPeriod.invert, xPeriod));
      ecg.select(".line-path").attr("d", ecgLine);
      ecg.select(".axis--x").call(xEcgAxis);
    }

    function zoomed(event){
      if (event.type === "brush") return;
      const t = event.transform;
      xEcg.domain(t.rescaleX(xPeriod).domain());
      ecg.select(".line-path").attr("d", ecgLine);
      ecg.select(".axis--x").call(xEcgAxis);
      // period.select(".brush").call(brush.move, xEcg.range().map(t.invertX, t));
    }
  }

  

}
