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
  templateUrl: 'app/containers/geolocation/GeolocationInfo.html'
})
export class GeolocationInfo implements OnInit{
  geolocation:Geolocation;
  error_message:string;
  country:string = "none";
  state:string = "none";
  city:string = "none";
  zip:string = "none";

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){}

  loadGeolocation()
  {
    let state = this.store.getState();
    this.geolocation = state.entities.selectedLocation;

    state.entities.currentCountries.forEach((item,index)=>{
      if(item.geoLocationId == this.geolocation.id){
        this.country = item.name;
      }
    })

    state.entities.currentStates.forEach((item,index)=>{
      if(item.geoLocationId == this.geolocation.id){
        this.state = item.name;
      }
    })

    state.entities.currentCities.forEach((item,index)=>{
      if(item.geoLocationId == this.geolocation.id){
        this.city = item.name;
      }
    })

    state.entities.currentZipCodes.forEach((item,index)=>{
      if(item.geoLocationId == this.geolocation.id){
        this.zip = item.code;
      }
    })
  }

  back(){
      this._router.navigate(['geoLocations']);
  }

  edit()
  {
    this.store.dispatch(EntitiesActions.selectEntity("location",this.geolocation));
    this._router.navigate(['geoLocations/edit/'+this.geolocation.id]);
  }

  delete(id)
  {
    if(confirm("Are you sure to delete geolocation?"))
    {
      this._entity.delete("geoLocations",id).subscribe(
        locations => {
          this.store.dispatch(EntitiesActions.deleteEntity("location",id))
          console.log("**delete** location from api and from state");
          this.back();
        },
        error => {
          console.log("delete location failed");
          this.error_message = "Delete GeoLocation failed.";
          this._auth.logout();
        }
      );
    }
  }

  ngOnInit(){
    this.loadGeolocation();
  }
}
