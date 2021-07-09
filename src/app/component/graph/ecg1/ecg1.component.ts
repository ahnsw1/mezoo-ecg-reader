import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ecg1',
  templateUrl: './ecg1.component.html',
  styleUrls: ['./ecg1.component.css']
})
export class Ecg1Component implements OnInit, OnChanges {

  constructor() { 
    this.width = 1300 - this.margin.left - this.margin.right;
    this.height = 130 - this.margin.top - this.margin.bottom;
  }

  width: number;
  height: number;
  margin = {
    top: 20, right: 60, left: 40, bottom: 20
  };

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

}
