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
  templateUrl: 'app/containers/state/EditState.html'
})

export class EditState implements OnInit{
  complexForm:FormGroup;
  state:State;
  locations = [];
  countries = [];
  latitude:any;
  longitude:any;

  isChecked:boolean = false;
  checkboxText:string = "Check to select another geolocation.";

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder
    ){
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

      let data = this.store.getState();
      this.state = data.entities.selectedState;

      data.entities.currentLocations.forEach((item,index)=>{
        if(item.id == this.state.geoLocationId)
        {
          this.latitude = item.latitude;
          this.longitude = item.longitude;
        }
      });


      var loc = data.entities.currentLocations;
      this.locations.push({"label":"Select Location","value":null});
      loc.forEach((item,index)=>{
        this.locations.push({"label":item.latitude+"-"+item.longitude,"value":item.id});
      })

      var country = data.entities.currentCountries;
      this.countries.push({"label":"Select Country","value":null});
      country.forEach((item,index)=>{
        this.countries.push({"label":item.name,"value":item.id});
      })

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

  displaySelect(data)
  {
    this.isChecked = data;
    this.checkboxText = data ? "Uncheck to edit geolocation.":"Check to select another geolocation.";
  }

  back(){
    this.store.dispatch(EntitiesActions.selectEntity("state",this.state));
    this._router.navigate(["states/info"]);
  }

  submitForm(data)
  {
    if(this.isChecked)
    {
      console.log(data);
      console.log(this.state);
      console.log("this is checked process");
      this.editState(data,data.geoLocationId);
    }else
    {
      console.log("this is not checked process");
      var location = {
        "longitude":data.longitude,
        "latitude":data.latitude,
        "status":data.status
      };

      this._entity.edit("geoLocations",location,this.state.geoLocationId).subscribe(
        location => {
          console.log("**edit** state location");
          console.log(location);
          this.store.dispatch(EntitiesActions.editEntity("location",location.data,location.data.id));
          this.editState(data,location.data.id);
        },
        error => {
          console.log("edit state location failed");
          this._auth.logout();
        }
      );
    }
  }

  editState(data,locationId){
    var new_state = {
      "name":data.name,
      "languageId":data.languageId,
      "countryId":data.countryId,
      "geoLocationId":locationId,
      "status":data.status
    };

    this._entity.edit("states",new_state,this.state.id).subscribe(
      state => {
        console.log(state);
        console.log(new_state);
        this.store.dispatch(EntitiesActions.editEntity("state",state.data,this.state.id));
        console.log("**edit** state to api and state");
        this.complexForm.reset();
        this._router.navigate(["states"]);
      },
      error => {
        console.log("edit state failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit(){

  }
}
