import * as unzippedUtils from './parserUtils';
import * as zippedUtils from './zippedParserUtils';
import { flattenSelections } from 'apollo-utilities';
const settings = window.require('electron-settings');
const parseXML = require('xml2js').parseString;
const fs = window.require('fs');
const path = window.require('path');
const etl = window.require('etl');
const unzipper = window.require('unzipper');

export const getMods = async () => {
  try {
    // Get mod directory paths and if they are zipped
    /**
     * {
     * path: 'path/to/mod/directory',
     * isZip: false || true
     * }
     */
    const modDirList = await getModDirList();

    // In each modDesc.xml there can be multiple mods. Such as a combine may have a header and trailer.
    const listOfMods = await getListOfMods(modDirList);
    console.log('List of Mods: ', listOfMods);

    const modData = await getModDataFromXML(listOfMods);
    console.log('modData:', modData);

    const modsWithImageData = await getDDSImageData(modData);
    console.log('With image data', modsWithImageData);
    return modsWithImageData;
  } catch (err) {
    throw new Error(err);
  }
};

const getDDSImageData = mods => {
  return new Promise((resolve, reject) => {
    if (mods.length < 1) {
      resolve([]);
    }

    let promiseList = [];
    for (const mod of mods) {
      mod.isZip
        ? promiseList.push(zippedUtils.parseDDSImageData(mod))
        : promiseList.push(unzippedUtils.parseDDSImageData(mod));
    }

    Promise.all(promiseList)
      .then(results => {
        resolve(results);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const getModDataFromXML = mods => {
  return new Promise((resolve, reject) => {
    const flattendMods = mods.filter(x => x).flat();
    console.log('flattened mods: ', flattendMods);
    const promiseList = [];
    for (const mod of flattendMods) {
      const { isZip } = mod;
      if (!isZip) {
        promiseList.push(readModSpecificXMLFiles(mod));
      } else {
        promiseList.push(readModSpecificXMLZippedFiles(mod));
      }
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

const extractValuesFromStoreData = (obj, path) => {
  const { storeData } = obj;
  let { brand, price, image, name, category, isZip } = storeData;
  const imagePath = `${path}/${image}`;
  const pngRegex = /(.png)$/;
  const imagePathDDS = imagePath.replace(pngRegex, '.dds');

  // Sometimes the name is nested under `en`;
  if (name.hasOwnProperty('en')) {
    name = name.en;
  }

  const strippedObj = {
    type: 'storeItem',
    brand,
    price,
    image,
    category,
    name,
    path,
    imagePath,
    imagePathDDS
  };
  return strippedObj;
};

const readModSpecificXMLFiles = mod => {
  return new Promise((resolve, reject) => {
    const { modSpecificXMLPath, basePath, type, isZip } = mod;
    fs.readFile(modSpecificXMLPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      parseXML(data, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        }

        switch (type) {
          case 'storeItem':
            resolve({ ...parseStoreItemXMLData(result, basePath), isZip });
            return;
          case 'map':
            resolve({ ...parseMapXMLData(result, basePath), isZip });
            return;
          case 'gameplay':
            resolve({ ...parseGamePlayXMLData(result, basePath), isZip });
            return;
          default:
            resolve();
            break;
        }
      });
    });
  });
};

const readModSpecificXMLZippedFiles = mod => {
  return new Promise((resolve, reject) => {
    const { modSpecificXMLPath, basePath, type, isZip } = mod;
    const modFileDir = path.dirname(modSpecificXMLPath);
    const filename = path.basename(modSpecificXMLPath);
    console.log('wtf', modFileDir);
    fs.createReadStream(modFileDir)
      .pipe(unzipper.Parse())
      .pipe(
        etl.map(entry => {
          if (entry.path === filename)
            entry.buffer().then(content => {
              const data = content.toString();
              parseXML(data, { explicitArray: false }, (err, result) => {
                if (err) {
                  reject(err);
                }

                switch (type) {
                  case 'storeItem':
                    resolve({
                      ...parseStoreItemXMLData(result, basePath),
                      isZip
                    });
                    return;
                  case 'map':
                    resolve({ ...parseMapXMLData(result, basePath), isZip });
                    return;
                  case 'gameplay':
                    resolve({
                      ...parseGamePlayXMLData(result, basePath),
                      isZip
                    });
                    return;
                  default:
                    resolve();
                    break;
                }
              });
            });
          else entry.autodrain();
        })
      );
  });
};

const parseGamePlayXMLData = ({ modDesc }, basePath) => {
  try {
    const title = modDesc.title.en;
    const image = modDesc.iconFilename;
    const imagePath = `${basePath}/${image}`;
    const pngRegex = /(.png)$/;
    const imagePathDDS = imagePath.replace(pngRegex, '.dds');
    return {
      type: 'gameplay',
      title,
      image,
      imagePath,
      imagePathDDS
    };
  } catch (err) {
    throw new Error(err);
  }
};

const parseStoreItemXMLData = (result, basePath) => {
  for (const key in result) {
    const extractedData = extractValuesFromStoreData(result[key], basePath);
    return {
      ...extractedData
    };
  }
};

const parseMapXMLData = (result, basePath) => {
  try {
    const { modDesc } = result;
    const title = modDesc.title.en;
    const image = modDesc.iconFilename;
    const imagePath = `${basePath}/${image}`;
    const pngRegex = /(.png)$/;
    const imagePathDDS = imagePath.replace(pngRegex, '.dds');
    return {
      type: 'map',
      title,
      image,
      imagePath,
      imagePathDDS
    };
  } catch (err) {
    throw new Error(err);
  }
};

const getListOfMods = modDirs => {
  return new Promise((resolve, reject) => {
    const promiseList = [];

    for (const dir of modDirs) {
      promiseList.push(parseModDesc(dir));
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

const parseModDesc = dir => {
  return new Promise((resolve, reject) => {
    const { path, isZip } = dir;
    if (isZip) {
      return resolve(zippedUtils.parseModDescXML(path));
    }
    return resolve(unzippedUtils.parseModDescXML(path));
  });
};

const getModDirList = async () => {
  return new Promise((resolve, reject) => {
    const MOD_DIR = getModDir();
    fs.readdir(MOD_DIR, 'utf8', (err, files) => {
      if (err) {
        reject(err);
      }
      const filteredFiles = filterFiles(files);
      const modDirList = createModDirList(MOD_DIR, filteredFiles);
      resolve(modDirList);
    });
    // NOTE: TAKE CARE OF PREFAB ITEMS;
  });
};

const createModDirList = (modDir, files) => {
  const modPaths = [];
  for (const file of files) {
    const path = `${modDir}/${file}`;
    const isZip = file.includes('.zip');
    const obj = {
      path,
      isZip
    };
    modPaths.push(obj);
  }
  return modPaths;
};

// Get mod directory specified in settings
const getModDir = () => {
  const gameDir = settings.get('gameDir.path');
  return `${gameDir}/mods`;
};

// Remove files we want to ignore
const filterFiles = files => {
  const ignoreFiles = ['.DS_Store'];
  return files.filter(file => !ignoreFiles.includes(file));
};
