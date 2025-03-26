// TypeScript (.ts)
import { Command } from "commander";

const program = new Command();

program.option(
  "--disable-modify",
  "Disable tools with modify functionality like setItem, setItems ...",
  false
);

program.version("0.0.3");
program.parse();

const options = program.opts();

export const args = {
  disableModify: options["disableModify"] as boolean,
};
