import { Component,OnInit,Inject } from '@angular/core';
import {Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AppStore } from '../app-store';
import { Store } from 'redux';
import { Language } from '../redux/models';
import { EntitiesActions } from '../redux/actions';
import { AppState} from '../redux/reducers';

@Component({
  template: `<router-outlet></router-outlet>`
})

export class LanguagePage implements OnInit
{
  constructor(
    private _auth:AuthenticationService,
    @Inject(AppStore) private store: Store<AppState>,
    private _router: Router
  ){
    let state = store.getState();
    console.log(state);
    console.log("test load ---------------");
    if(state.entities.currentLanguages !== null){
      localStorage.setItem("entities",JSON.stringify(state.entities));
    }else
    {
      var entity = JSON.parse(localStorage.getItem("entities"));
      console.log(entity);
      this.store.dispatch(EntitiesActions.setEntity("language",entity.currentLanguages));
      this.store.dispatch(EntitiesActions.selectEntity("language",entity.selectedLanguage));
    }
  }

  ngOnInit()
  {
    this._auth.checkCredentials();
  }
}
