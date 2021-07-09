import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Output() clickButton: EventEmitter<{isPlay: boolean, isStop: boolean}> = new EventEmitter();
  isPlay: boolean = false;
  isStop: boolean = !this.isPlay;

  play(){
    this.isPlay = true;
    this.clickButton.emit({isPlay: this.isPlay, isStop: this.isStop});
  }

  stop() {
    this.isPlay = false;
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
