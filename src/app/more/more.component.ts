import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent implements OnInit {

  isGridView:boolean=true;
  isListView:boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  showGridView(){
    this.isGridView=true;
    this.isListView=false;
  }
  showListView(){
    this.isListView=true;
    this.isGridView=false;
  }

  /**
   * Method that navigates to news component
   * @param sportName 
   */
  navigateToSportsNews(sportName: string) {
    this.router.navigate(['sports-news'], {state: {sportName}})
  }
}
