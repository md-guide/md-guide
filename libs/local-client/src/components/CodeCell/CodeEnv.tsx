import { Sandpack } from "../Ide";
import React, { useEffect, useState } from "react";
import {  SandpackFileExplorer, SandpackLayout, SandpackProvider } from "@codesandbox/sandpack-react";
import { SandpackCodeEditor } from "./SandpackCodeEditor";

const defaultFiles = {
  "/styles.css": `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
h1 {
  font-size: 1.5rem;
}`,
  "/index.js": `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  "/package.json": `{
  "name": "test-sandbox",
  "main": "/index.js",
  "private": true,
  "scripts": {},
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "^4.0.0"
  }
}
`,
};
const filesA = {
  "/App.js": `import "./styles.css";
  
  export default function App() {
    return <h1>File A</h1>
  }`,
  "/index.js": 'hello',
};

export  const CodeEnv = ({cell}) => {
  const [files, setFiles] = useState({'/index.js': 'hello'})
  useEffect(()=>{
    fetch(`/files/${cell.id}`).then(res=>res.json()).then(data=>{
      console.log(data)
      setFiles(data.reduce((newFiles, f)=>{
        newFiles[f.file] = f.hash
        return newFiles
      }, { '/index.js': 'hello' }))
    })
  },[])
  console.log(files)
  return <SandpackProvider  files={files}
  
  customSetup={{
    entry: '/index.js',
    environment: 'static'
  }}
   options={{
    bundlerURL: "",
     fileResolver: {
       isFile: async (fileName): Promise<boolean> =>
         new Promise((resolve) => resolve(!!files?.[fileName])),
       readFile: async (fileName): Promise<string> =>
         new Promise((resolve) => resolve(files[fileName])+' this is test'),
     },
   }}
  >
    <SandpackLayout>
      <SandpackFileExplorer />
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
} 