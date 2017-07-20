import {Component,OnInit,Inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {EntityService} from '../../services/entity.service';
import {AppStore} from '../../app-store';
import {Store} from 'redux';
import {State} from '../../redux/models';
import {EntitiesActions} from '../../redux/actions';
import {AppState} from '../../redux/reducers';

@Component({
  templateUrl: 'app/containers/state/StateTable.html'
})

export class StateTable implements OnInit{
  states:State[];
  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){

    }

  add(){
    this._router.navigate(['states/add']);
  }

  onRowSelect(event){
    var state = event.data;
    this.store.dispatch(EntitiesActions.selectEntity("state",state));
    let data = this.store.getState();
    localStorage.setItem("entities",JSON.stringify(data.entities));
    this._router.navigate(["states/info"]);
  }

  getCountry(id)
  {
    var name = "none"+id;
    let state = this.store.getState();
    state.entities.currentCountries.forEach((item,index)=>{
      if(item.id == id)
      {
        name = item.name;
      }
    })

    return name;
  }

  ngOnInit(){
    let data = this.store.getState();
    this.states = data.entities.currentStates;
  }
}
