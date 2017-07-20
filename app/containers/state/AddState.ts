import {Component,OnInit,Inject} from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {EntityService} from '../../services/entity.service';
import {AppStore} from '../../app-store';
import {Store} from 'redux';
import {State} from '../../redux/models';
import {EntitiesActions} from '../../redux/actions';
import {AppState} from '../../redux/reducers';

@Component({
  templateUrl: 'app/containers/state/AddState.html'
})

export class AddState implements OnInit{
  complexForm:FormGroup;
  countries = [];
  geoLocations = [];

  isChecked:boolean = false;
  checkboxText:string = "Check to select geolocation.";

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder
    )
  {
    let data = this.store.getState();

    if(data.entities.currentCountries == null)
    {
      this._router.navigate(["states"]);
    }else
    {
      this.countries.push({"label":"Select Country","value":null});
      var country_data = data.entities.currentCountries;
      country_data.forEach((item,index)=>{
        this.countries.push({"label":item.name,"value":item.id});
      })
    }

    var loc = data.entities.currentLocations;
    this.geoLocations.push({"label":"Select GeoLocation","value":null});
    loc.forEach((item,index)=>{
      this.geoLocations.push({"label":item.latitude+"-"+item.longitude,"value":item.id});
    });

    this.complexForm = fb.group({
      "name":[null,Validators.required],
      "languageId":[1,false],
      "countryId":[null,Validators.required],
      "latitude":[null,Validators.required],
      "longitude":[null,Validators.required],
      "geoLocationId":["",null],
      "status":["Active",false],
      "checkbox":["",null],
    });

    this.complexForm.controls['checkbox'].valueChanges.subscribe(result=>{
      console.log(result);
      if(result)
      {
        this.complexForm.controls['geoLocationId'].setValidators(Validators.required);
        this.complexForm.controls['geoLocationId'].updateValueAndValidity();

        this.complexForm.controls['latitude'].setValidators(null);
        this.complexForm.controls['latitude'].updateValueAndValidity();

        this.complexForm.controls['longitude'].setValidators(null);
        this.complexForm.controls['longitude'].updateValueAndValidity();
      }else
      {
        this.complexForm.controls['geoLocationId'].setValidators(null);
        this.complexForm.controls['geoLocationId'].updateValueAndValidity();

        this.complexForm.controls['latitude'].setValidators(Validators.required);
        this.complexForm.controls['latitude'].updateValueAndValidity();

        this.complexForm.controls['longitude'].setValidators(Validators.required);
        this.complexForm.controls['longitude'].updateValueAndValidity();
      }
    });

    //default
    this.complexForm.controls['name'].valueChanges.subscribe(result => {
      console.log(this.isChecked);
      if(this.isChecked)
      {
        this.complexForm.controls['geoLocationId'].setValidators(Validators.required);
        this.complexForm.controls['geoLocationId'].updateValueAndValidity();

        this.complexForm.controls['latitude'].setValidators(null);
        this.complexForm.controls['latitude'].updateValueAndValidity();

        this.complexForm.controls['longitude'].setValidators(null);
        this.complexForm.controls['longitude'].updateValueAndValidity();
      }else
      {
        this.complexForm.controls['geoLocationId'].setValidators(null);
        this.complexForm.controls['geoLocationId'].updateValueAndValidity();

        this.complexForm.controls['latitude'].setValidators(Validators.required);
        this.complexForm.controls['latitude'].updateValueAndValidity();

        this.complexForm.controls['longitude'].setValidators(Validators.required);
        this.complexForm.controls['longitude'].updateValueAndValidity();
      }
    })
  }

  back(){
    this._router.navigate(["states"]);
  }

  submitForm(data)
  {
    if(this.isChecked)
    {
      this.addState(data,data.geoLocationId);
    }else
    {
      var location = {
        "longitude":data.longitude,
        "latitude":data.latitude,
        "status":data.status
      };

      this._entity.add("geoLocations",location).subscribe(
        location => {
          console.log(location);
          this.store.dispatch(EntitiesActions.addEntity("location",location.data));
          this.addState(data,location.data.id);
        },
        error => {
          console.log("add state location failed");
          this._auth.logout();
        }
      );
    }
  }

  addState(data,locationId){
    var state = {
      "name":data.name,
      "languageId":data.languageId,
      "countryId":data.countryId,
      "geoLocationId":locationId,
      "status":data.status
    };

    console.log(state);
    this._entity.add("states",state).subscribe(
      state => {
        console.log(state);
        this.store.dispatch(EntitiesActions.addEntity("state",state.data));
        console.log("**add** state to api and state");
        this.complexForm.reset();
        this.back();
      },
      error => {
        console.log("add state failed");
        this._auth.logout();
      }
    );
  }

  displaySelect(data)
  {
    this.isChecked = data;
    this.checkboxText = data ? "Uncheck to add geolocation.":"Check to select geolocation.";
  }

  ngOnInit(){

  }
}
