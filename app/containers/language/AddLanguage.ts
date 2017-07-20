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
  selector:'language-table',
  templateUrl: 'app/containers/language/AddLanguage.html'
})
export class AddLanguage implements OnInit{
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

  back()
  {
    this._router.navigate(['languages']);
  }

  submitForm(language)
  {
    console.log(language);
    this._entity.add("languages",language).subscribe(
      language=>{
        this.store.dispatch(EntitiesActions.addEntity("language",language.data));
        console.log("**added** new language to api and state");
        this.complexForm.reset();
        this.back();
      },
      error => {
        console.log("failed to add language");
        this._auth.logout();
      }
    );
  }

  ngOnInit(){

  }
}
