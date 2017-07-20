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
  templateUrl: 'app/containers/state/StateInfo.html'
})

export class StateInfo implements OnInit{
  state:State;
  country:string;
  language:string;
  location:string;

  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    )
  {

  }

  back(){
    this._router.navigate(["states"]);
  }

  edit(){
    this.store.dispatch(EntitiesActions.selectEntity("state",this.state));
    this._router.navigate(["states/edit/"+this.state.id]);
  }

  delete(id)
  {
    if(confirm("Are you sure to delete state "+this.state.name+" ?"))
    {
      this._entity.delete("states",id).subscribe(
        state => {
          this.store.dispatch(EntitiesActions.deleteEntity("state",id));
          this.back();
        },
        error => {
          console.log("**delete** state to api and state");
          this._auth.logout();
        }
      );
    }
  }

  ngOnInit(){
    let data = this.store.getState();
    this.state = data.entities.selectedState;
    console.log(data);
    console.log("state init -----------");
    if(this.state.geoLocationId > 0)
    {
      data.entities.currentLocations.forEach((item,index)=>{
        if(item.id == this.state.geoLocationId)
        {
          this.location = "Latitude: "+item.latitude+" Longitude: "+item.longitude;
        }
      })
    }else
    {
      this.location = "none";
    }

    if(this.state.countryId > 0)
    {
      data.entities.currentCountries.forEach((item,index)=>{
        if(item.id == this.state.countryId)
        {
          this.country = item.name;
        }
      })
    }else
    {
      this.country = "none";
    }

    if(this.state.languageId > 0)
    {
      data.entities.currentLanguages.forEach((item,index)=>{
        if(item.id == this.state.languageId)
        {
          this.language = item.name;
        }
      })
    }else
    {
      this.language = "English";
    }
  }
}
