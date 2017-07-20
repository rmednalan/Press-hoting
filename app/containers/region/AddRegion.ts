import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Region } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector:'language-table',
  templateUrl: 'app/containers/region/AddRegion.html'
})
export class AddRegion implements OnInit{
  complexForm : FormGroup;
  languages = [];
  countries = [];
  cities = [];
  states = [];

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router,
    fb:FormBuilder,
  ){
    this.complexForm = fb.group({
      "name":[null,Validators.required],
      "countryId":[null,Validators.required],
      "cityId":[null,Validators.required],
      "stateId":[null,Validators.required],
      "languageId":[1,false],
      "status":["Active",false]
    });
  }

  back(){
    this._router.navigate(["regions"]);
  }

  submitForm(data)
  {
    console.log(data);
    this._entity.add("regions",data).subscribe(
      region =>{
        this.store.dispatch(EntitiesActions.addEntity("region",region.data));
        console.log("add region from api to state");
        this.back();
      },
      error => {
        console.log("add region failed");
        this._auth.logout();
      }
    );
  }

  ngOnInit(){
    let state = this.store.getState();

    this.languages.push({"label":"Select Language","value":null});
    state.entities.currentLanguages.forEach((item,index)=>{
      this.languages.push({"label":item.name,"value":item.id});
    })

    this.countries.push({"label":"Select Country","value":null});
    state.entities.currentCountries.forEach((item,index)=>{
      this.countries.push({"label":item.name,"value":item.id});
    })

    this.cities.push({"label":"Select City","value":null});
    state.entities.currentCities.forEach((item,index)=>{
      this.cities.push({"label":item.name,"value":item.id});
    })

    this.states.push({"label":"Select State","value":null});
    state.entities.currentStates.forEach((item,index)=>{
      this.states.push({"label":item.name,"value":item.id});
    })
  }
}
