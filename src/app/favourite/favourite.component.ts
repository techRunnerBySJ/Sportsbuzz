import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {
  isBrowsePlayerPage:boolean;
  isBrowseTeamsPage:boolean;
  isBrowseSeriesPage:boolean;
  isFavouritePage:boolean=true;
  currentTab: number = 0;
  currentInnerTab:number=0;
  innerTabList=['Batting','Bowling','All-rounder','Teams'];
  tabList = ['ICC Rankings - Men', 'ICC Rankings - Women'];
  constructor() { }

  ngOnInit(): void {
  }
  showBrowsePlayerPage(){
    this.isBrowsePlayerPage=true;
    this.isBrowseTeamsPage=false;
    this.isBrowseSeriesPage=false;
    this.isFavouritePage=false;
  }
  showBrowseTeamsPage(){
    this.isBrowseTeamsPage=true;
    this.isBrowsePlayerPage=false;
    this.isBrowseSeriesPage=false;
    this.isFavouritePage=false;
  }
  showBrowseSeriesPage(){
    this.isBrowseSeriesPage=true;
    this.isBrowseTeamsPage=false;
    this.isBrowsePlayerPage=false;
    this.isFavouritePage=false;
  }
  showFavouritePage(){
    this.isBrowseSeriesPage=false;
    this.isBrowseTeamsPage=false;
    this.isBrowsePlayerPage=false;
    this.isFavouritePage=true;
  }
  changeTab(index: number) {
    this.currentTab = index;
  }
  changeInnerTab(index: number) {
    this.currentTab = index;
  }


}
