const parseXML = require('xml2js').parseString;
const fs = window.require('fs');
const toArrayBuffer = require('buffer-to-arraybuffer');
const renderCompressed = require('../render-compressed');
const parseDDS = require('parse-dds');

const MOD_TYPE = {
  MAP: 'map',
  STORE_ITEM: 'storeItem',
  GAMEPLAY: 'gameplay',
  OTHER: 'other'
};

export const parseModDescXML = path => {
  const MOD_DESC_PATH = `${path}/modDesc.xml`;
  return new Promise((resolve, reject) => {
    fs.readFile(MOD_DESC_PATH, 'utf8', (err, data) => {
      if (err) {
        return resolve();
      }
      parseXML(data, (err, result) => {
        try {
          if (err) {
            resolve();
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
          resolve();
        }
      });
    });
  });
};

export const parseDDSImageData = mod => {
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
        isZip: false
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
        isZip: false
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
        isZip: false
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
