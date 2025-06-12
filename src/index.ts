#!/usr/bin/env node
import 'dotenv/config'
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { server } from "./mcp/server.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { serve, type HttpBindings } from '@hono/node-server'
import { RESPONSE_ALREADY_SENT } from "@hono/node-server/utils/response";
import { args } from "./cli.js";


/**
 * start with stdio
 */
export async function startStdio() {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

/**
 * start with HTTP (SSE+Streamable)
 */
export async function startHTTP(host: string, port: number) {
  type Bindings = HttpBindings

  // ... set up server resources, tools, and prompts ...
  const app = new Hono<{ Bindings: Bindings }>()

  // Store transports for each session type
  const transports = {
    streamable: {} as Record<string, StreamableHTTPServerTransport>,
    sse: {} as Record<string, SSEServerTransport>
  };

  // Handle POST requests for client-to-server communication
  app.post('/mcp', async (c) => {
    // Check for existing session ID
    const sessionId = c.req.header('mcp-session-id') as string;
    const body = await c.req.json()
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.streamable[sessionId]) {
      // Reuse existing transport
      transport = transports.streamable[sessionId];
    } else if (!sessionId && isInitializeRequest(body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID
          transports.streamable[sessionId] = transport;
        }
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports.streamable[transport.sessionId];
        }
      };
      // Connect to the MCP server
      await server.connect(transport);
    } else {
      // Invalid request
      c.json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      }, 400);
      return;
    }

    // Handle the request
    await transport.handleRequest(c.env.incoming, c.env.outgoing, body);
    return RESPONSE_ALREADY_SENT
  });


  // Modern Streamable HTTP endpoint
  app.on(['get', 'delete'], '/mcp', async (c) => {
    const sessionId = c.req.header('mcp-session-id') as string | undefined;
    if (!sessionId || !transports.streamable[sessionId]) {
      c.text('Invalid or missing session ID', 400);
      return;
    }
    const transport = transports.streamable[sessionId];
    await transport.handleRequest(c.env.incoming, c.env.outgoing);
    return RESPONSE_ALREADY_SENT

  });

  // Legacy SSE endpoint for older clients
  app.get('/sse', async (ctx) => {
    // Create SSE transport for legacy clients
    const transport = new SSEServerTransport('/messages', ctx.env.outgoing);
    transports.sse[transport.sessionId] = transport;
    ctx.env.outgoing.on("close", () => {
      delete transports.sse[transport.sessionId];
    });

    await server.connect(transport);
    return RESPONSE_ALREADY_SENT
  });

  // Legacy message endpoint for older clients
  app.post('/messages', async (ctx) => {
    const sessionId = ctx.req.query('sessionId') as string;
    const transport = transports.sse[sessionId];

    if (transport) {
      await transport.handlePostMessage(ctx.env.incoming, ctx.env.outgoing, await ctx.req.json());
      return RESPONSE_ALREADY_SENT
    } else {
      return ctx.text('No transport found for sessionId', 400);
    }
  });

  serve({ fetch: app.fetch, port: port, hostname: host })
  console.log("unstorage-mcp %s \nHttp Server started at http://%s:%d", args.version, host, port);
}


if (args.http) {
  startHTTP(args.host, args.port)
} else {
  startStdio()
}