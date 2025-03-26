import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { MountFunction } from "./types.js";

/**
 * base of fsDriver, path of filesystem, eg: `/home/user/.tmp`, `D:/.temp`
 * [Reference](https://unstorage.unjs.io/drivers/fs)
 */
const FS_BASE = process.env.FS_BASE;

/**
 * mountpoint of this storage(default: '/')
 * [Reference](https://unstorage.unjs.io/guide#mountmountpoint-driver)
 */
const FS_MOUNT_POINT = process.env.FS_MOUNT_POINT ?? "/";

export const mountFunc: MountFunction = (baseStorage) => {
  /*
    if there is no relational environment variable, will not mount
  */
  if (!FS_BASE) {
    return;
  }

  const storage = createStorage({
    //@ts-ignore
    driver: fsDriver({
      base: FS_BASE,
    }),
  });
  const mountPoint = FS_MOUNT_POINT ?? "/";
  baseStorage.mount(mountPoint, storage);
};
export default mountFunc;
