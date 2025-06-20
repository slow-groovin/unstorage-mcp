# Unstorage MCP server

基于 [unstorage](https://github.com/unjs/unstorage) 的 Key-Value Storage MCP server.

支持的 Transports:
- [x] stdio
- [x] Streamable HTTP
- [x] SSE


支持的 unstorage 驱动：
1. memory
2. filesystem
3. redis
4. unstorage http server
5. mongodb

Current tools:
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

- [Unstorage MCP server](#unstorage-mcp-server)
  - [通过 stdio 方式安装运行](#通过-stdio-方式安装运行)
    - [最少配置](#最少配置)
    - [包含全部配置](#包含全部配置)
    - [_for Cline+Windows:_](#for-clinewindows)
  - [通过 HTTP 方式安装运行](#通过-http-方式安装运行)
  - [related arguments](#related-arguments)
  - [使用示例 **提示词**](#使用示例-提示词)
  - [参数 (args)](#参数-args)
  - [环境变量 (env)](#环境变量-env)
    - [redis](#redis)
    - [mongodb](#mongodb)
    - [filesystem](#filesystem)
    - [http server](#http-server)
    - [memory](#memory)
  - [扩展指南](#扩展指南)
    - [用于 cursor/cline 辅助编程的提示词](#用于-cursorcline-辅助编程的提示词)
  - [开发调试方法](#开发调试方法)
    - [mcp-inspector](#mcp-inspector)
    - [用于本地开发的 tsx mcpServer 配置](#用于本地开发的-tsx-mcpserver-配置)

## 通过 stdio 方式安装运行

### 最少配置

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

### 包含全部配置

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

如果您在 Windows 安装过程中遇到问题，可以参考这篇[文章](https://www.api2o.com/zh/blog/windows-client-install-mcp-tutorial)

## 通过 HTTP 方式安装运行

```sh
npx @slow-groovin/unstorage-mcp --http
```
## related arguments

| arg        |                                        | default   |
| ---------- | -------------------------------------- | --------- |
| --http     | enable http transport instead of stdio | `false`   |
| -p, --port | listening port                         | 3000      |
| -h, --host | listening host                         | localhost |



## 使用示例 **提示词**

```text
过程产生了一个key-value结果: "fs_base:recommend_site"="www.api2o.com", 请将其存储.
```

## 参数 (args)

**`--disable-modify`**

_默认值: false_

禁用具有修改功能的 tools，例如 setItem, setItems ...

## 环境变量 (env)

> 关于 base 和 mountpoint 的概念，请参考 [unstorage 文档](https://unstorage.unjs.io/guide)

> 在终端中或`.env`文件中设置环境变量


### redis

_如果设置了 **`REDIS_URL`**，将会挂载一个 redis 存储_

| 语法                    | 描述                                                          | 默认值 | 可选 |
| ----------------------- | ------------------------------------------------------------- | ------ | ---- |
| **`REDIS_URL`**         | redis 连接 url，例如：`redis://default:123456@localhost:6379` |        |      |
| **`REDIS_BASE`**        | redisDriver 的 base                                           |        | ✅    |
| **`REDIS_MOUNT_POINT`** | 挂载点                                                        | "/"    | ✅    |

### mongodb

_如果设置了 **`MONGODB_URL`**，将会挂载一个 mongodb 存储_

| 语法                          | 描述                                                    | 默认值 | 可选 |
| ----------------------------- | ------------------------------------------------------- | ------ | ---- |
| **`MONGODB_URL`**             | mongodb 连接 url，例如：`mongodb://user:pass@host:port` |        |      |
| **`MONGODB_DB_NAME`**         | mongodb 数据库名称，例如：`test`                        |        |      |
| **`MONGODB_COLLECTION_NAME`** | mongodb 集合名称，例如：`mycollection`                  |        |      |
| **`MONGODB_MOUNT_POINT`**     | 挂载点                                                  | "/"    | ✅    |

### filesystem

_如果设置了 **`FS_BASE`**，将会挂载一个文件系统存储_

| 语法                 | 描述                             | 默认值 | 可选 |
| -------------------- | -------------------------------- | ------ | ---- |
| **`FS_BASE`**        | fsDriver 的 base，文件系统的路径 |        |      |
| **`FS_MOUNT_POINT`** | 挂载点                           | "/"    | ✅    |

### http server

_如果设置了 **`HTTP_BASE`**，将会挂载一个 http 存储_

| 语法                   | 描述                                                        | 默认值 | 可选 |
| ---------------------- | ----------------------------------------------------------- | ------ | ---- |
| **`HTTP_BASE`**        | httpDriver 的 base，http 服务器的端点                       |        |      |
| **`HTTP_MOUNT_POINT`** | 挂载点                                                      | "/"    | ✅    |
| **`HTTP_HEADERS`**     | http 请求的 headers，例如：`Authorization=Bear 123;A=1;B=2` |        | ✅    |

### memory

如果在根目录("/")没有挂载任何 driver，将自动在根目录("/")上挂载一个 memory driver（与 unstorage 的行为相同）。

## 扩展指南

1. 克隆此仓库
2. 将 src/storage/redis.ts 复制到一个新文件，并将其修改为您想要的 Driver（`unjs/unstorage` 非常容易学习）
3. 测试并验证其有效性
4. （可选）提交一个合并请求 (pull request)

如果您不是 TypeScript 开发人员，请提交一个 issue 来请求作者支持其他的 Driver。

### 用于 cursor/cline 辅助编程的提示词

```text
@/src/storage/mongodb.ts, 需要你为我实现这个代码
1. 你首先通过对storage type对应的Doc url进行fetch获取信息(https://unstorage.unjs.io/drivers/<storage type>)
2. 然后你可以参考示例 @/src/adapter/redis.ts 和 @/src/storage/http.ts
3. 你仅负责生成代码而不需要测试
```

## 开发调试方法

### mcp-inspector

```sh
 mcp-inspector -e HTTP_BASE=http://localhost:3001 -e HTTP_MOUNT_POINT=http_storage -e FS_BASE=D:/temp -e FS_MOUNT_POINT=fs_storage -e HTTP_HEADERS="Authorization=Bear 123;" tsx ./src/index.ts
```

### 用于本地开发的 tsx mcpServer 配置

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

注意需要重新启动这个 MCP server 才能使更改生效。
