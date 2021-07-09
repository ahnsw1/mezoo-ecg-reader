import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IEcgData, TEcgData } from 'app/app.component';
import * as d3 from 'd3';
import { easeLinear } from 'd3';

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
    if (changes.currentIndex.currentValue !== undefined) {
      this.getPeriodChart(this.totalEcgData[this.currentIndex], changes.currentIndex.previousValue);
    }
  }

  ngOnInit(): void {
  }

  @Input() currentIndex: number;
  @Input() totalEcgData: TEcgData = {};
  previousIndex: number;
  isPlay: boolean;
  isStop: boolean;
  playButton;
  width: number;
  height: number;
  brushWidth: number;
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
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
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
    const xPeriod = d3.scaleTime().range([0, this.width]).domain(d3.extent(data, d => d.ts));
    const xEcg = d3.scaleTime().range([0, this.width]).domain(xPeriod.domain());
    const yPeriod = d3.scaleLinear().range([this.periodHeight, 0]);
    const yEcg = d3.scaleLinear().range([this.height, 0]);

    
    this.brushWidth = 200;
    xEcg.domain([0, 150].map(xPeriod.invert, xPeriod))

    const xPeriodAxis = d3.axisBottom(xPeriod);
    const xEcgAxis: any = d3.axisBottom(xEcg);
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
    
    const brush: any = period
      .append("rect")
      .attr("fill", "black")
      .attr("id", "selection")
      .attr("fill-opacity", "0.3")
      .attr("width", this.brushWidth)
      .attr("height", this.periodHeight)
      .attr("x", "0")
      .style("z-index", 10)
      .style("cursor", "move");

    const selection = document.querySelector(`#prd_${this.currentIndex} #selection`);
    this.getBrush(selection, this.width);

    const parentX = selection.getBoundingClientRect().left;

    let observer = new MutationObserver(mutations => {
      if (mutations[0].attributeName === 'x') {
        var s = [selection.getBoundingClientRect().left - parentX, selection.getBoundingClientRect().right - parentX];
        xEcg.domain(s.map(xPeriod.invert, xPeriod));
        ecg.select(".line-path").attr("d", ecgLine);
        ecg.select(".axis--x").call(xEcgAxis);
      }
    })

    let config = { attributes: true, childList: true, characterData: true };
    observer.observe(selection, config);

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
      .attr("stroke-width", ".1px")
      .attr('d', periodLine);
    
      //ecg 그리기
    const ecgPath = ecg.append('path')
      .datum(data)
      .attr('class', 'line-path')
      .attr("clip-path", "url(#clip)")
      .attr("fill", "none")
      .attr("width", this.width)
      .attr("stroke", "blue")
      .attr("stroke-width", ".1px")
      .attr('d', ecgLine);    
    
    //zoom 그리기
    ecgSvg.append("rect")
      .attr("class", "zoom")
      .attr("cursor", "move")
      .attr("fill", "none")
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
      d3.select("#selection").transition().duration(80000).ease(easeLinear).attr("x", this.width - this.brushWidth);
    });

    this.stopButton.on("click", () => {
      d3.select("#selection").transition().duration(0).ease(easeLinear).attr("x", selection.getAttribute("x"));
    })
    
    function zoomed(event){
      if (event.type === "brush") return;
      const t = event.transform;
      xEcg.domain(t.rescaleX(xPeriod).domain());
      ecg.select(".line-path").attr("d", ecgLine);
      ecg.select(".axis--x").call(xEcgAxis);
    }
  }

  getBrush(elmnt, maxWidth) {
    let b = elmnt.getBoundingClientRect()

    var parentX = b.left;

    if (elmnt.style.left) {
      elmnt.style.left = "0px";
    }
    var pos1 = 0, pos3 = 0;

    elmnt.onmousedown = e => {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX; //처음 눌렀을 때의 마우스 x좌표

      elmnt.onmousemove = (event) => {
        event = event || window.event;
        event.preventDefault();

        pos1 = event.clientX - pos3; //이동후 마우스의 x좌표 - 처음 눌렀을 때의 마우스 x좌표

        const elementX = parentX
        const moveX = pos1; //마우스가 움직인 x좌표

        if (elmnt.getAttribute("x") < 0) {
          elmnt.setAttribute("x", 0);
          elmnt.onmousemove = null;
          return;

        } else if (+elmnt.getAttribute("x") - b.left + b.right > maxWidth) {
          elmnt.setAttribute("x", maxWidth - (b.right - b.left));
          elmnt.onmousemove = null;
          return;
        }

        elmnt.setAttribute("x", (+elmnt.getAttribute("x") + moveX));
        pos3 = event.clientX; //움직였을때의 마지막 x좌표
      }

      elmnt.onmouseup = (event) => {
        event = event || window.event;
        event.preventDefault();

        elmnt.onmouseup = null;
        elmnt.onmousemove = null;
      };

      // elmnt.onmouseleave = (event) => {
      //   elmnt.onmousemove = null;
      // }
    };
  }

  

}
