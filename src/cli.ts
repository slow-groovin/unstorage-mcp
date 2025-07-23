// TypeScript (.ts)
import { Command } from "commander";

const program = new Command();

program.option(
  "--disable-modify",
  "Disable tools with modify functionality like setItem, setItems ...",
  false
);

program.option(
  "--http",
  "using http transport (sse + streamable both) instead of stdio, stdio transport will be disabled ",
  false,
)

program.option(
  "-h, --host <VALUE>",
  "host of http transport",
  "localhost"
)

program.option(
  "-p, --port <VALUE>",
  "port of http transport",
  "3000"
)

program.version("0.2.1");
program.parse();

const options = program.opts();

export const args = {
  disableModify: options["disableModify"] as boolean,
  http: options["http"] as boolean,
  host: options['host'] as string,
  port: Number(options['port']),
  version: program.version() as string,
};
