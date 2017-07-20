import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Currency } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/currency/AddCurrency.html'
})
export class AddCurrency implements OnInit{
  complexForm : FormGroup;
  languages = [];
  error_message:string;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
  ){

    let state = this.store.getState();
    var data = state.entities.currentLanguages;

    this.languages.push({label: null, value: null});
    data.forEach((item,index)=>{
      this.languages.push({label: item.name, value: item.id});
    });

    this.complexForm = fb.group({
      "name":[null,Validators.required],
      "symbol":[null,Validators.required],
      "isoAlpha3":[null,Validators.required],
      "isoNumeric":[null,Validators.required],
      "languageId":[1,false],
      "status":["Active",false]
    });
  }

  back()
  {
    this._router.navigate(['currencies']);
  }

  submitForm(currency)
  {
    this._entity.add("currencies",currency).subscribe(
      currency=>{
        console.log(currency);
        this.store.dispatch(EntitiesActions.addEntity("currency",currency.data));
        this.complexForm.reset();
        console.log("**added** new currency to api and state");
        this.back();
      },
      error => {
        console.log("add currency failed");
        this.error_message = "Failed to add currency.";
        this._auth.logout();
      }
    );
  }

  ngOnInit(){

  }
}
