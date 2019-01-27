const parseXML = require('xml2js').parseString;
const fs = window.require('fs');
const path = window.require('path');
const etl = window.require('etl');
const unzipper = window.require('unzipper');
const toArrayBuffer = require('buffer-to-arraybuffer');
const renderCompressed = require('../../render-compressed');
const parseDDS = require('parse-dds');

const MOD_TYPE = {
  MAP: 'map',
  STORE_ITEM: 'storeItem',
  GAMEPLAY: 'gameplay',
  OTHER: 'other'
};

export const parseModDescXML = path => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(unzipper.Parse())
      .pipe(
        etl.map(entry => {
          if (entry.path === 'modDesc.xml')
            entry.buffer().then(content => {
              const data = content.toString();
              parseXML(data, (err, result) => {
                try {
                  if (err) {
                    reject(err);
                  }

                  const modType = getModType(result);

                  const { MAP, STORE_ITEM, GAMEPLAY, OTHER } = MOD_TYPE;
                  switch (modType) {
                    case MAP:
                      resolve(parseMap(path, result));
                      return;
                    case STORE_ITEM:
                      resolve(parseStoreItem(path, result));
                      return;
                    case GAMEPLAY:
                      resolve(parseGamePlay(path, result));
                      return;
                    case OTHER:
                      resolve({ type: OTHER });
                      break;
                    default:
                      break;
                  }
                } catch (err) {
                  resolve({});
                }
              });
            });
          else entry.autodrain();
        })
      );
  });
};

export const parseDDSImageData = mod => {
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

const parseStoreItem = (path, { modDesc }) => {
  try {
    const items = modDesc.storeItems[0].storeItem;
    const paths = [];

    // For all others
    for (const item of items) {
      const xmlFile = item.$.xmlFilename;
      const modSpecificXMLPath = `${path}/${xmlFile}`;
      const pathObj = {
        modSpecificXMLPath,
        basePath: path,
        type: MOD_TYPE.STORE_ITEM,
        isZip: true
      };
      paths.push(pathObj);
    }
    return paths;
  } catch (err) {
    throw new Error(err);
  }
};

const parseMap = (path, { modDesc }) => {
  try {
    return [
      {
        modSpecificXMLPath: `${path}/modDesc.xml`,
        basePath: path,
        type: MOD_TYPE.MAP,
        isZip: true
      }
    ];
  } catch (err) {
    throw new Error(err);
  }
};

const parseGamePlay = (path, { modDesc }) => {
  try {
    return [
      {
        modSpecificXMLPath: `${path}/modDesc.xml`,
        basePath: path,
        type: MOD_TYPE.GAMEPLAY,
        isZip: true
      }
    ];
  } catch (err) {
    throw new Error(err);
  }
};

const getModType = ({ modDesc }) => {
  const { STORE_ITEM, MAP, GAMEPLAY, OTHER } = MOD_TYPE;
  if (modDesc.hasOwnProperty('storeItems') && modDesc.hasOwnProperty('maps')) {
    return MAP;
  }

  if (modDesc.hasOwnProperty('storeItems') && !modDesc.hasOwnProperty('maps')) {
    return STORE_ITEM;
  }

  if (!modDesc.hasOwnProperty('storeItems')) {
    return GAMEPLAY;
  }

  return OTHER;
};
