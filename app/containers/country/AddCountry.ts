import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Country } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/country/AddCountry.html'
})
export class AddCountry implements OnInit{
  complexForm : FormGroup;
  languages = [];
  currencies = [];
  location:any;
  country:any;
  geoLocations = [];

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

      /*var lang = state.languages.currentLanguages;
      this.languages.push({"label":null,"value":null});
      lang.forEach((item,index) => {
        this.languages.push({"label":item.name,"value":item.id});
      })*/

      var curr = state.entities.currentCurrencies;
      this.currencies.push({"label":"Select Currency","value":null});
      curr.forEach((item,index) => {
        this.currencies.push({"label":item.name,"value":item.id});
      })

      var loc = state.entities.currentLocations;
      this.geoLocations.push({"label":"Select GeoLocation","value":null});
      loc.forEach((item,index)=>{
        this.geoLocations.push({"label":item.latitude+"-"+item.longitude,"value":item.id});
      });

      this.complexForm = fb.group({
        "name":[null,Validators.required],
        "isoAlpha2":[null,Validators.required],
        "isoAlpha3":[null,Validators.required],
        "isoNumeric":[null,Validators.required],
        "languageId":[1,false],
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

      //default
      this.complexForm.controls['name'].valueChanges.subscribe(result => {
        console.log(this.isChecked);
        if(this.isChecked){
          this.validateGeolocationId();
        }else{
          this.validateLatitudeAndLongitude();
        }
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

  back(){
    this._router.navigate(['countries']);
  }

  displaySelect(data)
  {
    this.isChecked = data;
    this.checkboxText = data ? "Uncheck to add geolocation.":"Check to select geolocation.";
  }

  submitForm(data){
    if(this.isChecked)
    {
      this.addCountry(data,data.geoLocationId);
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
          this.addCountry(data,loc.data.id);
        },
        error =>{
          console.log("add location failed");
          this._auth.logout();
        }
      );
    }
  }

  addCountry(data,locationId)
  {
    this.country = {
      "name":data.name,
      "isoAlpha2":data.isoAlpha2,
      "isoAlpha3":data.isoAlpha3,
      "isoNumeric":data.isoNumeric,
      "languageId":data.languageId,
      "currencyId":data.currencyId,
      "geoLocationId":locationId,
      "status":data.status
    };

    this._entity.add("countries",this.country).subscribe(
      country => {
        console.log("**add** country to api and state");
        this.store.dispatch(EntitiesActions.addEntity("country",country.data));
        this.back();
      },
      error =>{
        console.log("add country failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit()
  {

  }
}
