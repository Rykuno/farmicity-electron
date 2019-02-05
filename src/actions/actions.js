import { ADD_MODS, ADD_SAVEGAMES } from './ActionTypes';

export const addMods = mods => ({
  type: ADD_MODS,
  payload: mods
});

export const addSaveGaves = saveGames => ({
  type: ADD_SAVEGAMES,
  payload: saveGames
});
