import { createStorage } from "unstorage";
import mongodbDriver from "unstorage/drivers/mongodb";
import { MountFunction } from "./types.js";

/**
 * mongodb url, eg: `mongodb://user:password@localhost:27017`
 * [Reference](https://unstorage.unjs.io/drivers/mongodb)
 */
const MONGODB_URL = process.env.MONGODB_URL;

/**
 * mongodb database name, eg: `test`
 * [Reference](https://unstorage.unjs.io/drivers/mongodb)
 */
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

/**
 * mongodb collection name, eg: `mycollection`
 * [Reference](https://unstorage.unjs.io/drivers/mongodb)
 */
const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME;

/**
 * mountpoint of this storage(default: '/')
 * [Reference](https://unstorage.unjs.io/guide#mountmountpoint-driver)
 */
const MONGODB_MOUNT_POINT = process.env.MONGODB_MOUNT_POINT ?? "/";

export const mountFunc: MountFunction = (baseStorage) => {
  /*
    if there is no relational environment variable, will not mount
  */
  if (!MONGODB_URL) {
    return;
  }
  if (!MONGODB_DB_NAME || !MONGODB_COLLECTION_NAME) {
    throw new Error("MONGODB_DB_NAME or MONGODB_COLLECTION_NAME not set.");
  }

  const storage = createStorage({
    //@ts-ignore
    driver: mongodbDriver({
      connectionString: MONGODB_URL,
      databaseName: MONGODB_DB_NAME,
      collectionName: MONGODB_COLLECTION_NAME,
    }),
  });
  const mountPoint = MONGODB_MOUNT_POINT ?? "/";
  baseStorage.mount(mountPoint, storage);
};

export default mountFunc;
