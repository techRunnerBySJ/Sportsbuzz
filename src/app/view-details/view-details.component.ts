import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';
import { InningDetails, MatchDetails } from './model/view-details';
@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewDetailsComponent implements OnInit, OnDestroy {

  currentTab: number = 0;
  tabList = ['Info', 'Commentary', 'Live', 'Scoreboard', 'H2H'];
  filterBy: string;
  openedKeyEvents: boolean;
  currentMatchId: string;
  matchDetails: MatchDetails = new MatchDetails();
  inningWiseDetails: {
    [key: number]: InningDetails
  } = {};
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0;
  }
  scoreboardCurrentInning: number = 1;
  commentaryCurrentInning: number = 0;
  latestInning: number = 0;
  subcription: Subscription;
  matchNotStarted: boolean;
  constructor(private router: Router, private webSocketService: WebsocketService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => this.currentMatchId = params['matchId']); //sr:match:34198397
    console.log(this.currentMatchId)
  }

  ngOnInit(): void {
    this.webSocketService.openMatchDetailsWsConnection(this.currentMatchId);
    this.subcription = this.webSocketService.matchDetailsSocketListener.subscribe(data => {
      // this.inningsData = data['inningsData'];
      this.matchDetails = MatchDetails.fromJson(data);
      console.log(this.matchDetails)
      if (data['inningsData'].length === 0 ) {
        this.matchNotStarted = true;
      } else {
        this.matchNotStarted = false;
      }
      for (var i in data['inningsData']) {
        this.inningWiseDetails[data['inningsData'][i]['number']] = InningDetails.fromJson(data['inningsData'][i]);
        if (this.commentaryCurrentInning === 0) {
          this.commentaryCurrentInning = data['inningsData'][i]['number'];
        }
        if (this.latestInning < data['inningsData'][i]['number']) {
          this.latestInning = data['inningsData'][i]['number'];
        }
        if (data.tournamentType === 'test' || data.tournamentType === 'first_class') {
          let inning: string;
          data['inningsData'][i]['number'] === 1 || data['inningsData'][i]['number'] === 2 ? inning = '1st Inn' : inning = '2nd Inn';
          this.inningWiseDetails[data['inningsData'][i]['number']]['headingDisplay'] = `${data['inningsData'][i]['battingTeamCode']} ${inning}`;
        }
      }
      console.log(this.inningWiseDetails)
    })
  }

  changeCurrentScoreboardInning(inningNumber) {
    this.scoreboardCurrentInning = inningNumber;
  }

  changeCurrentCommentaryInning(inningNumber) {
    this.commentaryCurrentInning = inningNumber;
  }

  filterByKeyEvents(flag: string) {
    this.filterBy = flag;
  }

  openKeyEvents() {
    this.openedKeyEvents = true;
  }

  closeKeyEvents() {
    this.openedKeyEvents = false;
    this.filterBy = null;
  }

  changeTab(index: number) {
    this.currentTab = index;
  }

  /**
   * Method that navigates to player page
   */
  navigateToPlayers(teamType: string) {
    this.router.navigate(['players'], {
      queryParams: {
        tournamentId: this.matchDetails.tournamentId,
        matchId: this.matchDetails.matchId,
        homeTeamId: this.matchDetails.homeTeamId,
        awayTeamId: this.matchDetails.awayTeamId,
        squadFor: teamType,
        homeTeamName: this.matchDetails.homeTeamName,
        awayTeamName: this.matchDetails.awayTeamName
      }
    });
  }
  navigateToHomePage(){
    this.router.navigate(['home']);
  }
  ngOnDestroy(): void {
    this.webSocketService.closeMatchDetailsWsConnection();
    this.subcription.unsubscribe();
  }
}
