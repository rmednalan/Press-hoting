import {Action,ActionCreator} from 'redux';

export const SET_ENTITY = 'Set Entity';
export interface SetEntityAction extends Action {
  entity:string;
  data:any[];
}

export const setEntity:ActionCreator<SetEntityAction> = (entity:string,data:any[]):SetEntityAction => {
  return {
    type: SET_ENTITY,
    entity:entity,
    data:data
  }
}

export const ADD_ENTITY = 'Add Entity';
export interface AddEntityAction extends Action {
  entity:string;
  data:any;
}

export const addEntity:ActionCreator<AddEntityAction> = (entity:string,data:any):AddEntityAction => {
  return {
    type: ADD_ENTITY,
    entity:entity,
    data:data
  }
}

export const SELECT_ENTITY = 'Select Entity';
export interface SelectEntityAction extends Action {
  entity:string;
  data:any;
}

export const selectEntity:ActionCreator<SelectEntityAction> = (entity:string,data:any):SelectEntityAction => {
  return {
    type: SELECT_ENTITY,
    entity:entity,
    data:data
  }
}

export const DELETE_ENTITY = 'Delete Entity';
export interface DeleteEntityAction extends Action {
  entity:string;
  id:number;
}

export const deleteEntity:ActionCreator<DeleteEntityAction> = (entity:string,id:number):DeleteEntityAction => {
  return {
    type: DELETE_ENTITY,
    entity:entity,
    id:id
  }
}

export const EDIT_ENTITY = 'Edit Entity';
export interface EditEntityAction extends Action {
  entity:string;
  data:any;
  id:number;
}

export const editEntity:ActionCreator<EditEntityAction> = (entity:string,data:any,id:number):EditEntityAction => {
  return {
    type: EDIT_ENTITY,
    entity:entity,
    data:data,
    id:id
  }
}
