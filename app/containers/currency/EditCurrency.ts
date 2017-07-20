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
  templateUrl: 'app/containers/currency/EditCurrency.html'
})
export class EditCurrency implements OnInit{
  currency:Currency;
  languages = [];
  complexForm : FormGroup;
  error_message:string;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
    )
  {
    let state = this.store.getState();
    this.currency = state.entities.selectedCurrency;

    var data = state.entities.currentLanguages;
    data.forEach((item,index)=>{
      this.languages.push({"label": item.name, "value": item.id});
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
    this.store.dispatch(EntitiesActions.selectEntity("currency",this.currency));
    this._router.navigate(['currencies/info']);
  }

  submitForm(currency)
  {
    console.log(currency);
    this._entity.edit("currencies",currency,this.currency.id).subscribe(
      currency=>{
        console.log(currency);
        console.log("update currency success");
        this.store.dispatch(EntitiesActions.editEntity("currency",currency.data,this.currency.id));
        this._router.navigate(['currencies']);
      },
      error => {
        console.log("edit currency failed");
        this.error_message = "Edit currency failed.";
        this._auth.logout();
      }
    );
  }

  ngOnInit(){

  }
}
