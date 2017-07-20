import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { City,Geolocation } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/city/AddCity.html'
})

export class AddCity implements OnInit{
  complexForm : FormGroup;
  city:any;
  location:any;

  locations = [];
  states = [];
  languages = [];

  isChecked:boolean = false;
  checkboxText:string = "Check to select geolocation.";

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
  ){
    let info = this.store.getState();

    this.languages.push({"label":"Select Language","value":null});
    var lang = info.entities.currentLanguages;
    if(lang.length > 0)
    {
      lang.forEach((item,index)=>{
        this.languages.push({"label":item.name,"value":item.id});
      });
    }

    this.states.push({"label":"Select State","value":null});
    var state = info.entities.currentStates;
    if(state.length > 0)
    {
      state.forEach((item,index)=>{
        this.states.push({"label":item.name,"value":item.id});
      });
    }

    this.locations.push({"label":"Select Geolocation","value":null});
    var loc = info.entities.currentLocations;
    if(loc.length > 0)
    {
      loc.forEach((item,index)=>{
        this.locations.push({"label":item.latitude+"-"+item.longitude,"value":item.id});
      });
    }

    this.complexForm = fb.group({
      "name":[null,Validators.required],
      "languageId":[1,false],
      "stateId":[null,Validators.required],
      "geoLocationId":["",null],
      "latitude":[null,Validators.required],
      "longitude":[null,Validators.required],
      "status":["Active",false],
      "checkbox":["",null],
    });

    this.complexForm.controls['checkbox'].valueChanges.subscribe(result=>{
      console.log(result);
      if(result){this.validateGeolocationId();}else{this.validateLatitudeAndLongitude();}
    });

    //default
    this.complexForm.controls['name'].valueChanges.subscribe(result => {
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

  displaySelect(data)
  {
    this.isChecked = data;
    this.checkboxText = data ? "Uncheck to add geolocation.":"Check to select geolocation.";
  }

  back(){
    this._router.navigate(["cities"]);
  }

  submitForm(data){
    if(this.isChecked)
    {
      this.addCity(data,data.geoLocationId);
    }else
    {
      this.location = {
        "latitude":data.latitude,
        "longitude":data.longitude,
        "status":data.status
      };

      this._entity.add("geoLocations",this.location).subscribe(
        loc => {
          console.log("**add** location to api and state");
          this.store.dispatch(EntitiesActions.addEntity("location",loc.data));
          this.addCity(data,loc.data.id);
        },
        error =>{
          console.log("add location failed");
          this._auth.logout();
        }
      );
    }
  }

  addCity(data,locationId)
  {
    this.city = {
      "name":data.name,
      "stateId":data.stateId,
      "languageId":data.languageId,
      "geoLocationId":locationId,
      "status":data.status
    };

    this._entity.add("cities",this.city).subscribe(
      city => {
        console.log("**add** city to api and state");
        this.store.dispatch(EntitiesActions.addEntity("city",city.data));
        this.back();
      },
      error =>{
        console.log("add city failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit()
  {

  }
}
