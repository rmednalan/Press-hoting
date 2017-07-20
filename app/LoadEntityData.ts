import { AuthenticationService } from './services/authentication.service';
import { EntityService } from './services/entity.service';
import { AppStore } from './app-store';
import { Store } from 'redux';
import { City,Country,Currency,Geolocation,Language,Region,State,ZipCode } from './redux/models';
import { EntitiesActions } from './redux/actions';
import { AppState} from './redux/reducers';

export default function LoadEntityData(store: Store<AppState>,entity:EntityService,auth:AuthenticationService) {
  //load City
  setTimeout(()=>
    entity.get("cities").subscribe(
      city_list =>{
        let city:City[] = city_list.data.items;
        store.dispatch(EntitiesActions.setEntity("city",city));
        console.log("loaded city");
      },
      error =>{
        console.log("get city failed");
        auth.logout();
      }
    )
  ,1000);

  //load Country
  setTimeout(()=>
  entity.get("countries").subscribe(
    country_list =>{
      let country:Country[] = country_list.data.items;
      store.dispatch(EntitiesActions.setEntity("country",country));
      console.log("loaded country");
    },
    error =>{
      console.log("get country failed");
      auth.logout();
    }
  ),1200);

  //load Currency
  setTimeout(()=>
  entity.get("currencies").subscribe(
    currency_list =>{
      let currency:Currency[] = currency_list.data.items;
      store.dispatch(EntitiesActions.setEntity("currency",currency));
      console.log("loaded currency");
    },
    error =>{
      console.log("get currency failed");
      auth.logout();
    }
  ),1300);

  //Load GeoLocation
  setTimeout(()=>
  entity.get("geoLocations").subscribe(
    location_list =>{
      let location:Geolocation[] = location_list.data.items;
      store.dispatch(EntitiesActions.setEntity("location",location));
      console.log("loaded location");
    },
    error =>{
      console.log("get location failed");
      auth.logout();
    }
  ),1400);

  //load Language
  setTimeout(()=>
  entity.get("languages").subscribe(
    language_list =>{
      let language:Language[] = language_list.data.items;
      store.dispatch(EntitiesActions.setEntity("language",language));
      console.log("loaded language");
    },
    error =>{
      console.log("get language failed");
      auth.logout();
    }
  ),1500);

  //Load Region
  setTimeout(()=>
  entity.get("regions").subscribe(
    region_list =>{
      let region:Region[] = region_list.data.items;
      store.dispatch(EntitiesActions.setEntity("region",region));
      console.log("loaded region");
    },
    error =>{
      console.log("get region failed");
      auth.logout();
    }
  ),2000);

  //Load State
  setTimeout(()=>
  entity.get("states").subscribe(
    state_list =>{
      let state:State[] = state_list.data.items;
      store.dispatch(EntitiesActions.setEntity("state",state));
      console.log("loaded state");
    },
    error =>{
      console.log("get state failed");
      auth.logout();
    }
  ),1700);

  //Load ZipCode
  setTimeout(()=>
  entity.get("zipCodes").subscribe(
    zip_list =>{
      let zip:ZipCode[] = zip_list.data.items;
      store.dispatch(EntitiesActions.setEntity("zipcode",zip));
      console.log("loaded zip");
    },
    error =>{
      console.log("get zipcode failed");
      auth.logout();
    }
  ),1800);
}
