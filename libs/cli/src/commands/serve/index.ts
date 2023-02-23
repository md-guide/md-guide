import { Command } from "commander";
import { serve } from "@md-guide/local-api";
import path from "path";
import chalk from "chalk";

interface Options {
  port: string;
}
// not used for now
const isProduction = process.env.NODE_ENV === "production";

const log = console.log;

const serveAction = async (filename = "GUIDE.md", { port }: Options) => {
  const dir = path.join(process.cwd(), path.dirname(filename));
  try {
    await serve(parseFloat(port), path.basename(filename), dir, true);
    log(
      `Guide live at ${chalk.inverse(
        `http://localhost:${port}`
      )} \n opened file ${chalk.underline(
        `${path.basename(filename)}`
      )}`
    );
  } catch (error: any) {
    if (error.code === "EADDRINUSE") {
      log(
        chalk.red(
          `${port} already in use, try using a different port via the --port option`
        )
      );
    } else {
      log(chalk.red(error));
    }
    process.exit(1);
  }
};

export const serveCommand = new Command()
  .command("serve [filename]")
  .option("-p, --port <number>", "port to run server on", "3001")
  .description("open a file for editing")
  .action(serveAction);
