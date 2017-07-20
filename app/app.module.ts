import {NgModule}      from '@angular/core';
import {HttpModule, RequestOptions, Http, XHRBackend} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy,HashLocationStrategy} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {routing} from './app.routes';
import {PrimengModules} from './modules/primeng-modules.module';

/** components **/
import {Application}  from './application';
import {DashboardComponent} from './dashboard/dashboard';
import {LoginComponent} from './login/login.component';

/** pages **/
import{LanguagePage} from "./pages/LanguagePage";
import{LanguageTable} from "./containers/language/LanguageTable";
import{AddLanguage} from "./containers/language/AddLanguage";
import{EditLanguage} from "./containers/language/EditLanguage";
import{LanguageInfo} from "./containers/language/LanguageInfo";

import{CurrencyPage} from "./pages/CurrencyPage";
import{CurrencyTable} from "./containers/currency/CurrencyTable";
import{CurrencyInfo} from "./containers/currency/CurrencyInfo";
import{AddCurrency} from "./containers/currency/AddCurrency";
import{EditCurrency} from "./containers/currency/EditCurrency";

import{GeoLocationPage} from "./pages/GeoLocationPage";
import{GeolocationTable} from "./containers/geolocation/GeolocationTable";
import{GeolocationInfo} from "./containers/geolocation/GeolocationInfo";
import{AddGeolocation} from "./containers/geolocation/AddGeolocation";
import{EditGeolocation} from "./containers/geolocation/EditGeolocation";

import{CountryPage} from "./pages/CountryPage";
import{CountryTable} from "./containers/country/CountryTable";
import{CountryInfo} from "./containers/country/CountryInfo";
import{AddCountry} from "./containers/country/AddCountry";
import{EditCountry} from "./containers/country/EditCountry";

import{StatePage} from "./pages/StatePage";
import{StateTable} from "./containers/state/StateTable";
import{StateInfo} from "./containers/state/StateInfo";
import{AddState} from "./containers/state/AddState";
import{EditState} from "./containers/state/EditState";

import{CityPage} from "./pages/CityPage";
import{CityTable} from "./containers/city/CityTable";
import{CityInfo} from "./containers/city/CityInfo";
import{AddCity} from "./containers/city/AddCity";
import{EditCity} from "./containers/city/EditCity";

import{RegionPage} from "./pages/RegionPage";
import{RegionTable} from "./containers/region/RegionTable";
import{RegionInfo} from "./containers/region/RegionInfo";
import{AddRegion} from "./containers/region/AddRegion";
import{EditRegion} from "./containers/region/EditRegion";

import{ZipCodePage} from "./pages/ZipCodePage";
import{ZipCodeTable} from "./containers/zipcode/ZipCodeTable";
import{ZipCodeInfo} from "./containers/zipcode/ZipCodeInfo";
import{AddZipCode} from "./containers/zipcode/AddZipCode";
import{EditZipCode} from "./containers/zipcode/EditZipCode";


/** services **/
import {AuthenticationService} from './services/authentication.service';
import {ConfigService} from './services/config.service';
import {EntityService} from './services/entity.service';

/** redux **/
import {createStore,Store, compose, StoreEnhancer} from 'redux';
import { AppStore } from './app-store';
import {AppState,default as reducer} from './redux/reducers';

let devtools: StoreEnhancer<AppState> =
  window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

let store: Store<AppState> = createStore<AppState>(
  reducer,
  compose(devtools)
);

@NgModule({
  imports: [
    PrimengModules,
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ReactiveFormsModule,
  ],
  declarations: [
    Application,
    DashboardComponent,
    LoginComponent,

    LanguagePage,LanguageTable,AddLanguage,LanguageInfo,EditLanguage,
    CurrencyPage,CurrencyTable,AddCurrency,CurrencyInfo,EditCurrency,
    GeoLocationPage,GeolocationTable,AddGeolocation,GeolocationInfo,EditGeolocation,
    CountryPage,CountryTable,CountryInfo,AddCountry,EditCountry,
    StatePage,StateTable,StateInfo,AddState,EditState,
    CityPage,CityTable,CityInfo,AddCity,EditCity,
    RegionPage,RegionTable,RegionInfo,AddRegion,EditRegion,
    ZipCodePage,ZipCodeTable,ZipCodeInfo,AddZipCode,EditZipCode
  ],
  providers: [
    { provide: AppStore, useFactory: () => store },
    AuthenticationService,
    ConfigService,
    EntityService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},

  ],
  bootstrap:[Application]
})
export class AppModule {

}
