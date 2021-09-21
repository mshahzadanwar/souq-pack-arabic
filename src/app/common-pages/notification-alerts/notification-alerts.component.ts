import { Component, OnInit } from '@angular/core';
import {CommonService} from './../../common.service';
@Component({
  selector: 'app-notification-alerts',
  templateUrl: './notification-alerts.component.html',
  styleUrls: ['./notification-alerts.component.css']
})
export class NotificationAlertsComponent implements OnInit {
  constructor(private common:CommonService) { }
  error_notif = false;
  warning_notif = false;
  notif_data = "Notification";
  shown_notif = false;
  sticky  = false;
  ngOnInit() {
    this.common.notification_after.subscribe((data)=>{
      this.error_notif = data.error || false;
      this.warning_notif = data.warning || false;
      this.shown_notif = data.shown;
      this.notif_data = data.text;
      this.sticky = data.sticky;
      if(this.shown_notif && !this.sticky)
      this.hide_after_time(5000);
    },(err)=>{
    });
  }
  hideNotif()
  {
    this.shown_notif = false;
  }
  hide_after_time(time)
  {
    setTimeout(() => {
    this.shown_notif=false;   
    }, time);
  }
}