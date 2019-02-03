const settings = window.require('electron-settings');
const fs = window.require('fs');
const path = window.require('path');

/**
 * Finds the saveGamePaths
 * 
 * Return structure
 *{ 
 * careerSaveGamePath: "/Users/rykuno/Library/Application Support/FarmingSimulator2019/savegame1/careerSavegame.xml"
 * saveGameIndex: 1
 * saveGamePath: "/Users/rykuno/Library/Application Support/FarmingSimulator2019/savegame1"
 * }
 */

export const getSaveGamePaths = () => {
  return new Promise((resolve, reject) => {
    const saveGameDir = getGameDir();
    fs.readdir(saveGameDir, 'utf8', (err, files) => {
      if (err) {
        reject(err);
      }

      const saveGameFiles = extractSaveGames(files);
      resolve(saveGameFiles);
    });
  });
};

const extractSaveGames = files => {
  const saveGameFileRegex = /(?:savegame)([\d])/;
  const gameDir = getGameDir();
  const careerSaveGameXML = 'careerSavegame.xml';

  return files
    .map(file => {
      if (file.match(saveGameFileRegex)) {
        const saveGamePath = path.join(gameDir, file);
        const careerSaveGamePath = path.join(saveGamePath, careerSaveGameXML);
        const saveGameIndex = Number(file.match(saveGameFileRegex)[1]);
        return {
          saveGamePath,
          careerSaveGamePath,
          saveGameIndex
        };
      }
    })
    .filter(results => results);
};

// Get mod directory specified in settings
const getGameDir = () => {
  const gameDir = settings.get('gameDir.path');
  return `${gameDir}`;
};
