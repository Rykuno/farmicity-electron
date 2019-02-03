import { getSaveGamePaths } from './_saveGamePaths';
import { getCareerSaveGameData } from './_careerSaveGame';
import { getMods } from '../mods/modParser';
import { store } from '../../../store';
import { addMods } from '../../../actions/modActions';

export const getSaveGames = async () => {
  try {
    await checkStoreForModData();
    const saveGamePaths = await getSaveGamePaths();
    const careerSaveGameData = await getCareerSaveGameData(saveGamePaths);
    return careerSaveGameData;
  } catch (err) {
    return new Error(err);
  }
};

const reduxStoreContainsMods = async () => {
  const reduxStoreMods = await store.getState().mods.mods;
  return reduxStoreMods.length > 1;
};

const fetchMods = async () => {
  const mods = await getMods();
  await store.dispatch(addMods(mods));
};

const checkStoreForModData = async () => {
  await store.dispatch(addMods([]));
  const storeContainsMods = await reduxStoreContainsMods();
  if (!storeContainsMods) {
    await fetchMods();
  }
};
