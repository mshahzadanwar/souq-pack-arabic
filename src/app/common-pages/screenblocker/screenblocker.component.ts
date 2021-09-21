import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-screenblocker',
  templateUrl: './screenblocker.component.html',
  styleUrls: ['./screenblocker.component.css']
})
export class ScreenblockerComponent implements OnInit {

  constructor(private common:CommonService) { }
  shown_blocker = false;
  ngOnInit() {
    this.common.screen_blocker_after.subscribe((data)=>{
      this.shown_blocker = data.shown;
    });
  }
}