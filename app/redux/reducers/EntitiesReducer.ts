import { Action } from 'redux';
import { City,Country,Currency,Language,State,Geolocation,Region,ZipCode } from '../models';
import {EntitiesActions} from '../actions';

export interface EntitiesState {
  currentCities:City[];
  selectedCity?:City;

  currentCountries:Country[];
  selectedCountry?:Country;

  currentCurrencies:Currency[];
  selectedCurrency?:Currency;

  currentLanguages:Language[];
  selectedLanguage?:Language;

  currentRegions : Region[];
  selectedRegion ?: Region;

  currentStates:State[];
  selectedState?:State;

  currentLocations:Geolocation[];
  selectedLocation?:Geolocation;

  currentZipCodes:ZipCode[];
  selectedZipCode?:ZipCode;
}

const initialState:EntitiesState = {
  currentCities:null,
  selectedCity:null,

  currentCountries:null,
  selectedCountry:null,

  currentCurrencies:null,
  selectedCurrency:null,

  currentLanguages:null,
  selectedLanguage:null,

  currentRegions :null,
  selectedRegion :null,

  currentStates:null,
  selectedState:null,

  currentLocations:null,
  selectedLocation:null,

  currentZipCodes:null,
  selectedZipCode:null,
}

export const EntitiesReducer =  function (state:EntitiesState = initialState,action:Action):EntitiesState{
  switch(action.type)
  {
    case EntitiesActions.SET_ENTITY:
      const infoSet = (<EntitiesActions.SetEntityAction>action);
      return {
        currentCities:(infoSet.entity=="city")?infoSet.data:state.currentCities,
        currentCountries:(infoSet.entity=="country")?infoSet.data:state.currentCountries,
        currentCurrencies:(infoSet.entity=="currency")?infoSet.data:state.currentCurrencies,
        currentLanguages:(infoSet.entity=="language")?infoSet.data:state.currentLanguages,
        currentRegions:(infoSet.entity=="region")?infoSet.data:state.currentRegions,
        currentLocations:(infoSet.entity=="location")?infoSet.data:state.currentLocations,
        currentStates:(infoSet.entity=="state")?infoSet.data:state.currentStates,
        currentZipCodes:(infoSet.entity=="zipcode")?infoSet.data:state.currentZipCodes
      }

    case EntitiesActions.ADD_ENTITY:
      const infoAdd = (<EntitiesActions.AddEntityAction>action);
      return {
        currentCities:(infoAdd.entity=="city")?state.currentCities.concat(infoAdd.data):state.currentCities,
        currentCountries:(infoAdd.entity=="country")?state.currentCountries.concat(infoAdd.data):state.currentCountries,
        currentCurrencies:(infoAdd.entity=="currency")?state.currentCurrencies.concat(infoAdd.data):state.currentCurrencies,
        currentLanguages:(infoAdd.entity=="language")?state.currentLanguages.concat(infoAdd.data):state.currentLanguages,
        currentRegions:(infoAdd.entity=="region")?state.currentRegions.concat(infoAdd.data):state.currentRegions,
        currentLocations:(infoAdd.entity=="location")?state.currentLocations.concat(infoAdd.data):state.currentLocations,
        currentStates:(infoAdd.entity=="state")?state.currentStates.concat(infoAdd.data):state.currentStates,
        currentZipCodes:(infoAdd.entity=="zipcode")?state.currentZipCodes.concat(infoAdd.data):state.currentZipCodes
      }

    case EntitiesActions.SELECT_ENTITY:
      const infoSelect = (<EntitiesActions.SelectEntityAction>action);
      return{
        currentCities:state.currentCities,
        currentCountries:state.currentCountries,
        currentCurrencies:state.currentCurrencies,
        currentLanguages:state.currentLanguages,
        currentRegions:state.currentRegions,
        currentLocations:state.currentLocations,
        currentZipCodes:state.currentZipCodes,
        currentStates:state.currentStates,
        selectedCity:(infoSelect.entity=="city")?infoSelect.data:state.selectedCity,
        selectedCountry:(infoSelect.entity=="country")?infoSelect.data:state.selectedCountry,
        selectedCurrency:(infoSelect.entity=="currency")?infoSelect.data:state.selectedCurrency,
        selectedLanguage:(infoSelect.entity=="language")?infoSelect.data:state.selectedLanguage,
        selectedRegion:(infoSelect.entity=="region")?infoSelect.data:state.selectedRegion,
        selectedLocation:(infoSelect.entity=="location")?infoSelect.data:state.selectedLocation,
        selectedState:(infoSelect.entity=="state")?infoSelect.data:state.selectedState,
        selectedZipCode:(infoSelect.entity=="zipcode")?infoSelect.data:state.selectedZipCode
      }

    case EntitiesActions.DELETE_ENTITY:
      const infoDelete = (<EntitiesActions.DeleteEntityAction>action);
      if(infoDelete.entity == "city"){
        state.currentCities.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentCities.splice(index,1)}
        })
      }

      if(infoDelete.entity == "country"){
        state.currentCountries.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentCountries.splice(index,1)}
        })
      }

      if(infoDelete.entity == "currency"){
        state.currentCurrencies.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentCurrencies.splice(index,1)}
        })
      }

      if(infoDelete.entity == "language"){
        state.currentLanguages.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentLanguages.splice(index,1)}
        })
      }

      if(infoDelete.entity == "location"){
        state.currentLocations.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentLocations.splice(index,1)}
        })
      }

      if(infoDelete.entity == "region"){
        state.currentRegions.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentRegions.splice(index,1)}
        })
      }

      if(infoDelete.entity == "state"){
        state.currentStates.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentStates.splice(index,1)}
        })
      }

      if(infoDelete.entity == "zipcode"){
        state.currentZipCodes.forEach((item,index)=>{
          if(item.id == infoDelete.id){state.currentZipCodes.splice(index,1)}
        })
      }

      return{
        currentCities:state.currentCities,
        currentCountries:state.currentCountries,
        currentCurrencies:state.currentCurrencies,
        currentLanguages:state.currentLanguages,
        currentRegions:state.currentRegions,
        currentLocations:state.currentLocations,
        currentStates:state.currentStates,
        currentZipCodes:state.currentZipCodes,
      }

    case EntitiesActions.EDIT_ENTITY:
      const infoEdit = (<EntitiesActions.EditEntityAction>action);
      if(infoEdit.entity == "city"){
        state.currentCities.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentCities[index] = infoEdit.data}
        })
      }

      if(infoEdit.entity == "country"){
        state.currentCountries.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentCountries[index] = infoEdit.data}
        })
      }

      if(infoEdit.entity == "currency"){
        state.currentCurrencies.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentCurrencies[index] = infoEdit.data}
        })
      }

      if(infoEdit.entity == "language"){
        state.currentLanguages.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentLanguages[index] = infoEdit.data}
        })
      }

      if(infoEdit.entity == "location"){
        state.currentLocations.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentLocations[index] = infoEdit.data}
        })
      }

      if(infoEdit.entity == "region"){
        state.currentRegions.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentRegions[index] = infoEdit.data}
        })
      }

      if(infoEdit.entity == "state"){
        state.currentStates.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentStates[index] = infoEdit.data}
        })
      }

      if(infoEdit.entity == "zipcode"){
        state.currentZipCodes.forEach((item,index)=>{
          if(item.id == infoEdit.id){state.currentZipCodes[index] = infoEdit.data}
        })
      }

      return{
        currentCities:state.currentCities,
        currentCountries:state.currentCountries,
        currentCurrencies:state.currentCurrencies,
        currentLanguages:state.currentLanguages,
        currentLocations:state.currentLocations,
        currentRegions:state.currentRegions,
        currentStates:state.currentStates,
        currentZipCodes:state.currentZipCodes,
      }

    default:
      return state;
  }

}
