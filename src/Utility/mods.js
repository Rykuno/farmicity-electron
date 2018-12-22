const settings = window.require('electron-settings');
var parseXML = require('xml2js').parseString;
const fs = window.require('fs');

export const getMods = async () => {
  const modDirList = await getModDirList();
  const { zipDirList, dirList } = await fetchListOfMods(modDirList);
  console.log('Zip Dirs: ', zipDirList);
  console.log('Dirs: ', dirList);
  const directoryList = await getDirectoryListOfMods(dirList);
  console.log("Dir List: ", directoryList);
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

const getDirectoryListOfMods = async dirList => {
  return new Promise((resolve, reject) => {
    const promiseList = [];
    for (const dir of dirList) {
      promiseList.push(parseModDescXML(dir));
    }

    Promise.all(promiseList).then(results => {
      resolve(results);
    }).catch(e => {
      reject(e);
    })
  });
};

const parseModDescXML = async path => {
  const MOD_DESC_PATH = `${path}/modDesc.xml`;
  return new Promise((resolve, reject) => {
    fs.readFile(MOD_DESC_PATH, 'utf8', (err, data) => {
      parseXML(data, (err, result) => {
        const items = result.modDesc.storeItems[0].storeItem;
        for (const item of items) {
          const xmlFile = item.$.xmlFilename;
          const modSpecificXMLPath = `${path}/${xmlFile}`;
          console.log(modSpecificXMLPath);
          resolve(modSpecificXMLPath);
        }
      });
    });
  });
};

const parseModSpecificXML = path => {
  return new Promise((resolve, reject) => {});
};

const parseZipFiles = path => {};

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
