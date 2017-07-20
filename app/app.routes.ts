import {Routes,RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {Application} from './application';

import {DashboardComponent} from './dashboard/dashboard';
import {LoginComponent} from './login/login.component';

import{LanguagePage} from "./pages/LanguagePage";
import{LanguageTable} from "./containers/language/LanguageTable";
import{AddLanguage} from "./containers/language/AddLanguage";
import{LanguageInfo} from "./containers/language/LanguageInfo";
import{EditLanguage} from "./containers/language/EditLanguage";

import{CurrencyPage} from "./pages/CurrencyPage";
import{CurrencyTable} from "./containers/currency/CurrencyTable";
import{AddCurrency} from "./containers/currency/AddCurrency";
import{CurrencyInfo} from "./containers/currency/CurrencyInfo";
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

export const appRoutes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'languages', component: LanguagePage,
      children: [
        { path: '', component: LanguageTable },
        { path: 'add', component: AddLanguage },
        { path: 'info', component: LanguageInfo },
        { path: 'edit/:id', component: EditLanguage }
      ]
    },
   { path: 'currencies', component: CurrencyPage,
      children: [
        { path: '', component: CurrencyTable },
        { path: 'add', component: AddCurrency },
        { path: 'info', component: CurrencyInfo },
        { path: 'edit/:id', component: EditCurrency },
      ]
   },
   { path: 'geoLocations', component: GeoLocationPage,
      children: [
        { path: '', component: GeolocationTable },
        { path: 'add', component: AddGeolocation },
        { path: 'info', component: GeolocationInfo },
        { path: 'edit/:id', component: EditGeolocation },
      ]
   },
   { path: 'countries', component: CountryPage,
      children: [
        { path: '', component: CountryTable },
        { path: 'add', component: AddCountry },
        { path: 'info', component: CountryInfo },
        { path: 'edit/:id', component: EditCountry },
      ]
   },
   { path: 'states', component: StatePage,
      children: [
        { path: '', component: StateTable },
        { path: 'add', component: AddState },
        { path: 'info', component: StateInfo },
        { path: 'edit/:id', component: EditState },
      ]
   },
   { path: 'cities', component: CityPage,
      children: [
        { path: '', component: CityTable },
        { path: 'add', component: AddCity },
        { path: 'info', component: CityInfo },
        { path: 'edit/:id', component: EditCity },
      ]
   },
   { path: 'regions', component: RegionPage,
      children: [
        { path: '', component: RegionTable },
        { path: 'add', component: AddRegion },
        { path: 'info', component: RegionInfo },
        { path: 'edit/:id', component: EditRegion },
      ]
   },
   { path: 'zip-codes', component: ZipCodePage,
      children: [
        { path: '', component: ZipCodeTable },
        { path: 'add', component: AddZipCode },
        { path: 'info', component: ZipCodeInfo },
        { path: 'edit/:id', component: EditZipCode },
      ]
   },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
