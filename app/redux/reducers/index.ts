import {Reducer,combineReducers} from 'redux';
import {EntitiesState,EntitiesReducer} from './EntitiesReducer';
export * from './EntitiesReducer';

export interface AppState {
  entities:EntitiesState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  entities:EntitiesReducer,
});

export default rootReducer;
