import { ADD_MODS } from '../actions/ActionTypes';

const initialState = {
  mods: []
};

const modsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MODS:
      return {
        ...state,
        mods: action.payload
      };
    default:
      return state;
  }
};

export default modsReducer;
