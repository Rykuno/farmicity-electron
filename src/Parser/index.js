const { getPlatformInformation } = require('./platform');
const { parseCareerSaveGame } = require('./parsers/careerSavegame');

const parseSaveGame = async (saveGame, user) => {
  try {
    const platformInformation = getPlatformInformation(saveGame);
    const  careerSavegame = await parseCareerSaveGame(platformInformation);
    return {
      user,
      saveGame,
      platformInformation,
      careerSavegame
    };
  } catch (e) {
    return e;
  }
};


export default parseSaveGame;
