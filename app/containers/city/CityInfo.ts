import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { City } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/city/CityInfo.html'
})

export class CityInfo implements OnInit{
  city:City;
  state:string;
  language:string;
  latitude:number;
  longitude:number;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    )
  {
    let data = this.store.getState();
    console.log(data);
    this.city = data.entities.selectedCity;

    data.entities.currentStates.forEach((item,index)=>{
      if(item.id == this.city.stateId){this.state=item.name;}
    })

    data.entities.currentLanguages.forEach((item,index)=>{
      if(item.id == this.city.languageId){this.language=item.name;}
    })

    data.entities.currentLanguages.forEach((item,index)=>{
      if(item.id == this.city.languageId){this.language=item.name;}
    })

    data.entities.currentLocations.forEach((item,index)=>{
      if(item.id == this.city.geoLocationId){this.latitude=item.latitude;this.longitude=item.longitude;}
    })
  }

  back(){
    this._router.navigate(["cities"]);
  }

  delete(id)
  {
    if(confirm("Are you sure to delete city "+this.city.name+" ?")){
      this._entity.delete("cities",id).subscribe(
        city => {
          this.store.dispatch(EntitiesActions.deleteEntity("city",id));
          console.log("delete city");
          this.back();
        },
        error => {
          console.log("delete city failed");
          this._auth.logout();
        }
      );
    }
  }

  edit()
  {
    this.store.dispatch(EntitiesActions.selectEntity("city",this.city));
    this._router.navigate(["cities/edit/"+this.city.id]);
  }

  ngOnInit(){

  }
}
