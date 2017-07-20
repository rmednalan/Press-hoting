import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Country,Geolocation } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/country/EditCountry.html'
})
export class EditCountry implements OnInit{
  complexForm : FormGroup;
  languages = [];
  currencies = [];
  geoLocations = [];
  country:Country;
  isChecked:boolean = false;
  checkboxText:string = "Check to select another geolocation.";

  new_country:any;
  new_location:any;
  latitude:number;
  longitude:number;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    private fb:FormBuilder,
    ){
      let state = this.store.getState();
      console.log(state);

      this.country = state.entities.selectedCountry;

      state.entities.currentLocations.forEach((item,index)=>{
        if(item.id == this.country.geoLocationId)
        {
          this.latitude = item.latitude;
          this.longitude = item.longitude;
        }
      });

      var lang = state.entities.currentLanguages;
      this.languages.push({"label":"Select Language","value":null});
      lang.forEach((item,index) => {
        this.languages.push({"label":item.name,"value":item.id});
      })

      var curr = state.entities.currentCurrencies;
      this.currencies.push({"label":"Select Currency","value":null});
      curr.forEach((item,index) => {
        this.currencies.push({"label":item.name,"value":item.id});
      })

      var locations = state.entities.currentLocations;
      this.geoLocations.push({"label":"Select GeoLocation","value":null});
      locations.forEach((item,index)=>{
        this.geoLocations.push({"label":item.latitude+"-"+item.longitude,"value":item.id});
      });

      this.complexForm = this.fb.group({
        "name":[null,Validators.required],
        "isoAlpha2":[null,Validators.required],
        "isoAlpha3":[null,Validators.required],
        "isoNumeric":[null,Validators.required],
        "languageId":[1,false],
        //"languageId":[null,Validators.required],
        "currencyId":[null,Validators.required],
        "geoLocationId":["",null],
        "latitude":[null,Validators.required],
        "longitude":[null,Validators.required],
        "status":["Active",false],
        "checkbox":["",null],
      });

      this.complexForm.controls['checkbox'].valueChanges.subscribe(result=>{
        console.log(result);
        if(result){
          this.validateGeolocationId();
        }else{
          this.validateLatitudeAndLongitude();
        }
      });

      this.complexForm.controls['name'].valueChanges.subscribe(result => {
        console.log(this.isChecked);
        if(this.isChecked){
          this.validateGeolocationId();
        }else{
          this.validateLatitudeAndLongitude();
        }
      });
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

  back(){
    this.store.dispatch(EntitiesActions.selectEntity("country",this.country));
    this._router.navigate(['countries/info']);
  }

  displaySelect(data)
  {
    this.isChecked = data;
    this.checkboxText = data ? "Uncheck to edit geolocation." : "Check to select another geolocation.";
  }

  isSelected()
  {
    return this.isChecked;
  }

  submitForm(data){
    if(this.isChecked){//update direct the country
      this.updateCountry(data,data.geoLocationId);
    }else
    {
      this.new_location = {
        "latitude":data.latitude,
        "longitude":data.longitude,
        "status":data.status
      };

      this._entity.edit("geoLocations",this.new_location,this.country.geoLocationId).subscribe(
        location => {
          console.log("**edit** location from api and state");
          this.store.dispatch(EntitiesActions.editEntity("location",location.data,this.country.geoLocationId));
          let state3 = this.store.getState();
          this.updateCountry(data,this.country.geoLocationId);
        },
        error => {
          console.log("edit location failed");//location is already deleted
          this.addLocation(this.new_location,data);
        }
      );
    }
  }

  addLocation(location,data)
  {
    this._entity.add("geoLocations",location).subscribe(
      location => {
        this.store.dispatch(EntitiesActions.addEntity("location",location.data));
        let state3 = this.store.getState();
        this.updateCountry(data,location.data.id);
      },
      error => {}
    );
  }

  updateCountry(data,locationId)
  {
    this.new_country = {
      "name":data.name,
      "isoAlpha2":data.isoAlpha2,
      "isoAlpha3":data.isoAlpha3,
      "isoNumeric":data.isoNumeric,
      "languageId":data.languageId,
      "currencyId":data.currencyId,
      "geoLocationId":locationId,
      "status":data.status
    };

    this._entity.edit("countries",this.new_country,this.country.id).subscribe(
      country => {
        console.log("**edit** country to api and state");
        this.store.dispatch(EntitiesActions.editEntity("country",country.data,this.country.id));
        this._router.navigate(['countries']);
      },
      error =>{
        console.log("edit country failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit()
  {

  }
}
