import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit, OnChanges {

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.isPlay = false;
  }

  ngOnInit(): void {
  }

  

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
