import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { ZipCode } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/zipcode/ZipCodeInfo.html'
})
export class ZipCodeInfo implements OnInit{
  zipcode:ZipCode;
  city:string;
  latitude:number;
  longitude:number;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
  ){}

  back(){
    this._router.navigate(["zip-codes"]);
  }

  edit(){
    this.store.dispatch(EntitiesActions.selectEntity("zipcode",this.zipcode));
    this._router.navigate(["zip-codes/edit/"+this.zipcode.id]);
  }

  delete(id){
    if(confirm("Are you sure to delete zipcode "+this.zipcode.code+" ?")){
      this._entity.delete("zipCodes",id).subscribe(
        zip => {
          this.store.dispatch(EntitiesActions.deleteEntity("zipcode",id));
          console.log("delete from api and state");
          this.back();
        },
        error => {
          console.log("delete zip failed");
          this._auth.logout();
        }
      );
    }
  }
  ngOnInit(){
    let state = this.store.getState();
    this.zipcode = state.entities.selectedZipCode;

    state.entities.currentCities.forEach((item,index)=>{
      if(item.id == this.zipcode.cityId)
      {
        this.city = item.name;
      }
    });

    state.entities.currentLocations.forEach((item,index)=>{
      if(item.id == this.zipcode.geoLocationId)
      {
        this.latitude = item.latitude;
        this.longitude = item.longitude;
      }
    });
  }
}
