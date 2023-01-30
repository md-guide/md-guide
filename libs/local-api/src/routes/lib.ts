// import chokidar from 'chokidar'
// import path from 'path';
// import fs from 'fs-extra'
// // import mdParse, { CodeBlock } from '../mdAST'
// // @ts-ignore
// import hash from 'string-hash'
// import { execSync } from 'child_process';
// import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
// import debounce from 'debounce';
// const cwd = process.cwd()
// const options: Partial<SimpleGitOptions> = {
//   baseDir: cwd,
//   binary: 'git',
//   maxConcurrentProcesses: 6,
//   trimmed: false,
// };
// const guidePath = path.join(cwd, 'GUIDE.md')
// let lastBlockPatch: ExtendedCodeBlock|null=null;
// // when setting all options in a single object
// const git: SimpleGit = simpleGit(options);
// const printDiffMsg = (status: any) =>{
//  let msg = status.not_added.length ? `Added: \n- ${status.not_added.join('\n- ')}\n` : '';
//   msg += status.deleted.length ? `Deleted: \n- ${status.deleted.join('\n- ')}\n` : '';
//   msg += status.modified.length ? `Modified: \n- ${status.modified.filter(((f:string)=>f==='GUIDE.md')).join('\n- ')}\n` : '';
//   msg += status.renamed.length ? `renamed: \n- ${status.renamed.join('\n- ')}\n` : '';
//  return msg
// }
// const recordDiff = debounce(async function recordDiff() {
//   const status = await git.status();
//   const changedFiles = status
//     .not_added
//     .concat(status.created)
//     .concat(status.deleted)
//     .concat(status.modified)
//     .filter(f=>!f.startsWith('patches')||f!=="GUIDE.md")
//   if(changedFiles.length){
//     await git.add(changedFiles)
//     const diff = await git.diff(['--cached'])
//     if(diff){
//       const id = `${hash(diff)}`
//       let guide = fs.readFileSync(guidePath, 'utf-8')
//       fs.outputFileSync(`patches/${id}.patch`, diff)
//       const newCodeBlockText = "\n```patch id=" + `${id}\n${printDiffMsg(status)}` + "\n```"
//       if (lastBlockPatch?.meta?.id){
//         fs.rmSync(`patches/${lastBlockPatch.meta.id}.patch`)
//         guide = guide.replace('\n' + lastBlockPatch.raw, '')
//       }
//       fs.writeFileSync(guidePath, guide + newCodeBlockText )
//       await git.add('GUIDE.md')
//       await git.add('patches')
//     }
//   }else if(lastBlockPatch){
//     lastBlockPatch = null
//   }
// }, 200)
// function start() {
//   const guideWatcher = chokidar.watch(guidePath)
//   guideWatcher.on('change', (event) => {
//     const guideMD = fs.readFileSync(guidePath, 'utf8')
//     runGuide(guideMD)
//   })
//   const fsWatcher = chokidar.watch('files/**/*', {
//     ignored: ["node_modules", "patches", "GUIDE.md", 'index.ts', '.git']
//   })
//   fsWatcher.on('change', async (event) => {
//     console.log('fs change')
//     await recordDiff()
//   })

// }

// interface ExtendedCodeBlock  {
//   result?: any;
//   code?: string;

// }
// async function runGuide(guideMD: string) {
//   const mdAST = mdParse(guideMD)
//   const lastBlock = mdAST[mdAST.length-1]
//   if (lastBlock.type === 'codeBlock' && lastBlock.syntax === 'patch'){
//       lastBlockPatch = lastBlock
//       return 
//   } else  if(lastBlockPatch){
//     const diff = await git.diff(['--cached'])
//     if (diff && lastBlockPatch.meta?.file) {
//       fs.outputFileSync(lastBlockPatch.meta?.file, diff)
//     }
//     await git.commit(lastBlockPatch.code)
//     lastBlockPatch = null
//   }
//   const codeNodes = mdAST.filter(node => node.type === 'codeBlock') as ExtendedCodeBlock[]

//   console.log('Saving cache')
// }
// const runners: Record<ExtendedCodeBlock['syntax'], any> = {
//   sh: (code: string) => {
//     return execSync(code, {
//       cwd
//     }).toString()
//   },
//   node: (code: string) => { 
    
//   }
// }
// async function runBlock(block: ExtendedCodeBlock) {
//   if(block?.meta?.file){
//     if(block.syntax !== 'diff'){
//       fs.outputFileSync(block.meta.file, block.code)
//     }
//   }
//   if(block?.meta?.run){
//     if(runners[block.syntax]){
//       console.log(`Running ${block.syntax}: ${block.code}`)
//       const runner = runners[block.syntax]
//       block.result = await runner(block.code)
//       console.log(`Result: ${block.result}`)
//     }
//   }

//   return block
// }

// if (!process.argv[2]) {
//   console.log('Watching GUIDE.md')
//   start()
// }
export {}