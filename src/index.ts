import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./mcp/server.js";
import { args } from "./cli.js";

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();

export async function start() {
  await server.connect(transport);
}

start();
