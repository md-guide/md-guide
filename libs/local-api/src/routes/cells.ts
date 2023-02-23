import chokidar from 'chokidar';
import express from "express";
import fs from 'fs-extra';
import path from "path";
import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import { handleFileSystemChange } from "../lib/fsChange";
import { astMD, mdAST } from "../mdAST";
import { Cell, CodeCell } from "../types";
import { runners } from "./runners";
export const cwd = process.cwd()
import Convert from 'ansi-to-html';
import memo from 'fast-memoize';
const convert = new Convert();
// const cwd = '../exa'
const options: Partial<SimpleGitOptions> = {
  baseDir: cwd,
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};
const guidePath = path.join(cwd, 'GUIDE.md')
// when setting all options in a single object
const git: SimpleGit = simpleGit(options);
let lastBlockPatch: CodeCell | null = null;
let cellsSocket: any;

// interface CallbackArgs {
//   path: string,
//   query: Record<string, string>,
//   cookie: string
// }
// type Callback = (args: CallbackArgs) => void;
// handleFileSystemChange(cwd, git)
// const useFileChanged = use((filename: string) => {
//   return { onChange: () => { }, filename }
// })



// useFileChanged('filepath', [cwd])
// const funcs = new Map()
// const use = (func) => {
//   return (...args, deps) => {
//     if (Array.isArray(deps)) {
//       if (funcs.has(func)) {
//         const { deps: memoedDeps, memoedFunc } = funcs.get(func)
//         if (deps.some((dep, index) => dep !== memoedDeps[index])) {
//           const newMemoedFunc = memo(func)
//           funcs.set(func, { deps, memoedFunc: newMemoedFunc })
//           return newMemoedFunc(...args)
//         } else {
//           return memoedFunc(...args)
//         }
//       } else {
//         const newMemoedFunc = memo(func)
//         funcs.set(func, { deps, memoedFunc: newMemoedFunc })
//         return newMemoedFunc(...args)
//       }
//     }else{
//       if (funcs.has(func)) {
//         const { memoedFunc } = funcs.get(func)
//         return memoedFunc(...args)
//       }else{
//         const newMemoedFunc = memo(func)
//         funcs.set(func, {memoedFunc: newMemoedFunc })
//         return newMemoedFunc(...args)

//       }
//     }


//   }
//   let memoedFunc;
//   funcs.set(func, { deps })

// }
// const useRoute = use((route) => {
//   return {
//     get: use((callback: Callback) => { }),
//     post: use((callback: Callback) => { }),
//     delete: use((callback: Callback) => { }),
//     put: use((callback: Callback) => { })
//   }
// })

// const useFileChange = use((filename: string) => {
//   return { onChange: () => { }, filename }
// })
// const useSocket = use((path: string) => {
//   return {
//     on: use(() => { }),
//     send: use(() => { })
//   }
// })
// const useState = (data: any) => { return [] }
export const createCellsRouter: any = (filename: string, dir: string) => {
  // const [data, setData] = useState([])
  // const onGuideChange = useFileChange(filename, { cwd }, [])

  // const { get: useGetCells, post: usePostCells } = useRoute('/cells', [])
  // useGetCells((
  //   {
  //     path,
  //     query,
  //     cookie
  //   }
  // ) => {
  //   return data;
  // }, [data])
  // usePostCells((
  //   {
  //     path,
  //     query,
  //     cookie
  //   }
  // ) => {
  //   return data;
  // }, [data])

  // const { onMessage, send: sendMessage } = useSocket('/cells')



  
  const router = express.Router();
  // @ts-ignore
  router.use(express.json());
  const fullPath = path.join(dir, filename);
  // file sync
  const guideWatcher = chokidar.watch(fullPath)
  getFileTree(router);
  getFileAtHashRoute(router);
  runBlock(router, fullPath);
  guideWatcher.on('change', async () => {
    console.log('guide change')
    await sendToBrowser(fullPath, cellsSocket);
  })
  // @ts-ignore
  router.ws('/cells', async function (ws) {
    await sendToBrowser(fullPath, ws);
    cellsSocket = ws
    ws.on('message', async function (msg: any) {
      console.log('browser app data change')
      const cells: Cell[] = JSON.parse(msg);
      await updateGuideFromAST(cells, fullPath);
    });

  });
  return router;
};


function runBlock(router: express.Router, fullPath: string) {
  router.get('/run/:blockId', async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const blockId = req.params.blockId;
    const cachedLogPath = `cache/${blockId}.log`;
    if (fs.existsSync(cachedLogPath)) {
      // const treeChange = await git.raw(['ls-tree', '--full-tree', '-r', `:/${blockId}`]).catch(err=>{})
      res.send({
        // tree: treeChange,
        output: fs.readFileSync(cachedLogPath)
      });
    } else {
      const { ast } = readMD(fullPath);
      const block = ast.find(({ id }) => blockId === id) as CodeCell;
      const runner = runners[block.language];
      if (runner) {
        const output = runner(block.content);
        // console.log(output.stdout, output.stderr)
        output.stdout.on('data', (data: any) => {
          // Write the data to the response
          data = convert.toHtml(data.toString());
          console.log(data);

          res.write(data);
        });
        output.stderr.on('data', (data: string) => {
          // Write the data to the response
          res.write(data);
        });

        // Listen for the end event on the stdout stream
        output.stdout.on('end', () => {
          // End the res
          res.end();
        });
        // fs.outputFileSync(cachedLogPath, output)
        // res.send({
        //   output
        // })
      }
    }

  });
}

function getFileAtHashRoute(router: express.Router) {
  router.get('/file/:hash', async function (req, res) {
    const hash = req.params.hash;
    const file = await getFileAtHash(hash);
    res.send(file);
  });
}

function getFileTree(router: express.Router) {
  router.get('/files/:blockId', async function (req, res) {
    const blockId = req.params.blockId;
    try {
      const tree = await getBlockFileTree(blockId);
      res.send(tree);

    } catch (err) {
      res.send([]);
    }
  });
}

async function updateGuideFromAST(cells: Cell[], fullPath: string) {
  const guideMD = astMD(cells);
  await fs.writeFile(fullPath, guideMD, "utf-8");
}

async function getFileAtHash(hash: string) {
  console.log('get file at hash:', hash);
  const file = await git.show([hash]);
  return file;
}

async function getBlockFileTree(blockId: string) {
  const gittree = await git.raw(['ls-tree', '--full-tree', '-r', `:/${blockId}`, 'files']);
  const tree = gittree.split('\n').filter(l => l.trim()).map((line) => {
    const [_, type, hash, file] = line.split(/\s|\t/);
    return {
      type,
      hash,
      file: file.replace(/^files/, '')
    };
  });
  return tree;
}

function readMD(fullPath: string) {
  const initialMD = fs.readFileSync(fullPath, 'utf-8')
  const ast = mdAST(initialMD)
  const md = astMD(ast)
  if (md !== initialMD) {
    console.log('rewriting with missing ids')
    console.log(fullPath)
    fs.writeFileSync(fullPath, md, {
      encoding: 'utf-8'
    });
    const newMD = fs.readFileSync(fullPath, 'utf-8')
    return {
      content: md,
      ast
    }
  }
  return { content: initialMD, ast };
}

async function sendToBrowser(fullPath: string, ws: any) {
  const { ast: payload } = readMD(fullPath);
  ws && ws.send(JSON.stringify(payload));
  return payload;
}

