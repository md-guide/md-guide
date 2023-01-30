import chokidar from 'chokidar'
import path from 'path';
import fs from 'fs-extra'
import mdParse, { CodeBlock } from '../md-ast'
// @ts-ignore
import hash from 'string-hash'
import { execSync } from 'child_process';
import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import debounce from 'debounce';
const cwd = process.cwd()
const options: Partial<SimpleGitOptions> = {
  baseDir: cwd,
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};

// when setting all options in a single object
const git: SimpleGit = simpleGit(options);
const recordDiff = debounce(async function recordDiff() {
  const diff = await git.diff()
  console.log(diff)
  return diff
}, 200)
function start() {
  const guidePath = path.join(cwd, 'GUIDE.md')
  const guideWatcher = chokidar.watch(guidePath)
  guideWatcher.on('change', (event) => {
    const guideMD = fs.readFileSync(guidePath, 'utf8')
    runGuide(guideMD)
  })
  const fsWatcher = chokidar.watch('**/*')
  fsWatcher.on('change', async (event) => {
    const diff = await recordDiff()
  })

}

interface ExtendedCodeBlock extends CodeBlock {
  result?: any;
  id: string;
  commit?: boolean;
  meta: {
    file: string;
    [key: string]: string | boolean;
  };
  metaString: string;

}
async function runGuide(guideMD: string) {
  const mdAST = mdParse(guideMD)
  const codeNodes = mdAST.filter(node => node.type === 'codeBlock') as ExtendedCodeBlock[]
  const blockIds = [] as string[]
  const codeBlocks = codeNodes.map((block, index) => {
    let id = `${hash(`${block.syntax} ${block.metaString} ${block.code}`)}`
    if(blockIds.includes(id)){
      id = `${id}-${index}`
    }
    blockIds.push(id)
    return {
      ...block,
      id
    }
  })

  console.log('Saving cache')
}
const runners: Record<ExtendedCodeBlock['syntax'], any> = {
  sh: (code: string) => {
    return execSync(code, {
      cwd
    }).toString()
  }
}
async function runBlock(block: ExtendedCodeBlock) {
  if(block.meta.file){
    if(block.syntax !== 'diff'){
      fs.outputFileSync(block.meta.file, block.code)
    }
  }
  if(block.meta.run){
    if(runners[block.syntax]){
      console.log(`Running ${block.syntax}: ${block.code}`)
      const runner = runners[block.syntax]
      block.result = await runner(block.code)
      console.log(`Result: ${block.result}`)
    }
  }

  return block
}

if (!process.argv[2]) {
  console.log('Watching GUIDE.md')
  start()
}
