import { getSaveGamePaths } from './_saveGamePaths';
import { getCareerSaveGameData } from './_careerSaveGame';
import { getMods } from '../mods';
import { store } from '../../../store';
import { addMods, addSaveGaves } from '../../../actions/actions';

export const getSaveGames = async () => {
  try {
    // Uncomment these two to refresh the store
    // await store.dispatch(addSaveGaves([]));
    // await store.dispatch(addMods([]));
    await checkStoreForModData();
    const saveGamePaths = await getSaveGamePaths();
    const careerSaveGameData = await getCareerSaveGameData(saveGamePaths);
    console.log(careerSaveGameData);
    await saveGamesToStore(careerSaveGameData);
  } catch (err) {
    return new Error(err);
  }
};

const saveGamesToStore = async saveGames => {
  await store.dispatch(addSaveGaves(saveGames));
};

const reduxStoreContainsMods = async () => {
  const reduxStoreMods = await store.getState().store.mods;
  return reduxStoreMods.length > 1;
};

const fetchMods = async () => {
  const mods = await getMods();
  console.log(mods);
  await store.dispatch(addMods(mods));
};

const checkStoreForModData = async () => {
  const storeContainsMods = await reduxStoreContainsMods();
  if (!storeContainsMods) {
    await fetchMods();
  }
};
