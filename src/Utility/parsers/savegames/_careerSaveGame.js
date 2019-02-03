const settings = window.require('electron-settings');
const fs = window.require('fs');
const path = window.require('path');
const parseXML = require('xml2js').parseString;

export const getCareerSaveGameData = saveGamePaths => {
  return new Promise((resolve, reject) => {
    const promiseList = [];

    for (const saveGamePath of saveGamePaths) {
      promiseList.push(parseCareerSaveGameXML(saveGamePath));
    }

    Promise.all(promiseList)
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const parseCareerSaveGameXML = saveGamePath => {
  return new Promise((resolve, reject) => {
    const { careerSaveGamePath } = saveGamePath;
    fs.readFile(careerSaveGamePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      parseXML(
        data,
        { explicitArray: false, mergeAttrs: true },
        (err, result) => {
          if (err) {
            reject(err);
          }
          const attrs = extractDesiredAttributes(result);
          resolve({
            ...saveGamePath,
            ...attrs
          });
        }
      );
    });
  });
};

const extractDesiredAttributes = ({ careerSavegame }) => {
  const { settings, statistics, mod } = careerSavegame;
  const settingsAttrs = extractSettingsAttrs(settings);
  const statisticsAttrs = extractStatisticsAttrs(statistics);
  const modAttrs = extractModAttrs(mod);
  return {
    ...settingsAttrs,
    ...statisticsAttrs,
    mods: modAttrs
  };
};

const extractModAttrs = mods => {
  if (!mods) {
    return [];
  }

  return mods
    .map(mod => {
      const { modName, title, required } = mod;
      return {
        modName,
        title,
        required
      };
    })
    .filter(mod => mod);
};

const extractSettingsAttrs = settings => {
  const { difficulty, mapId, playerName, mapTitle, savegameName } = settings;
  const map = parseMapFromMapId(mapId);
  return {
    difficulty,
    mapId,
    playerName,
    mapTitle,
    savegameName,
    map
  };
};

const parseMapFromMapId = mapId => {
  const regex = /(^[\w]+)/;
  const match = mapId.match(regex);
  return match[0] ? match[0] : mapId;
};

const extractStatisticsAttrs = statistics => {
  const { money, playTime } = statistics;
  return {
    money,
    playTime
  };
};
