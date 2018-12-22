const os = window.require('os');
const platform = require('electron-platform');

const PLATFORM = {
  MAC_OS: 'darwin',
  WINDOWS: 'win32'
};

const getPlatformPaths = () => {
  const isWindows = platform.isWin32;
  return getMacOSPaths();
};

const getMacOSPaths = ()  => {
  const homeDir = os.homedir();
  console.log('HOME DIR:', homeDir);
  const gameDirectory = `${homeDir}/Library/Application Support/FarmingSimulator2019/`;
  const modsDirectory = `${homeDir}/Library/Application Support/FarmingSimulator2019/mods`;
  const dataDirectory = `${homeDir}/Library/Application Support/Steam/steamapps/common/Farming Simulator 19/Farming Simulator 2019.app/Contents/Resources/data`;
  return {
    gameDirectory,
    modsDirectory,
    dataDirectory
  };
};

const getPlatformInformation = () => {
  const platformPaths = getPlatformPaths();
  console.log(platformPaths);
  return platformPaths;
};

module.exports = { getPlatformInformation };
