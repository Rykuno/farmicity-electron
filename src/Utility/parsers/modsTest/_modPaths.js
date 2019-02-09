const settings = window.require('electron-settings');
const fs = window.require('fs');
const path = window.require('path');

export const getModDirectoryPaths = async () => {
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
  });
};

const createModDirList = (modDir, files) => {
  const modPaths = [];
  for (const file of files) {
    const modDirPath = path.join(modDir, file);
    const isZip = file.includes('.zip');
    const obj = {
      modDirectory: file,
      modDirPath,
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
