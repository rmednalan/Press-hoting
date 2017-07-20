import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Geolocation } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/geolocation/GeolocationTable.html'
})
export class GeolocationTable implements OnInit{
  geolocations:Geolocation[];

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){}

  addGeolocation()
  {
    this._router.navigate(['geoLocations/add']);
  }

  onRowSelect(event)
  {
    var country = this.getCountry(event.data.id)
    this.store.dispatch(EntitiesActions.selectEntity("location",event.data,country));
    let state = this.store.getState();
    localStorage.setItem("entities",JSON.stringify(state.entities))
    console.log("add selected location to state");
    this._router.navigate(['geoLocations/info']);
  }


  getCountry(locationId)
  {
    let state = this.store.getState();
    var country = "none";
    state.entities.currentCountries.forEach((item,index)=>{
      if(item.geoLocationId === locationId){
        country = item.name;
      }
    });
    return country;
  }

  getState(id)
  {
    let state = this.store.getState();
    var state_name = "none";
    state.entities.currentStates.forEach((item,index)=>{
      if(item.geoLocationId === id){
        state_name = item.name;
      }
    });
    return state_name;
  }

  getCity(id)
  {
    let state = this.store.getState();
    var city = "none";
    state.entities.currentCities.forEach((item,index)=>{
      if(item.geoLocationId === id){
        city = item.name;
      }
    });
    return city;
  }

  getZip(id)
  {
    let state = this.store.getState();
    var zip = "none";
    state.entities.currentZipCodes.forEach((item,index)=>{
      if(item.geoLocationId === id){
        zip = item.code;
      }
    });
    return zip;
  }

  ngOnInit(){
    let state = this.store.getState();
    this.geolocations = state.entities.currentLocations;
  }
}
