import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Geolocation } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/geolocation/AddGeolocation.html'
})
export class AddGeolocation implements OnInit{
  complexForm : FormGroup;
  error_message:string;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
    ){
      this.complexForm = fb.group({
        "latitude":[null,Validators.required],
        "longitude":[null,Validators.required],
        "status":["Active",false]
      });
    }

  back()
  {
    this._router.navigate(['geoLocations']);
  }

  submitForm(geolocation)
  {
    console.log(geolocation);
    this._entity.add("geoLocations",geolocation).subscribe(
      location => {
        this.store.dispatch(EntitiesActions.addEntity("location",location.data));
        this.complexForm.reset();
        console.log("**add** new location to api and state");
        this.back();
      },
      error => {
        console.log("add location failed");
        this.error_message = "Add GeoLocation failed.";
        this._auth.logout();
      }
    );
  }

  ngOnInit(){

  }
}
