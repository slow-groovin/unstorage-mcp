import { createStorage } from "unstorage";
import redis from "./redis.js";
import filesystem from "./filesystem.js";
import http from "./http.js";
import mongodb from "./mongodb.js";
export const baseStorage = createStorage();

[redis, filesystem, http, mongodb].forEach((mountFunc) =>
  mountFunc(baseStorage)
);
// console.log("baseStorage.getMounts()", baseStorage.getMounts());
