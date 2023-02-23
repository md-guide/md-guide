interface Block {
  type: 'code' | 'text';
  id: string;
  attributes: Record<string, string>
  content: string;
}

interface Guide {
  text: string;
  ast: Block[]
}

type RunnerCallback = (data: string) => void;

interface RunnerResponse {
  onResponseUpdate?: (cb: RunnerCallback) => void;
  onResponseEnd: (cb: RunnerCallback) => void;
  setResponseInput?: (data: string) => void;
  kill?: () => void
}

interface Runner {
  type: string;
  run: (code: string, options?: any) => RunnerResponse
}

interface File {
  id: string;
  content: string;
  path: string;
}

interface FileTreeSnapshot {
  id: string;
  files: File[]
}
interface Patch {
  id: string;
  diff: string;
}

type Diff = string;
interface GitStorage {
  getFileTreeSnapshot: (id: string) => FileTreeSnapshot;
  getFileAtSnapshot: (id: string, filePath: string) => File;
  moveSnapshotAfter: (id: string, to: string) => boolean;
  computePatches: () => Patch[];
  removeSnapshots: (ids: string[]) => void;
  // getFileTreeChanges: () => Diff;

}

interface Log {
  offset: number;
  text: string;
}

type Logs = Log[]

type Pid = string;
type LogCallback = (logs: Logs) => void
interface BlockCliInstance {
  run: (command: string, dir: string) => Pid;
  logs: (cb: LogCallback) => void;
  setInput: (data: string) => boolean;
  status?: 'error' | 'success' | 'warning';
  pid: Pid;
  kill: () => void;
}
interface Server {
  getGuide: (filePath?: string) => Guide;
  updateFileAtBlock: (blockId: string, file: string, diff: string) => boolean;
  updateBlock: (blockId: string, content: string) => boolean;
  getBlockLogs: (blockId: string) => Logs;
  runBlock: (blockId: string) => Pid;
  getCliInstance: (pid: Pid) => BlockCliInstance;

}

interface CliTool {
  serve: (dirPath?: string) => Server
}