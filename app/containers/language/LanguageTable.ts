import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Language } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/language/LanguageTable.html'
})
export class LanguageTable implements OnInit{
  languages:Language[];

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){}

  onRowSelect(event)
  {
    this.store.dispatch(EntitiesActions.selectEntity("language",event.data));
    let state =  this.store.getState();
    localStorage.setItem("entities",JSON.stringify(state.entities));
    console.log("set selected state");
    this._router.navigate(['languages/info']);
  }

  addLanguage(){
    this._router.navigate(['languages/add']);
  }

  ngOnInit(){
    let state = this.store.getState();
    this.languages = state.entities.currentLanguages;
  }
}
