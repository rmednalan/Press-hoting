import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Currency } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/currency/CurrencyTable.html'
})
export class CurrencyTable implements OnInit{
  currencies:Currency[];
  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){}

  addCurrency()
  {
    this._router.navigate(['currencies/add']);
  }

  onRowSelect(event)
  {
    if(event.data.id > 0){
      this._entity.read("currencies",event.data.id).subscribe(curr=>{
          curr.data.name = curr.data.name == null?"none":curr.data.name;
          this.store.dispatch(EntitiesActions.selectEntity("currency",curr.data));
          let state = this.store.getState();
          localStorage.setItem("entities",JSON.stringify(state.entities));
          console.log("set selected currency to state");
          this._router.navigate(['currencies/info']);

      },
      error => {
        console.log("read currency failed");
        this._auth.logout();
      });
    }else
    {
      this.store.dispatch(EntitiesActions.selectEntity("currency",event.data));
    }
  }

  ngOnInit() {
    let state = this.store.getState();
    this.currencies = state.entities.currentCurrencies;
  }
}
