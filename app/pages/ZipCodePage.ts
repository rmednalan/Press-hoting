import { Component,OnInit,Inject } from '@angular/core';
import {Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AppStore } from '../app-store';
import { Store } from 'redux';
import { ZipCode } from '../redux/models';
import { EntitiesActions } from '../redux/actions';
import { AppState} from '../redux/reducers';

@Component({
  template: `<router-outlet></router-outlet>`
})

export class ZipCodePage implements OnInit
{
  constructor(
    private _auth:AuthenticationService,
    @Inject(AppStore) private store: Store<AppState>,
    private _router: Router
  ){
    let state = store.getState();
    console.log(state);
    console.log("test load ---------------");
    if(state.entities.currentZipCodes !== null){
      localStorage.setItem("entities",JSON.stringify(state.entities));
    }else
    {
      var entity = JSON.parse(localStorage.getItem("entities"));
      console.log(entity);
      this.store.dispatch(EntitiesActions.setEntity("zipcode",entity.currentZipCodes));
      this.store.dispatch(EntitiesActions.setEntity("city",entity.currentCities));
      this.store.dispatch(EntitiesActions.setEntity("location",entity.currentLocations));
      this.store.dispatch(EntitiesActions.selectEntity("zipcode",entity.selectedZipCode));
    }
  }

  ngOnInit()
  {
    this._auth.checkCredentials();
  }
}
