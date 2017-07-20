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
  templateUrl: 'app/containers/zipcode/ZipCodeTable.html'
})
export class ZipCodeTable implements OnInit{
  zipcodes:ZipCode[];

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
  ){}

  add(){
    this._router.navigate(["zip-codes/add"]);
  }

  onRowSelect(event)
  {
    this.store.dispatch(EntitiesActions.selectEntity("zipcode",event.data));
    let state = this.store.getState();
    localStorage.setItem("entities",JSON.stringify(state.entities));
    this._router.navigate(["zip-codes/info"]);
  }

  getCity(id)
  {
    var city = "none";
    let state = this.store.getState();
    state.entities.currentCities.forEach((item,index)=>{
      if(item.id == id){
        city = item.name;
      }
    });

    return city;
  }

  ngOnInit(){
    let state = this.store.getState();
    this.zipcodes = state.entities.currentZipCodes;
  }
}
