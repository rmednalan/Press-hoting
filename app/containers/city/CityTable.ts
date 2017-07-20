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
  templateUrl: 'app/containers/city/CityTable.html'
})

export class CityTable implements OnInit{
  cities:City[];

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){}

  add()
  {
    this._router.navigate(["cities/add"]);
  }

  onRowSelect(event){
    this.store.dispatch(EntitiesActions.selectEntity("city",event.data));
    let state = this.store.getState();
    localStorage.setItem("entities",JSON.stringify(state.entities));
    console.log("select entity");
    this._router.navigate(["cities/info"]);
  }

  getState(id)
  {
    var state_name = "none";
    let state = this.store.getState();
    state.entities.currentStates.forEach((item,index)=>{
      if(item.id == id)
      {
        state_name = item.name;
      }
    });

    return state_name;
  }

  ngOnInit(){
    let state = this.store.getState();
    this.cities = state.entities.currentCities;
  }
}
