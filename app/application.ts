import {Component,AfterViewInit,ElementRef,Inject,OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {AuthenticationService} from './services/authentication.service';
import {EntityService} from './services/entity.service';
import {createStore,Store, compose, StoreEnhancer} from 'redux';
import { AppStore } from './app-store';
import {AppState,default as reducer} from './redux/reducers';
import LoadEntityData from './LoadEntityData';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

declare var Press: any;

@Component({
    selector: 'my-app',
    templateUrl: 'app/application.html'
})
export class Application implements AfterViewInit {
  layoutCompact: boolean = true;
  layoutMode: string = 'static';
  darkMenu: boolean = false;
  profileMode: string = 'inline';
  currentUrl:any;

  constructor(
    private el: ElementRef,
    private _auth:AuthenticationService,
    @Inject(AppStore) private store: Store<AppState>,
    private _location:Location,
    private _entity:EntityService
  ) {
    if(localStorage.getItem("token") !== null){
      LoadEntityData(store,_entity,_auth);
    }
    this.currentUrl = _location.path();
    this.currentUrl = this.currentUrl.split("/");
  }

  isSubmenuActive()
  {
    if(
      this.currentUrl[1] == "countries" ||
      this.currentUrl[1] == "languages" ||
      this.currentUrl[1] == "currencies" ||
      this.currentUrl[1] == "geoLocations" ||
      this.currentUrl[1] == "states" ||
      this.currentUrl[1] == "cities" ||
      this.currentUrl[1] == "regions" ||
      this.currentUrl[1] == "zip-codes"
    ){
      return "block";
    }else{
      return "none";
    }
  }

  logout() {
    this._auth.logout();
  }

  isUserLoggedIn()
  {
    return this._auth.isLoggedIn();
  }

  ngAfterViewInit() {
    Press.init(this.el.nativeElement);
  }
}
