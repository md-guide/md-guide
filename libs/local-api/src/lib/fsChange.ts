import chokidar from 'chokidar';
import path from "path";
import { SimpleGit } from 'simple-git';
import { addChangesToLastBlock } from './git';

export function handleFileSystemChange(cwd: string, git: SimpleGit) {
  const fsWatcher = chokidar.watch(path.join(cwd, 'files/**/*'), {
    ignored: ["node_modules", '.git']
  })
  fsWatcher.on('change', async () => {
    await addChangesToLastBlock(git)
  })

}