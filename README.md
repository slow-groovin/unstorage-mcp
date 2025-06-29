# Unstorage MCP Server

[中文 README](/README_ZH.md)

A Key-Value storage MCP server based on [unjs/unstorage](https://github.com/unjs/unstorage).

Support drivers:
1. memory
2. filesystem
3. redis
4. unstorage http server
5. mongodb


Support transports:
- [x] stdio
- [x] Streamable HTTP
- [x] SSE

Tools:
- **`showMounts()`**
- **`getItem(key)`**
- **`getItems(items)`**
- **`getItemRaw(key)`**
- **`getMeta(key, nativeOnly)`**
- **`getKeys(base, maxDepth)`**
- **`setItem(key, value)`**
- **`setItems(items)`**
- **`setItemRaw(key, value)`**
- **`setMeta(key, meta)`**
- **`removeItem(key, removeMeta)`**
- **`removeMeta(key)`**

<br><br>

- [Unstorage MCP Server](#unstorage-mcp-server)
  - [Running with stdio](#running-with-stdio)
    - [minimal configuration](#minimal-configuration)
    - [maximum configuration](#maximum-configuration)
    - [_for Cline+Windows:_](#for-clinewindows)
  - [Running with HTTP (SSE + Streamable)](#running-with-http-sse--streamable)
  - [related arguments](#related-arguments)
  - [Example **prompt** for use](#example-prompt-for-use)
  - [args](#args)
  - [environment variables](#environment-variables)
    - [redis](#redis)
    - [mongodb](#mongodb)
    - [filesystem](#filesystem)
    - [http server](#http-server)
    - [memory](#memory)
  - [extend guide](#extend-guide)
    - [prompts for cursor/cline assisted programming](#prompts-for-cursorcline-assisted-programming)
  - [debug approaches](#debug-approaches)
    - [mcp-inspector](#mcp-inspector)
    - [tsx mcpServer Config for local dev](#tsx-mcpserver-config-for-local-dev)

## Running with stdio

### minimal configuration

```json
{
  "mcpServers": {
    "unstorage": {
      "command": "npx",
      "args": ["-y", "@slow-groovin/unstorage-mcp"]
    }
  }
}
```

### maximum configuration

```json
{
  "mcpServers": {
    "unstorage": {
      "command": "npx",
      "env": {
        "REDIS_URL": "redis://default:123456@localhost:6379",
        "REDIS_BASE": "visits:date:api:",
        "REDIS_MOUNT_POINT": "redis_storage",
        "FS_BASE": "D:/tmp",
        "FS_MOUNT_POINT": "fs_storage",
        "HTTP_BASE": "http://localhost:3001",
        "HTTP_MOUNT_POINT": "http_storage",
        "HTTP_HEADERS": "Authorization=Bear 123;A=3;B=4;C=5",
        "MONGODB_URL": "mongodb://root:123456@localhost:27017/",
        "MONGODB_DB_NAME": "test",
        "MONGODB_COLLECTION_NAME": "unstorage",
        "MONGODB_MOUNT_POINT": "mongo_storage"
      },
      "args": ["-y", "@slow-groovin/unstorage-mcp", "--disable-modify"]
    }
  }
}
```

### _for Cline+Windows:_

```json
{
  "mcpServers": {
    "unstorage": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@slow-groovin/unstorage-mcp"]
    }
  }
}
```

If you have problem of installation on Windows, you can refrer to this [article](https://www.api2o.com/en/blog/windows-client-install-mcp-tutorial)

## Running with HTTP (SSE + Streamable)

```sh
npx @slow-groovin/unstorage-mcp --http
```
## related arguments

| arg        |                                        | default   |
| ---------- | -------------------------------------- | --------- |
| --http     | enable http transport instead of stdio | `false`   |
| -p, --port | listening port                         | 3000      |
| -h, --host | listening host                         | localhost |


## Example **prompt** for use

```text
The process has produced a key-value result: "fs_base:recommend_site"="www.api2o.com", store it.
```

## args

**`--disable-modify`**

_Default: false_

Disable tools with modify functionality like setItem, setItems ...

## environment variables

> for the concept of base and mountpoint, please refer to the [doc of unstorage](https://unstorage.unjs.io/guide)


> Set environment variables in the terminal or in the `.env` file

### redis

_if **`REDIS_URL`** is set, a redis storage will be mounted_

| Syntax                  | Description                                                    | Default Value | Optional |
| ----------------------- | -------------------------------------------------------------- | ------------- | -------- |
| **`REDIS_URL`**         | redis connect url, eg: `redis://default:123456@localhost:6379` |               |          |
| **`REDIS_BASE`**        | base of redisDriver                                            |               | ✅        |
| **`REDIS_MOUNT_POINT`** | mountpoint of this storage                                     | "/"           | ✅        |

### mongodb

_if **`MONGODB_URL`** is set, a mongodb storage will be mounted_

| Syntax                        | Description                                              | Default Value | Optional |
| ----------------------------- | -------------------------------------------------------- | ------------- | -------- |
| **`MONGODB_URL`**             | mongodb connect url, eg: `mongodb://user:pass@host:port` |               |          |
| **`MONGODB_DB_NAME`**         | mongodb database name, eg: `test`                        |               |          |
| **`MONGODB_COLLECTION_NAME`** | mongodb collection name, eg: `mycollection`              |               |          |
| **`MONGODB_MOUNT_POINT`**     | mountpoint of this storage                               | "/"           | ✅        |

### filesystem

_if **`FS_BASE`** is set, a redis storage will be mounted_

| Syntax               | Description                          | Default Value | Optional |
| -------------------- | ------------------------------------ | ------------- | -------- |
| **`FS_BASE`**        | base of fsDriver, path of filesystem |               |          |
| **`FS_MOUNT_POINT`** | mountpoint of this storage           | "/"           | ✅        |

### http server

_if **`HTTP_BASE`** is set, a http storage will be mounted_

| Syntax                 | Description                                                     | Default Value | Optional |
| ---------------------- | --------------------------------------------------------------- | ------------- | -------- |
| **`HTTP_BASE`**        | base of httpDriver, endpoint of http server                     |               |          |
| **`HTTP_MOUNT_POINT`** | mountpoint of this storage                                      | "/"           | ✅        |
| **`HTTP_HEADERS`**     | headers for http requests, eg: `Authorization=Bear 123;A=1;B=2` |               | ✅        |

### memory

If there is no mount on root("/"), a memory driver will be mounted automatically on "/" (same behaviour of unstorage).

## extend guide

1. clone this repo
2. copy src/storage/redis.ts to a new file and modify it to your desired driver(`unjs/unstorage` is super easy to learn)
3. test and verify that it is effective
4. (optional) pull a merge request

If you are not a typescript developer, please submit a issue to ask for other drivers support.

### prompts for cursor/cline assisted programming

```text
@/src/storage/mongodb.ts , please implement this file:
1. you need to fetch information using the storage type's corresponding Doc URL (https://unstorage.unjs.io/drivers/<storage type>).
2. you can refer to examples in @/src/adapter/redis.ts and @/src/storage/http.ts.
3. You are only responsible for generating the code and do not need to perform testing.
```

> If you have not installed fetch MCP server, delete the first sentence

## debug approaches

### mcp-inspector

```sh
 mcp-inspector -e HTTP_BASE=http://localhost:3001 -e HTTP_MOUNT_POINT=http_storage -e FS_BASE=D:/temp -e FS_MOUNT_POINT=fs_storage -e HTTP_HEADERS="Authorization=Bear 123;" tsx ./src/index.ts
```

### tsx mcpServer Config for local dev

```json
{
  "mcpServers": {
    "command": "cmd",
    "env": {
      "REDIS_URL": "redis://default:123456@localhost:6379",
      "REDIS_BASE": "my:mcp:values:",
      "REDIS_MOUNT_POINT": "redis_storage"
    },
    "args": ["/c", "tsx", "D:/xxx/projects/unstorage-mcp/src/index.ts"]
  }
}
```

restarting server is needed to make changes take effect
