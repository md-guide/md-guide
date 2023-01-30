import fs from 'fs-extra';
import path from "path";
import { spawn } from 'child_process';
import temp from 'temp';
import { cwd } from "./cells";

export const runners: Record<string, any> = {
  shell: (code: string) => {
    console.log(`Running: \n ${code}`);
    const tmpfile = temp.openSync();
    fs.writeSync(tmpfile.fd, code);
    return spawn('bash', [tmpfile.path], {
      cwd: path.join(cwd, 'files'),
    });
  },
  node: (code: string) => {
  }
};
