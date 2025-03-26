import { createStorage } from "unstorage";
import httpDriver from "unstorage/drivers/http";
import { MountFunction } from "./types.js";

/**
 * base of httpDriver, endpoint of http, eg: `http://localhost:3000`
 * [Reference](https://unstorage.unjs.io/drivers/http)
 */
const HTTP_BASE = process.env.HTTP_BASE;

/**
 * mountpoint of this storage(default: '/')
 * [Reference](https://unstorage.unjs.io/guide#mountmountpoint-driver)
 */
const HTTP_MOUNT_POINT = process.env.HTTP_MOUNT_POINT ?? "/";

/**
 * headers of httpDriver, endpoint of http, eg: `A=1;B=2;C=3`
 * [Reference](https://unstorage.unjs.io/drivers/http)
 */
const HTTP_HEADERS = process.env.HTTP_HEADERS ?? "";

const parsedHeaders = parseHeaders(HTTP_HEADERS);
export const mountFunc: MountFunction = (baseStorage) => {
  /*
    if there is no relational environment variable, will not mount
  */
  if (!HTTP_BASE) {
    return;
  }
  console.error(JSON.stringify(parsedHeaders));
  const storage = createStorage({
    //@ts-ignore
    driver: httpDriver({
      base: HTTP_BASE,
      headers: parsedHeaders,
    }),
  });
  const mountPoint = HTTP_MOUNT_POINT ?? "/";
  baseStorage.mount(mountPoint, storage);
};

function parseHeaders(headers: string): Record<string, string> {
  return headers.split(";").reduce((acc, header) => {
    const [key, value] = header.split("=");
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>);
}

export default mountFunc;
