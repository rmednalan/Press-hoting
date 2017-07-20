import { Component,Inject,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Geolocation } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/geolocation/EditGeolocation.html'
})
export class EditGeolocation implements OnInit{
  complexForm : FormGroup;
  geolocation:Geolocation;
  error_message:string;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
    ){

      this.loadGeolocation();
      this.complexForm = fb.group({
        "latitude":[null,Validators.required],
        "longitude":[null,Validators.required],
        "status":["Active",false]
      });
    }

 loadGeolocation()
 {
   let state = this.store.getState();
   this.geolocation = state.entities.selectedLocation;
 }

 back()
 {
   this.store.dispatch(EntitiesActions.selectEntity("location",this.geolocation));
   this._router.navigate(['geoLocations/info']);
 }

 submitForm(location)
 {
   this._entity.edit("geoLocations",location,this.geolocation.id).subscribe(
     lang => {
       this.store.dispatch(EntitiesActions.editEntity("location",lang.data,this.geolocation.id));
       console.log("**edit** location from api and state");
       this._router.navigate(['geoLocations']);
     },
     error => {
       console.log("location update failed");
       this.error_message = "Edit GeoLocation failed.";
       this._auth.logout();
     }

   );
 }

  ngOnInit(){
    this.loadGeolocation();
  }
}
