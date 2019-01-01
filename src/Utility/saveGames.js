const settings = window.require('electron-settings');
const fs = window.require('fs');
const parseXML = require('xml2js').parseString;

export const getSaveGames = async () => {
  try {
    const saveGame = await parseSaveGameFile();
    return saveGame;
  } catch (err) {
    return err;
  }
};

const parseSaveGameFile = () => {
  return new Promise((resolve, reject) => {
    const gameDir = getModDir();
    fs.readdir(gameDir, 'utf8', (err, files) => {
      if (err) {
        reject(err);
      }
      const saveGamePaths = getSaveGameDirectories(files);
      parseSaveGameXML(saveGamePaths)
        .then(savedGameData => {
          console.log(savedGameData);
          return parseVehicleXML(savedGameData);
        })
        .then(results => {
          resolve(results);
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

const parseVehicleXML = saveGameData => {
  return new Promise((resolve, reject) => {
    const promiseList = [];
    for (const saveGame of saveGameData) {
      promiseList.push(extractVehicleXMLData(saveGame));
    }
    Promise.all(promiseList)
      .then(results => {
        console.log('RESULTS: ', results);
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const extractVehicleXMLData = saveGame => {
  return new Promise((resolve, reject) => {
    const { path } = saveGame;
    const VEHICLE_XML = 'vehicles.xml';
    const vehicleXMLPath = `${path}/${VEHICLE_XML}`;
    console.log(vehicleXMLPath);
    fs.readFile(vehicleXMLPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      parseXML(data, (err, result) => {
        if (err) {
          reject(err);
        }
        const vehicles = extractVehicleJSONData(result);
        resolve({
          ...saveGame,
          vehicles
        })
      });
    });
  });
};

const extractVehicleJSONData = data => {
  const vehicles = data.vehicles.vehicle;
  console.log('Vehicles: ', vehicles);
  const vehicleList = [];
  for (const vehicle of vehicles) {
    const { filename, modName } = vehicle.$;
    vehicleList.push({ filename, modName });
  }
  return vehicleList;
};

const parseSaveGameXML = saveGamePaths => {
  return new Promise((resolve, reject) => {
    const promiseList = [];
    for (const saveGamePath of saveGamePaths) {
      promiseList.push(extractSaveGameXMLData(saveGamePath));
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

const extractSaveGameXMLData = path => {
  return new Promise((resolve, reject) => {
    console.log(path);
    const saveGameXMLPath = `${path}/careerSavegame.xml`;
    fs.readFile(saveGameXMLPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      try {
        parseXML(data, { explicitArray: false }, (err, result) => {
          if (err) {
            reject(err);
          }
          // level 1
          const { careerSavegame } = result;
          // level 2
          const { settings, statistics, mod } = careerSavegame;
          const mods = parseModsFromSaveGame(mod);
          // level 3
          const {
            difficulty,
            mapTitle,
            saveDate,
            savegameName,
            timeScale
          } = settings;
          const { money, playtime } = statistics;

          resolve({
            difficulty,
            mapTitle,
            saveDate,
            savegameName,
            mods,
            timeScale,
            money,
            playtime,
            path
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  });
};

const parseModsFromSaveGame = mods => {
  if (!mods) return undefined;

  const modList = [];
  for (const mod of mods) {
    const { modName, title } = mod.$;
    modList.push({ modName, title });
  }
  return modList;
};

const getSaveGameDirectories = files => {
  const gameDir = getModDir();
  const saveGameFileRegex = /(savegame[\d]+)/;
  return files
    .map(file => {
      if (file.match(saveGameFileRegex)) {
        console.log(file);
        return `${gameDir}/${file}`;
      }
    })
    .filter(game => game);
};

const getModDir = () => {
  const gameDir = settings.get('gameDir.path');
  return gameDir;
};
