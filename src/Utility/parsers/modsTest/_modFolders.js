import StoreItem from '../../../components/Mods/listItems/StoreItem';

const fs = window.require('fs');
const path = window.require('path');
const parseXML = require('xml2js').parseString;
const { parseStoreItems } = require('./_storeItems');

const MOD_TYPE = {
  MAP: 'map',
  STORE_ITEM: 'storeItem',
  GAMEPLAY: 'gameplay',
  OTHER: 'other'
};

export const parseModFolders = async modPaths => {
  return new Promise(async (resolve, reject) => {
    const mods = [];
    for (const mod of modPaths) {
      try {
        const { isZip, modDirPath } = mod;
        if (!isZip) {
          const modDescJSON = await modDescXMLToJSON(modDirPath);
          // const modDescWithNestedObjects = await parseNestedMods(modDescJSON);
          // // Add type(MAP, STOREITEM, GAMEPLAY, OTHER) to object.
          // const modDescWithType = addModType(modDescJSON);
          // console.log('ModDesc w/ type: ', modDescWithType);
          // const modDesc = await parseModDesc(modDescWithType);
        }
      } catch (err) {
        reject(err);
      }
    }
  });
};

const addModType = ({ modDesc }) => {
  const { STORE_ITEM, MAP, GAMEPLAY, OTHER } = MOD_TYPE;
  if (modDesc.hasOwnProperty('storeItems') && modDesc.hasOwnProperty('maps')) {
    return {
      ...modDesc,
      modType: MAP
    };
  }

  if (modDesc.hasOwnProperty('storeItems') && !modDesc.hasOwnProperty('maps')) {
    return {
      ...modDesc,
      modType: STORE_ITEM
    };
  }

  if (!modDesc.hasOwnProperty('storeItems')) {
    return {
      ...modDesc,
      modType: GAMEPLAY
    };
  }

  return {
    ...modDesc,
    modType: OTHER
  };
};

const parseModDesc = async modDesc => {
  const { modType } = modDesc;
  const { STORE_ITEM, MAP, GAMEPLAY, OTHER } = MOD_TYPE;
  switch (modType) {
    case STORE_ITEM:
      console.log('STORE ITEM');
      break;
    default:
      break;
  }
};

const getModDesc = async modDirPath => {
  const modDescJSON = await modDescXMLToJSON();
  const 
  if (!modDescJSON.hasOwnProperty('modDesc')) {
    return;
  }

  try {
    const { modDesc } = modDescJSON;
    const { storeItems } = modDesc;
    const { storeItem } = storeItems
    if (!Array.isArray(storeItem)) {

    }
  } catch (err) {
    return;
  }
};

const modDescXMLToJSON = modDirPath => {
  return new Promise((resolve, reject) => {
    const modDescFile = 'modDesc.xml';
    const modDescPath = path.join(modDirPath, modDescFile);
    fs.readFile(modDescPath, 'utf8', (err, data) => {
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
          console.log('mod desc: ', result);

          resolve(result);
        }
      );
    });
  });
};
