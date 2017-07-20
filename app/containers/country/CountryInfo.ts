import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Country } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/country/CountryInfo.html'
})
export class CountryInfo implements OnInit{
  country:Country;
  language:string;
  latitude:number;
  longitude:number;
  currency:string;


  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){

    }

  back(){
    this._router.navigate(['countries']);
  }

  edit(){
    this.store.dispatch(EntitiesActions.selectEntity("country",this.country));    
    this._router.navigate(['countries/edit/'+this.country.id]);
  }

  delete(){
    if(confirm("Are you sure to delete Country "+this.country.name+" ?")){
      this._entity.delete("countries",this.country.id).subscribe(
        del => {
          console.log("**delete** country from api and state");
          this.store.dispatch(EntitiesActions.deleteEntity("country",this.country.id));
          this._router.navigate(['countries']);
        },
        error => {
          console.log("delete country failed");
          this._auth.logout();
        }
      );
    }
  }

  ngOnInit()
  {
    let state = this.store.getState();
    console.log(state);
    this.country = state.entities.selectedCountry;

    var lang_id = this.country.languageId;
    state.entities.currentLanguages.forEach((item,index)=>{
      if(item.id == lang_id)
      {
        this.language = item.name;
      }
    });

    var loc_id = this.country.geoLocationId;
    state.entities.currentLocations.forEach((item,index)=>{
      if(item.id == loc_id)
      {
        this.latitude = item.latitude;
        this.longitude = item.longitude;
      }
    });

    var curr_id = this.country.currencyId;
    state.entities.currentCurrencies.forEach((item,index)=>{
      if(item.id == curr_id)
      {
        this.currency = item.name;
      }
    });
  }
}
