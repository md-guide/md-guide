import { spawn, IPty } from "node-pty";
import * as os from "os";
import {
  getDimensions,
  dimensions,
  initScreen,
  areDimensionEqual,
  resizeBestFit,
} from "./auxiliary";
import chalk from "chalk";

enum MessageType {
  IN = "i",
  OUT = "o",
  DIMENSIONS = "d",
}

export type TeletypeOptions = {
  userId: string;
  shell: string;
  multiplex: boolean;
  process: NodeJS.Process;
  onData: (data: string)=>void;
  onExit: ()=>void;
  
};

const SELF = "self";

export const teletypeApp = (options: TeletypeOptions) => {
  const username = os.userInfo().username;
  const hostname = os.hostname();
  const {onData, onExit} = options;
  const userDimensions: any = {};
  userDimensions[SELF] = getDimensions();

  let term: IPty;

  const reEvaluateOwnDimensions = () => {
    const lastKnown = userDimensions[SELF];
    const latest = getDimensions();

    if (areDimensionEqual(lastKnown, latest)) {
      return;
    }
    userDimensions[SELF] = latest;
    resizeBestFit(term, userDimensions);
  };

  return new Promise((resolve, reject) => {
      const onJoin = () => {
        initScreen(username, hostname, options.shell, options.multiplex);

        const stdin = options.process.stdin;
        const stdout = options.process.stdout;
        const dimensions = userDimensions[SELF];

        term = spawn(options.shell, [], {
          name: "xterm-256color",
          cols: dimensions.cols,
          rows: dimensions.rows,
          cwd: options.process.cwd(),
          // @ts-ignore
          env: options.process.env,
        });

        // track own dimensions and keep it up to date
        setInterval(reEvaluateOwnDimensions, 1000);

        term.onData((d: string) => {
          stdout.write(d);
          // revisit: is it worth having one letter names, instead of something descriptive
          // does it really save bytes?
          onData(d)
          // channel.push("new_msg", {
          //   t: MessageType.OUT,
          //   b: true,
          //   d: encrypt(d, options.roomKey),
          // });
        });
        term.onExit(() => {
          console.log(
            chalk.blueBright("terminated shell stream to oorja. byee!")
          );
          resolve(null);
        });

        stdin.setEncoding("utf8");
        stdin.setRawMode!(true);

        stdin.on("data", (d) => term.write(d.toString()));
      }
      const onClose= () => {
        console.log(chalk.redBright("connection closed, terminated stream."));
        process.exit(3);
      }
      const onError = (err?: any) => {
        console.log(chalk.redBright(err.message));
        process.exit(4);
      }
      const onMessage = ({ type, data }: any) => {
        switch (type) {
          case MessageType.DIMENSIONS:
            // userDimensions[session] = d;
            // resizeBestFit(term, userDimensions);
            break;
          case MessageType.IN:
            term.write(data);
        }
      }
      return {
        onClose,
        onError,
        onJoin,
        onMessage
      }
  });
};
