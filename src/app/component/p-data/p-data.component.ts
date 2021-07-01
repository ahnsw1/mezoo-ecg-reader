import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'app/service/api.service';

@Component({
  selector: 'app-p-data',
  templateUrl: './p-data.component.html',
  styleUrls: ['./p-data.component.css']
})
export class PDataComponent implements OnInit {

  constructor(private apiService: ApiService) { }
  @Input() startTime: Date;
  @Input() endTime: Date;

  ngOnInit(): void {

  }
}
