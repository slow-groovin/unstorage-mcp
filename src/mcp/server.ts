import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { baseStorage as storage } from "../storage/index.js";
import { args } from "../cli.js";

export const server = new McpServer(
  {
    name: "unstorage-mcp",
    version: "0.0.3",
  },
  {
    capabilities: {
      logging: {},
    },
  }
);

server.tool(
  "showMounts",
  "Get an overview of all mount points. ( by storage.getMounts() )",
  async () => {
    const results = await storage.getMounts();
    const formatedResults = results.map((m) => ({
      base: m.base,
      driverName: m.driver.name,
    }));

    return {
      content: [
        { type: "text", text: JSON.stringify(formatedResults, null, 2) },
      ],
    };
  }
);

server.tool(
  "hasItem",
  "Checks if storage contains a key.",
  { key: z.string().min(1).describe("Key in KV store") },
  async ({ key }) => {
    let value = false;
    try {
      value = await storage.hasItem(key);
    } catch (e) {
      server.server.sendLoggingMessage({
        level: "error",
        data: e,
      });
    }
    return { content: [{ type: "text", text: String(value) }] };
  }
);

server.tool(
  "getItem",
  "Gets the value of a key in storage",
  { key: z.string().min(1).describe("Key in KV store") },
  async ({ key }) => {
    let value = "null";
    try {
      value = (await storage.getItem(key))?.toString() ?? "null";
    } catch (e) {
      server.server.sendLoggingMessage({
        level: "error",
        data: e,
      });
    }
    return { content: [{ type: "text", text: "13:" + value }] };
  }
);

server.tool(
  "getItems",
  "Gets the value of multiple keys in storage in parallel",
  {
    items: z.array(z.string()).describe("Array of keys to get"),
  },
  async ({ items }) => {
    let values: { key: string; value: any }[] = [];
    try {
      values = await storage.getItems(items);
    } catch (e) {
      server.server.sendLoggingMessage({
        level: "error",
        data: e,
      });
    }
    return { content: [{ type: "text", text: JSON.stringify(values) }] };
  }
);

server.tool(
  "getItemRaw",
  "Gets the value of a key in storage in raw format",
  {
    key: z.string().min(1).describe("Key in KV store"),
  },
  async ({ key }) => {
    let value = "null";
    try {
      value = (await storage.getItemRaw(key))?.toString() ?? "null";
    } catch (e) {
      server.server.sendLoggingMessage({
        level: "error",
        data: e,
      });
    }
    return { content: [{ type: "text", text: value }] };
  }
);

server.tool(
  "getMeta",
  "Get metadata object for a specific key",
  {
    key: z.string().min(1).describe("Key in KV store"),
    nativeOnly: z
      .boolean()
      .optional()
      .describe("Whether to only get native meta"),
  },
  async ({ key, nativeOnly }) => {
    let meta = "null";
    try {
      meta = String(await storage.getMeta(key, { nativeOnly }));
    } catch (e) {
      server.server.sendLoggingMessage({
        level: "error",
        data: e,
      });
    }
    return { content: [{ type: "text", text: meta }] };
  }
);

server.tool(
  "getKeys",
  "Get all keys. Returns an array of strings.If a base is provided, only keys starting with the base will be returned and only mounts starting with base will be queried",
  {
    base: z.string().optional().describe("start of query path "),
    maxDepth: z.number().optional().describe("maxDepth of query"),
  },
  async ({ base, maxDepth }) => {
    const keys = await storage.getKeys(base, { maxDepth });
    return { content: [{ type: "text", text: JSON.stringify(keys) }] };
  }
);

/**
 * if not setting disableModify
 */
if (!args.disableModify) {
  server.tool(
    "setItem",
    "Add/Update a value to the storage",
    {
      key: z.string().min(1).describe("Key in KV store"),
      value: z.string().describe("Value in KV store"),
    },
    async ({ key, value }) => {
      try {
        await storage.setItem(key, value);
      } catch (e) {
        server.server.sendLoggingMessage({
          level: "error",
          data: e,
        });
      }
      return { content: [{ type: "text", text: "success" }] };
    }
  );

  server.tool(
    "setItems",
    "Add/Update items in parallel to the storage",
    {
      items: z
        .array(z.object({ key: z.string(), value: z.any(), options: z.any() }))
        .describe("Array of items to set"),
    },
    async ({ items }) => {
      try {
        // @ts-ignore
        await storage.setItems(items);
      } catch (e) {
        server.server.sendLoggingMessage({
          level: "error",
          data: e,
        });
      }
      return { content: [{ type: "text", text: "success" }] };
    }
  );

  server.tool(
    "setItemRaw",
    "Add/Update a value to the storage in raw format",
    {
      key: z.string().min(1).describe("Key in KV store"),
      value: z.any().describe("Value in KV store"),
    },
    async ({ key, value }) => {
      try {
        // @ts-ignore
        await storage.setItemRaw(key, value);
      } catch (e) {
        server.server.sendLoggingMessage({
          level: "error",
          data: e,
        });
      }
      return { content: [{ type: "text", text: "success" }] };
    }
  );

  server.tool(
    "removeItem",
    "Remove a value (and it's meta) from storage",
    {
      key: z.string().min(1).describe("Key in KV store"),
      removeMeta: z.boolean().optional().describe("Whether to remove meta"),
    },
    async ({ key, removeMeta }) => {
      try {
        await storage.removeItem(key, { removeMeta });
      } catch (e) {
        server.server.sendLoggingMessage({
          level: "error",
          data: e,
        });
      }
      return { content: [{ type: "text", text: "success" }] };
    }
  );

  server.tool(
    "setMeta",
    "Set custom meta for a specific key",
    {
      key: z.string().min(1).describe("Key in KV store"),
      meta: z.any().describe("Meta data to set"),
    },
    async ({ key, meta }) => {
      try {
        await storage.setMeta(key, meta);
      } catch (e) {
        server.server.sendLoggingMessage({
          level: "error",
          data: e,
        });
      }
      return { content: [{ type: "text", text: "success" }] };
    }
  );

  server.tool(
    "removeMeta",
    "Remove meta for a specific key",
    {
      key: z.string().min(1).describe("Key in KV store"),
    },
    async ({ key }) => {
      try {
        await storage.removeMeta(key);
      } catch (e) {
        server.server.sendLoggingMessage({
          level: "error",
          data: e,
        });
      }
      return { content: [{ type: "text", text: "success" }] };
    }
  );
}
