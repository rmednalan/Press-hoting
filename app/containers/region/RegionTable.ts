import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Region } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/region/RegionTable.html'
})
export class RegionTable implements OnInit{
  regions:Region[];

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
  ){}

  add(){
    this._router.navigate(["regions/add"]);
  }

  onRowSelect(event)
  {
    this.store.dispatch(EntitiesActions.selectEntity("region",event.data));
    let state = this.store.getState();
    localStorage.setItem("entities",JSON.stringify(state.entities));
    this._router.navigate(["regions/info"]);
  }

  getState(id)
  {
    var state_name = "none";
    let state = this.store.getState();
    state.entities.currentStates.forEach((item,index)=>{
      if(item.id == id){
        state_name = item.name;
      }
    });

    return state_name;
  }

  getCity(id)
  {
    var city = "none";
    let state = this.store.getState();
    state.entities.currentCities.forEach((item,index)=>{
      if(item.id == id){
        city = item.name;
      }
    });

    return city;
  }

  getCountry(id)
  {
    var country = "none";
    let state = this.store.getState();
    state.entities.currentCountries.forEach((item,index)=>{
      if(item.id == id){
        country = item.name;
      }
    });

    return country;
  }

  ngOnInit(){
    let state = this.store.getState();
    this.regions = state.entities.currentRegions;
  }
}
