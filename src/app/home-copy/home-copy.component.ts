import { Component, OnInit } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-home-copy',
  templateUrl: './home-copy.component.html',
  styleUrls: ['./home-copy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeCopyComponent implements OnInit {
  items: any[] = [];
  currentDate = new Date();
  currentMonth = "";
  stopDate = new Date();
  selectedItem = "";
  socket: Socket;
  liveMatchesData=[];
  allMatchesData=[];
  constructor() { }

  ngOnInit(): void {
    this.openWsConnection();
  }

  openWsConnection() {
    const socket = io('wss://api.sportsbuzz.com',{
        query: { "path": "homescreen", },
        withCredentials: true,
        transports:['websocket'],
      });
      socket.on('connect', () => { console.log('connected') })
      socket.on('message', (response_data) => {
        this.liveMatchesData=[];
this.allMatchesData=[];
        for(const i of response_data){
          if(i['status']==='live'){
             this.liveMatchesData.push(i);
            console.log(i,'a');
          }
          else{

  this.allMatchesData.push(i);
          }
        }
        console.log(response_data)
      })
    }

       // Common method to create an array of dates
       getDates(startDate: any, stopDate: any) {
        let dateArray = [];
        let currentDate = moment(startDate);
        stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
          dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
          currentDate = moment(currentDate).add(1, "days");
        }
        return dateArray;
      }
    
      // Get the selected Date
      select(item: any) {
        this.selectedItem = item;
        console.log(item);
      }
    
      // Method for changing Month
      changeMonth(e: any) {
        this.currentDate = this.items[e];
        this.currentMonth = new Date(this.currentDate).toLocaleString("default",
          {
            month: "short"
          });
      }
    
      // Method to get the current weekday of the date showon
      returnWeekDay(item: any) {
        return new Date(item).toLocaleDateString("default", { weekday: "short" });
      }
}


