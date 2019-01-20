const settings = window.require('electron-settings');
const parseXML = require('xml2js').parseString;
const fs = window.require('fs');
const path = window.require('path');
const etl = window.require('etl');
const unzipper = window.require('unzipper');
const toArrayBuffer = require('buffer-to-arraybuffer');
const renderCompressed = require('./render-compressed');
const parseDDS = require('parse-dds');

export const getMods = async () => {
  try {
    // TODO: Come up with more pragmatic function names later...
    // right now, lets go go go! End of my vacation is nearing!
    const modDirList = await getModDirList();
    const { zipDirList, dirList } = await fetchListOfMods(modDirList);

    // Get the path information from each mod.
    //
    const directoryList = await getDirectoryListOfMods(dirList);
    const zippedDirectoryList = await getZippedDirectoryListOfMods(zipDirList);

    const zippedMods = await parseModSpecificZippedXML(zippedDirectoryList);
    const unzippedMods = await parseModSpecificXML(directoryList);

    console.log('Unzipped Mods:', unzippedMods);

    const mods = [...zippedMods, ...unzippedMods];
    const ddsImageData = await getDDSImageData(mods);
    return ddsImageData;
  } catch (err) {
    console.log(err);
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
        ? promiseList.push(parseZippedDDSImage(mod))
        : promiseList.push(parseDDSImage(mod));
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

const parseDDSImage = mod => {
  const { imagePathDDS } = mod;
  const buf = fs.readFileSync(imagePathDDS);
  var data = toArrayBuffer(buf);
  try {
    const imgData = renderCompressed(parseDDS(data), data, {});
    return {
      ...mod,
      imgData
    };
  } catch (e) {}
};

const parseZippedDDSImage = mod => {
  return new Promise((resolve, reject) => {
    const { imagePathDDS } = mod;
    const zipPath = mod.path;
    const imageFile = path.basename(imagePathDDS);
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .pipe(
        etl.map(entry => {
          if (entry.path === imageFile)
            entry.buffer().then(content => {
              const data = toArrayBuffer(content);
              const imgData = renderCompressed(parseDDS(data), data, {});
              resolve({
                ...mod,
                imgData
              });
            });
          else entry.autodrain();
        })
      );
  });
};

const parseModSpecificZippedXML = paths => {
  return new Promise((resolve, reject) => {
    const promiseList = [];
    for (const path of paths) {
      for (const metaPath of path) {
        promiseList.push(readModSpecificXMLZippedFiles(metaPath));
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

const parseZippedModDescXML = path => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(unzipper.Parse())
      .pipe(
        etl.map(entry => {
          if (entry.path === 'modDesc.xml')
            entry.buffer().then(content => {
              const data = content.toString();
              parseXML(data, (err, result) => {
                if (err) {
                  reject(err);
                }

                const items = result.modDesc.storeItems[0].storeItem;
                const paths = [];
                for (const item of items) {
                  const xmlFile = item.$.xmlFilename;
                  const modSpecificXMLPath = `${path}/${xmlFile}`;
                  const pathObj = {
                    modSpecificXMLPath,
                    basePath: path
                  };
                  paths.push(pathObj);
                }
                return resolve(paths);
              });
            });
          else entry.autodrain();
        })
      );
  });
};

const getZippedDirectoryListOfMods = dirList => {
  return new Promise((resolve, reject) => {
    const promiseList = [];
    for (const dir of dirList) {
      promiseList.push(parseZippedModDescXML(dir));
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

const readModSpecificXMLZippedFiles = modPath => {
  return new Promise((resolve, reject) => {
    const { modSpecificXMLPath, basePath } = modPath;
    const modFileDir = path.dirname(modSpecificXMLPath);
    const filename = path.basename(modSpecificXMLPath);
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

                for (const key in result) {
                  const extractedData = extractValuesFromStoreData(
                    result[key],
                    basePath
                  );
                  return resolve({
                    ...extractedData,
                    isZip: true
                  });
                }
              });
            });
          else entry.autodrain();
        })
      );
  });
};

const fetchListOfMods = modDirList => {
  return new Promise((resolve, reject) => {
    const zipDirList = [];
    const dirList = [];

    for (const mod of modDirList) {
      try {
        const isDirectory = fs.lstatSync(mod).isDirectory();
        isDirectory ? dirList.push(mod) : zipDirList.push(mod);
      } catch (e) {
        reject(e);
      }
    }
    resolve({ zipDirList, dirList });
  });
};

const getDirectoryListOfMods = dirList => {
  return new Promise((resolve, reject) => {
    const promiseList = [];
    for (const dir of dirList) {
      promiseList.push(parseModDescXML(dir));
    }

    Promise.all(promiseList)
      .then(results => {
        console.log('RESULTS: ', results);
        const filteredResults = results.filter(x => x);
        resolve(filteredResults);
      })
      .catch(e => {
        reject(e);
      });
  });
};

const parseModDescXML = path => {
  const MOD_DESC_PATH = `${path}/modDesc.xml`;
  return new Promise((resolve, reject) => {
    fs.readFile(MOD_DESC_PATH, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      parseXML(data, (err, result) => {
        try {
          if (err) {
            reject(err);
          }
          const items = result.modDesc.storeItems[0].storeItem;
          const paths = [];

          // If the file is a map
          if (result.modDesc.maps) {
            resolve();
          }

          // For all others
          for (const item of items) {
            const xmlFile = item.$.xmlFilename;
            const modSpecificXMLPath = `${path}/${xmlFile}`;
            const pathObj = {
              modSpecificXMLPath,
              basePath: path
            };
            paths.push(pathObj);
          }
          resolve(paths);
        } catch (err) {
          resolve({});
        }
      });
    });
  });
};

const parseModSpecificXML = paths => {
  return new Promise((resolve, reject) => {
    const promiseList = [];
    for (const path of paths) {
      for (const metaPath of path) {
        promiseList.push(readModSpecificXMLFiles(metaPath));
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

const readModSpecificXMLFiles = path => {
  return new Promise((resolve, reject) => {
    const { modSpecificXMLPath, basePath } = path;
    fs.readFile(modSpecificXMLPath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      parseXML(data, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        }

        for (const key in result) {
          const extractedData = extractValuesFromStoreData(
            result[key],
            basePath
          );
          resolve({
            ...extractedData,
            isZip: false
          });
        }
      });
    });
  });
};

const objectIsMap = obj => {
  if (obj.maps) {
    return true;
  }
  return false;
};

const parseMapValues = (obj, path) => {
  const { maps, iconFileName, title } = obj;
  return { title: title.en, iconFileName };
};

const extractValuesFromStoreData = (obj, path) => {
  console.log('EXTRACT VALUES: ', obj);
  const { storeData } = obj;
  let { brand, price, image, name, category } = storeData;
  const imagePath = `${path}/${image}`;
  const pngRegex = /(.png)$/;
  const imagePathDDS = imagePath.replace(pngRegex, '.dds');

  // Sometimes the name is nested under `en`;
  if (name.hasOwnProperty('en')) {
    name = name.en;
  }

  const strippedObj = {
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

const getModDirList = async () => {
  return new Promise((resolve, reject) => {
    const MOD_DIR = getModDir();
    fs.readdir(MOD_DIR, 'utf8', (err, files) => {
      if (err) {
        reject(err);
      }
      const filteredFiles = filterFiles(files);
      resolve(createModDirList(MOD_DIR, filteredFiles));
    });
  });
};

// Remove files we want to ignore
const filterFiles = files => {
  const ignoreFiles = ['.DS_Store'];
  return files.filter(file => !ignoreFiles.includes(file));
};

const createModDirList = (modDir, files) => {
  const modPaths = [];
  for (const file of files) {
    const path = `${modDir}/${file}`;
    modPaths.push(path);
  }
  return modPaths;
};

const getModDir = () => {
  const gameDir = settings.get('gameDir.path');
  return `${gameDir}/mods`;
};
