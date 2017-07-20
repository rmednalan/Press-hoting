import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { ZipCode } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector:'language-table',
  templateUrl: 'app/containers/zipcode/AddZipCode.html'
})
export class AddZipCode implements OnInit{
  complexForm : FormGroup;
  cities = [];
  locations = [];

  isChecked:boolean = false;
  checkboxText:string = "Check to select geolocation.";

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
  ){

    let state = this.store.getState();
    console.log(state);
    this.cities.push({"label":"Select City","value":null});
    state.entities.currentCities.forEach((item,index)=>{
      this.cities.push({"label":item.name,"value":item.id});
    });

    this.locations.push({"label":"Select Geolocation","value":null});
    state.entities.currentLocations.forEach((item,index)=>{
      this.locations.push({"label":item.latitude +" - "+item.longitude,"value":item.id});
    });

    this.complexForm = fb.group({
      "code":[null,Validators.required],
      "cityId":[null,Validators.required],
      "geoLocationId":["",null],
      "latitude":[null,Validators.required],
      "longitude":[null,Validators.required],
      "status":["Active",false],
      "checkbox":["",null]
    });

    this.complexForm.controls['checkbox'].valueChanges.subscribe(result=>{
      console.log(result);
      if(result){this.validateGeolocationId();}else{this.validateLatitudeAndLongitude();}
    });

    //default
    this.complexForm.controls['code'].valueChanges.subscribe(result => {
      console.log(this.isChecked);
      if(this.isChecked){this.validateGeolocationId();}else{this.validateLatitudeAndLongitude();}
    })
  }

  validateGeolocationId()
  {
    this.complexForm.controls['geoLocationId'].setValidators(Validators.required);
    this.complexForm.controls['geoLocationId'].updateValueAndValidity();

    this.complexForm.controls['latitude'].setValidators(null);
    this.complexForm.controls['latitude'].updateValueAndValidity();

    this.complexForm.controls['longitude'].setValidators(null);
    this.complexForm.controls['longitude'].updateValueAndValidity();
  }

  validateLatitudeAndLongitude()
  {
    this.complexForm.controls['geoLocationId'].setValidators(null);
    this.complexForm.controls['geoLocationId'].updateValueAndValidity();

    this.complexForm.controls['latitude'].setValidators(Validators.required);
    this.complexForm.controls['latitude'].updateValueAndValidity();

    this.complexForm.controls['longitude'].setValidators(Validators.required);
    this.complexForm.controls['longitude'].updateValueAndValidity();
  }

  submitForm(data){
    if(this.isChecked)
    {
      this.addZipCode(data,data.geoLocationId);
    }else
    {
      var new_location = {
        "latitude":data.latitude,
        "longitude":data.longitude,
        "status":data.status
      };

      this._entity.add("geoLocations",new_location).subscribe(
        loc => {
          console.log("**add** location to api and state");
          this.store.dispatch(EntitiesActions.addEntity("location",loc.data));
          this.addZipCode(data,loc.data.id);
        },
        error =>{
          console.log("add location failed");
          this._auth.logout();
        }
      );
    }
  }

  addZipCode(data,locationId)
  {
    var zipcode = {
      "code":data.code,
      "cityId":data.cityId,
      "geoLocationId":locationId,
      "status":data.status
    };

    this._entity.add("zipCodes",zipcode).subscribe(
      zipcode => {
        console.log("**add** zipcode to api and state");
        this.store.dispatch(EntitiesActions.addEntity("zipcode",zipcode.data));
        this.back();
      },
      error =>{
        console.log("add zipcode failed");
        this._auth.logout();
      }
    );
  }

  displaySelect(data)
  {
    this.isChecked = data;
    this.checkboxText = data ? "Uncheck to add geolocation.":"Check to select geolocation.";
  }

  back(){
    this._router.navigate(["zip-codes"]);
  }

  ngOnInit(){

  }
}
