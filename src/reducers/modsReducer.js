import { ADD_MODS, ADD_SAVEGAMES } from '../actions/ActionTypes';

const initialState = {
  saveGames: [],
  mods: []
};

const modsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MODS:
      return {
        ...state,
        mods: action.payload
      };
    case ADD_SAVEGAMES: 
      return {
        ...state,
        saveGames: action.payload
      }
    default:
      return state;
  }
};

export default modsReducer;
