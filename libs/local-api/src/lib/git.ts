import debounce from 'debounce';
import fs from 'fs-extra'
import { SimpleGit } from 'simple-git';

export const addChangesToLastBlock = debounce(async function recordDiff(git: SimpleGit) {
  await git.add(['-A'])
  await git.commit(['--amend'])
}, 200)

// export const updateBlockContent = (hash, content, log) => {
  
// }