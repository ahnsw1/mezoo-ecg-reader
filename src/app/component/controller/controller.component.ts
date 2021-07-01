import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isPlay: Boolean = false;

  play(){
    this.isPlay = true;
  }

  pause() {
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
