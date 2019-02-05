import { getModDirectoryPaths } from './_modPaths';

export const getMods = async () => {
  try {
    const modDirectoryPaths = await getModDirectoryPaths();
    console.log('Mod Directory Paths: ', modDirectoryPaths);
  } catch (err) {
    return new Error(err);
  }
};
