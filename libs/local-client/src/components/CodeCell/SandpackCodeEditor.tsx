import React, { useEffect } from "react";
import { CodeEditor, FileTabs, SandpackStack, useActiveCode, useSandpack,  } from "@codesandbox/sandpack-react";

export const SandpackCodeEditor = () => {
  const { sandpack } = useSandpack();
  const { code, updateCode, readOnly: readOnlyFile } = useActiveCode();
  const { activeFile, status, editorState } = sandpack;
  const handleCodeUpdate = (newCode: string): void => {
    updateCode(newCode);
  };
  useEffect(()=>{
    if(code.length === 40){
      fetch(`/file/${code}`).then(res=>res.text()).then((resolvedCode)=>{
        updateCode(resolvedCode)
      })
    }
  },[activeFile])
  return (
    <SandpackStack >

      <div>
        <FileTabs closableTabs={true} />
        <CodeEditor
          key={activeFile}
          code={code}
          editorState={editorState}
          filePath={activeFile}
          initMode={sandpack.initMode}
          onCodeUpdate={handleCodeUpdate}
          readOnly={readOnlyFile}
          showInlineErrors={false}
          showLineNumbers={true}
          showReadOnly={readOnlyFile}
          wrapContent={true}
        />
      </div>
    </SandpackStack>
  )
}

