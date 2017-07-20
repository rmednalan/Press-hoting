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
  templateUrl: 'app/containers/region/EditRegion.html'
})
export class EditRegion implements OnInit{
  complexForm : FormGroup;
  region:Region;
  cities = [];
  countries =[];
  states = [];
  languages = [];


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

  submitForm(data)
  {
    console.log(data);
    this._entity.edit("regions",data,this.region.id).subscribe(
      region =>{
        this.store.dispatch(EntitiesActions.editEntity("region",region.data,region.data.id));
        console.log("edit region from api to state");
        this._router.navigate(["regions"]);
      },
      error => {
        console.log("edit region failed");
        this._auth.logout();
      }
    );
  }

  back(){
    this.store.dispatch(EntitiesActions.selectEntity("region",this.region));
    this._router.navigate(["regions/info"]);
  }

  ngOnInit(){
    let state = this.store.getState();
    this.region = state.entities.selectedRegion;

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
