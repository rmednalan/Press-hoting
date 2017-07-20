import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { City } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/city/EditCity.html'
})

export class EditCity implements OnInit{
  complexForm : FormGroup;
  city:City;
  latitude:number;
  longitude:number;
  new_city:any;
  new_location:any;

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
    let data = this.store.getState();
    this.city = data.entities.selectedCity;

    data.entities.currentLocations.forEach((item,index)=>{
      if(item.id == this.city.geoLocationId){
        this.latitude = item.latitude;
        this.longitude = item.longitude;
      }
    })

    this.locations.push({"label":"Select Geolocation","value":null});
    data.entities.currentLocations.forEach((item,index)=>{
      this.locations.push({"label":item.latitude+"-"+item.longitude,"value":item.id});
    });

    this.states.push({"label":"Select State","value":null});
    data.entities.currentStates.forEach((item,index)=>{
      this.states.push({"label":item.name,"value":item.id});
    });

    this.languages.push({"label":"Select Language","value":null});
    data.entities.currentLanguages.forEach((item,index)=>{
      this.languages.push({"label":item.name,"value":item.id});
    });

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
    this.checkboxText = data ? "Uncheck to edit geolocation.":"Check to select geolocation.";
  }

  back()
  {
    this.store.dispatch(EntitiesActions.selectEntity("city",this.city));
    this._router.navigate(["cities/info"]);
  }

  submitForm(data){
    if(this.isChecked)
    {
      this.editCity(data,data.geoLocationId);
    }else
    {
      this.new_location = {
        "latitude":data.latitude,
        "longitude":data.longitude,
        "status":data.status
      };

      this._entity.edit("geoLocations",this.new_location,this.city.geoLocationId).subscribe(
        loc => {
          console.log("**edit** location to api and state");
          this.store.dispatch(EntitiesActions.editEntity("location",loc.data,this.city.geoLocationId));
          this.editCity(data,loc.data.id);
        },
        error =>{
          console.log("add location failed");
          this._auth.logout();
        }
      );
    }
  }

  editCity(data,locationId)
  {
    this.new_city = {
      "name":data.name,
      "stateId":data.stateId,
      "languageId":data.languageId,
      "geoLocationId":locationId,
      "status":data.status
    };

    this._entity.edit("cities",this.new_city,this.city.id).subscribe(
      city => {
        console.log("**edited** city to api and state");
        this.store.dispatch(EntitiesActions.editEntity("city",city.data,this.city.id));
        this._router.navigate(["cities"]);
      },
      error =>{
        console.log("editEntity city failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit()
  {

  }
}
