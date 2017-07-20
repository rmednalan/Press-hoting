import { Component,Inject,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AppStore } from '../../app-store';
import { Store } from 'redux';
import { Language } from '../../redux/models';
import { EntitiesActions } from '../../redux/actions';
import { AppState } from '../../redux/reducers';
import { EntityService } from '../../services/entity.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'app/containers/language/LanguageInfo.html'
})
export class LanguageInfo implements OnInit{
  language:Language;
  
  constructor(
    private _entity:EntityService,
    @Inject(AppStore) private store: Store<AppState>,
    private _auth:AuthenticationService,
    private _router: Router
    ){}


  back()
  {
    this._router.navigate(['languages']);
  }

  edit()
  {
    this.store.dispatch(EntitiesActions.selectEntity("language",this.language));
    this._router.navigate(['languages/edit/'+this.language.id]);
  }

  delete(lang_id)
  {
    console.log(lang_id);
    if(confirm("Are you sure to delete language "+this.language.name+" ?"))
    {
      this._entity.delete("languages",lang_id).subscribe(
        lang => {
          this.store.dispatch(EntitiesActions.deleteEntity("language",lang_id));
          console.log("**deleted** a language");
          this.back();
        },
        error => {
          console.log("language delete failed");
          this._auth.logout();
        }
      );
    }
  }

  ngOnInit(){
    let state = this.store.getState();
    this.language = state.entities.selectedLanguage;
  }
}
