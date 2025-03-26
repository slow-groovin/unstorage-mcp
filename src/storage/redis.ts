import { createStorage } from "unstorage";
import redisDriver from "unstorage/drivers/redis";
import { MountFunction } from "./types.js";

/**
 * redis connect url, eg: `redis://default:123456@localhost:6379`
 */
const REDIS_URL = process.env.REDIS_URL;

/**
 * base of redisDriver(optional)
 * [Reference](https://unstorage.unjs.io/drivers/redis)
 */
const REDIS_BASE = process.env.REDIS_BASE;

/**
 * mountpoint of this storage(default: '/')
 * [Reference](https://unstorage.unjs.io/guide#mountmountpoint-driver)
 */
const REDIS_MOUNT_POINT = process.env.REDIS_MOUNT_POINT ?? "/";

export const mountFunc: MountFunction = (baseStorage) => {
  /*
    if there is no relational environment variable, will not mount
  */
  if (!REDIS_URL) {
    return;
  }

  const storage = createStorage({
    //@ts-ignore
    driver: redisDriver({
      url: REDIS_URL,
      base: REDIS_BASE,
      lazyConnect: true,
    }),
  });
  const mountPoint = REDIS_MOUNT_POINT ?? "/";
  baseStorage.mount(mountPoint, storage);
};
export default mountFunc;
