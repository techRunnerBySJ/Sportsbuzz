import { NgxSpinnerService } from 'ngx-spinner';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { KeyValue } from '@angular/common';
import { WebsocketService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatchFilterPipe } from '../pipes/match-filter.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MatchFilterPipe]
})

export class HomeComponent implements OnInit, OnDestroy {
  currentTab: number = 0
  allDates: any[] = [];
  currentDate = new Date();
  currentMonth = "";
  stopDate = new Date();
  selectedDate = "";
  allMatchesData: any[]
  tabsData = {}
  objectKeys = Object.keys
  originalOrder = (a: KeyValue<string, any[]>, b: KeyValue<string, any[]>): number => {
    return 0;
  }
  subscription: Subscription;
  currentPlayingVideo;
  testing = [1];
  currentVideoPlayingIndex: number;
  noMatchData: boolean;
  isDesktopScreen:boolean;

  constructor(private webSocketService: WebsocketService, private router: Router, private matchFilterPipe: MatchFilterPipe, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(()=>{
     this.spinner.hide()},3000)
    if (typeof window !== 'undefined') {
      console.log('You are on the browser,You are good to go');
      window.innerWidth >=769 ? this.isDesktopScreen = true : this.isDesktopScreen = false;
      } else {
      console.log('You are on the server,Cannot execute')
     }
    this.selectedDate = moment(this.currentDate).format("YYYY-MM-DD");
    this.webSocketService.openHomeScreenWsConnection();
    this.subscription = this.webSocketService.homeScreenSocketListener.subscribe(data => {
      this.allMatchesData = data;
      this.tabsData = {}
      for (var i in this.allMatchesData) {
        if (this.tabsData[this.allMatchesData[i]['tournamentName']] === undefined) {
          this.tabsData[this.allMatchesData[i]['tournamentName']] = [];
        }
        this.tabsData[this.allMatchesData[i]['tournamentName']].push(this.allMatchesData[i])

        if (this.allMatchesData[i]['matchStatus'] === 'Not Started') {
          const currentTime = new Date();
          const matchStartTime = new Date(this.allMatchesData[i]['matchScheduledDate'])
          let secs = Math.floor((matchStartTime.getTime() - currentTime.getTime()) / 1000);
          let minutes = Math.floor(secs / 60);
          secs = secs % 60
          let hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
          this.allMatchesData[i]['matchStartTimer'] = 
            `Match will ${this.allMatchesData[i]['testMatchInningResumeDate'] ? 'resume' :'start'} in ${("0" + hours).slice(-2)} Hr : ${("0" + minutes).slice(-2)} Min`
        }
      }
      console.log(this.tabsData)
    })

    this.allDates = this.getDates(
      this.currentDate.getTime() - 15 * 24 * 60 * 60 * 1000,
      this.currentDate.getTime() + 60 * 24 * 60 * 60 * 1000,
    );
    setTimeout(() => {
    const scrollDate = moment(new Date().getTime()- 2 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
      console.log(scrollDate);
      console.log(document.getElementById(scrollDate.toString()), this.selectedDate);
      const a = document.getElementById(scrollDate.toString())?.offsetLeft;
      document.getElementById('scroll_div').scrollTo(a, 0);
    }, 1000);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (typeof window !== 'undefined') {
      console.log('You are on the browser,You are good to go');
      window.innerWidth >=769 ? this.isDesktopScreen = true : this.isDesktopScreen = false;
      } else {
      console.log('You are on the server,Cannot execute')
     }
  }

  /**
   * Method that change mat-tab
   * @param index 
   */
  changeTab(index) {
    this.currentTab = index;
    this.checkIfMatchesExist();
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

  /**
   * Method that navigates to match-details page
   * @param matchId 
   */
  goToViewDetailsPage(matchId: string) {
    this.router.navigate(['view-details'], { queryParams: { matchId: matchId } })
  }

  // Get the selected Date
  onDateSelectionChange(date: any) {
    this.selectedDate = date;
    this.checkIfMatchesExist();
  }

  // Method for changing Month
  changeMonth(e: any) {
    const date = this.allDates[e];
    this.currentMonth = new Date(date).toLocaleString("default",
      {
        month: "long"
      });
  }

  // Method to get the current weekday of the date showon
  returnWeekDay(item: any) {
    return new Date(item).toLocaleDateString("default", { weekday: "short" });
  }

  showGoToCurrentDateButton() {
    return moment(new Date()).format('YYYY-MM-DD') !== this.selectedDate;
  }

  goToCurrentDate() {
    this.selectedDate = moment(new Date()).format('YYYY-MM-DD');
    
  }
  /**
   * Method that play video on clicking of 'play' image
   * @param index 
   */
  playVideo(index){
    console.log(document.getElementById(index))
    const video =document.getElementById(index);
    if (this.currentPlayingVideo !== undefined) {
      this.currentPlayingVideo.pause();
    }
      this.currentPlayingVideo = video;
      this.currentPlayingVideo.play();
      this.currentVideoPlayingIndex = index;
  }

  /**
   * Method that play one video at a time
   * and pause other video before playing new one
   * @param event 
   * @param index 
   */
  onPlayingVideo(event, index) {
    event.preventDefault();
    // play the video that is chosen by the user
    if (this.currentPlayingVideo === undefined) {
      this.currentPlayingVideo = event.target;
      this.currentPlayingVideo.play();
    } else {
      // if the user plays a new video, pause the last one and play the new one
      if (event.target !== this.currentPlayingVideo) {
        this.currentPlayingVideo.pause();
        this.currentPlayingVideo = event.target;
        this.currentPlayingVideo.play();
      }  
    }
   setTimeout(()=> { this.currentVideoPlayingIndex = index},100)
  }

  /**
   * Method that invokes on pausing the video
   */
  onPausingVideo() {
    this.currentVideoPlayingIndex = null;
  }

  checkIfMatchesExist() {
    if (this.currentTab === 0) {
      const filteredData = this.matchFilterPipe.transform(this.allMatchesData, this.selectedDate);
      filteredData.length ? this.noMatchData = false : this.noMatchData = true;
    } else {
      const filteredData = this.matchFilterPipe.transform(this.tabsData[Object.keys(this.tabsData)[this.currentTab - 1]], this.selectedDate);
      filteredData.length ? this.noMatchData = false : this.noMatchData = true;
    }
  }
  /**
   * Method that navigates to news component
   * @param sportName 
   */
   navigateToSportsNews(sportName: string) {
    this.router.navigate(['sports-news'], {state: {sportName}})
  }

  navigateToHomePage(){
    this.router.navigate(['home']);
  }

  ngOnDestroy(): void {
    this.webSocketService.closeHomeScreenWsConnection();
    this.subscription.unsubscribe();
  }
  
}




