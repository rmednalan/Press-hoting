import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Language } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/language/EditLanguage.html'
})
export class EditLanguage implements OnInit{
  language:Language;
  private state = this.store.getState();
  complexForm : FormGroup;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
    ){
      this.complexForm = fb.group({
        "name":[null,Validators.required],
        "status":["Active",false]
      });
    }

  displayLanguageInfo()
  {
    this.language = this.state.entities.selectedLanguage;
  }

  back()
  {
    this._router.navigate(['languages/info']);
  }

  submitForm(language)
  {
    console.log(language);
    this._entity.edit("languages",language,this.language.id).subscribe(
      language=>{
        this.store.dispatch(EntitiesActions.editEntity("language",language.data,this.language.id));
        console.log("**edit** language");
        this._router.navigate(['languages']);
      },
      error => {
        console.log("update language failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit(){
    this.displayLanguageInfo();
  }
}
