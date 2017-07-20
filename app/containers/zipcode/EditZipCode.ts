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
  templateUrl: 'app/containers/zipcode/EditZipCode.html'
})
export class EditZipCode implements OnInit{
  complexForm : FormGroup;
  zipcode:ZipCode;
  latitude:number;
  longitude:number;

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
    this.zipcode = state.entities.selectedZipCode;

    state.entities.currentLocations.forEach((item,index)=>{
      if(item.id = this.zipcode.geoLocationId)
      {
        this.latitude = item.latitude;
        this.longitude = item.longitude;
      }
    })

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

  back(){
    this.store.dispatch(EntitiesActions.selectEntity("zipcode",this.zipcode));
    this._router.navigate(["zip-codes/info"]);
  }

  submitForm(data){
    if(this.isChecked)
    {
      this.updateZipCode(data,data.geoLocationId);
    }else
    {
      var new_location = {
        "latitude":data.latitude,
        "longitude":data.longitude,
        "status":data.status
      };

      this._entity.edit("geoLocations",new_location,this.zipcode.geoLocationId).subscribe(
        loc => {
          console.log("**edit** location to api and state");
          this.store.dispatch(EntitiesActions.editEntity("location",loc.data,loc.data.id));
          this.updateZipCode(data,loc.data.id);
        },
        error =>{
          console.log("add location failed");
          this._auth.logout();
        }
      );
    }
  }


  updateZipCode(data,locationId)
  {
    var new_zipcode = {
      "code":data.code,
      "cityId":data.cityId,
      "geoLocationId":locationId,
      "status":data.status
    };

    this._entity.edit("zipCodes",new_zipcode,this.zipcode.id).subscribe(
      zipcode => {
        console.log("**edit** zipcode to api and state");
        this.store.dispatch(EntitiesActions.editEntity("zipcode",zipcode.data,zipcode.data.id));
        this._router.navigate(["zip-codes"]);
      },
      error =>{
        console.log("edit zipcode failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit(){

  }
}
