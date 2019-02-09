export const parseStoreItems = async storeItems => {
  try {
    const { storeItem } = storeItems;
    if (Array.isArray(storeItem)) {
      console.log("++");
    }else{
      console.log("--");
    }
  } catch (err) {
    // console.log(err);
  }
};
