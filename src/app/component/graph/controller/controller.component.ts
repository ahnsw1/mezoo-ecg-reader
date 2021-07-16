import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit, OnChanges {

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentTime?.currentValue) {
      let totalDate = new Date(changes.currentTime?.currentValue);
      this.currentHour = totalDate.getHours() < 10 ? "0" + totalDate.getHours() : totalDate.getHours();
      this.currentMinute = totalDate.getMinutes() < 10 ? "0" + totalDate.getMinutes() : totalDate.getMinutes();
      this.currentSecond = totalDate.getSeconds() < 10 ? "0" + totalDate.getSeconds() : totalDate.getSeconds();
    }
  }

  ngOnInit(): void {
  }
  
  @Input() currentTime: number = 0;

  currentHour: any = 0;
  currentMinute: any = 0;
  currentSecond: any = 0;

  @Output() clickButton: EventEmitter<{isPlay: boolean}> = new EventEmitter();
  @Input() isPlay: boolean = false;

  play(){
    this.isPlay = true;
    this.clickButton.emit({isPlay: this.isPlay});
  }

  stop() {
    this.isPlay = false;
    this.clickButton.emit({ isPlay: this.isPlay});
  }

  fastBackward(){
    
  }

  fastForward (){

  }

  backForward() {

  }
  stepForward() {

  }
  stepBackward(){

  }
}
