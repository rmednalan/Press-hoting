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
  templateUrl: 'app/containers/currency/CurrencyInfo.html'
})
export class CurrencyInfo implements OnInit{
  currency:Currency;
  language:string;

  private state = this.store.getState();

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){}

  back()
  {
    this._router.navigate(['currencies']);
  }

  edit()
  {
    this.store.dispatch(EntitiesActions.selectEntity("currency",this.currency));
    this._router.navigate(['currencies/edit/'+this.currency.id]);
  }

  delete(curr_id)
  {
    console.log(curr_id);
    if(confirm("Are you sure to delete Currency "+this.currency.name+" ?")){
      this._entity.delete("currencies",curr_id).subscribe(
        lang => {
          console.log(lang);
         this.store.dispatch(EntitiesActions.deleteEntity("currency",curr_id));
        //  //this.updateLanguages();
          this.back();
        },
        error => {
          console.log("expired in currencytInfo.ts");
          this._auth.logout();
        }
      );
    }
  }

  ngOnInit(){
    let state = this.store.getState();
    this.currency = state.entities.selectedCurrency;

    this.state.entities.currentLanguages.forEach((item,index)=>{
      if(item.id == this.currency.languageId){
        this.language=item.name;
      }
    });
  }
}
