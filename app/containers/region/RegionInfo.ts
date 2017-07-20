import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Region } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/region/RegionInfo.html'
})
export class RegionInfo implements OnInit{
  region:Region;
  city:string;
  state:string;
  country:string;
  language:string;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
  ){}

  getName(state,id){
    var entity = "none";
    state.forEach((item,index)=>{
      if(item.id == id)
      {
        entity = item.name;
      }
    })

    return entity;
  }

  delete(id)
  {
    if(confirm("Are you sure to delete region "+this.region.name+" ?"))
    {
      this._entity.delete("region",id).subscribe(
        region => {
          this.store.dispatch(EntitiesActions.deleteEntity("region",id));
          console.log("delete region failed");
          this.back();
        },
        error => {
          console.log("delete region failed");
          this._auth.logout();
        }
      )
    }
  }

  back(){
    this._router.navigate(["regions"]);
  }

  edit(){
    this.store.dispatch(EntitiesActions.selectEntity("region",this.region));
    this._router.navigate(["regions/edit/"+this.region.id]);
  }

  ngOnInit(){
    let state = this.store.getState();
    this.region = state.entities.selectedRegion;

    this.city = this.getName(state.entities.currentCities,this.region.cityId);
    this.state = this.getName(state.entities.currentStates,this.region.stateId);
    this.country = this.getName(state.entities.currentCountries,this.region.countryId);
    this.language = this.getName(state.entities.currentLanguages,this.region.languageId);
  }
}
