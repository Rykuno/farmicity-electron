import { getModDirectoryPaths } from './_modPaths';
import { parseModFolders } from './_modFolders';

export const getMods = async () => {
  try {
    const modDirectoryPaths = await getModDirectoryPaths();
    console.log('Mod Directory Paths: ', modDirectoryPaths);
    const modDescData = await parseModFolders(modDirectoryPaths);
  } catch (err) {
    return new Error(err);
  }
};
