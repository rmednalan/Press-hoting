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
  templateUrl: 'app/containers/country/CountryTable.html'
})

export class CountryTable implements OnInit{
  countries:Country[];

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
  ){

  }

  onRowSelect(event)
  {
    this._entity.read("countries",event.data.id).subscribe(
      countries => {
        this.store.dispatch(EntitiesActions.selectEntity("country",countries.data));

        let state = this.store.getState();
        localStorage.setItem("entities",JSON.stringify(state.entities));

        this._router.navigate(['countries/info']);
      },
      error => {
        console.log("read country failed");
        this._auth.logout();
      }
    );
  }

  addCountry()
  {
    this._router.navigate(['countries/add']);
  }

  getLanguage(id){
      let state = this.store.getState();
      return this.getName(state.entities.currentLanguages,id);
  }

  getCurrency(id){
      let state = this.store.getState();
      return this.getName(state.entities.currentCurrencies,id);
  }

  getName(state,id){
    var name = "none";
    state.forEach((item,index)=>{
      if(item.id == id)
      {
        name = item.name
      }
    })

    return name;
  }

  ngOnInit(){
    let state = this.store.getState();
    this.countries = state.entities.currentCountries;
  }
}
