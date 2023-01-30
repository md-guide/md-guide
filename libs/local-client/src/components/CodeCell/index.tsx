import React, { useState, useEffect, KeyboardEvent } from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import Resizable from "../Resizable";
import { Cell, createBundle } from "../../redux";
import {
  useActions,
  useCumulativeCode,
  useDispatch,
  useSelector,
} from "../../hooks";
import FileTree from "../FileTree";
import { CodeEnv } from "./CodeEnv";

interface KeysPressed {
  [index: string]: boolean;
}

interface CodeCellProps {
  cell: Cell;
  hasTypescript: boolean;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell, hasTypescript }) => {
  // const [prevContent, setPrevContent] = useState<undefined | string>(undefined);
  const { updateCellContent } = useActions();
  const dispatch = useDispatch();
  const [isRunning, setIsRunning] = useState(false)
  const cumulativeCode = useCumulativeCode(cell.id);

  let keysPressed: KeysPressed = {};
  const handleSubmit = () => {
    // if (cell.content && cell.content !== prevContent) {
    //   setPrevContent(cell.content);
    //   dispatch(
    //     createBundle({ id: cell.id, input: cumulativeCode, hasTypescript })
    //   );
    // } else {
    //   console.log("the code cell may be empty or same as before");
    // }
    let code = cumulativeCode
    if(cell.language === 'shell'){
      code = getShellCode(cell);

      setIsRunning(true)
    }
    dispatch(
      createBundle({ id: cell.id, input: code, hasTypescript })
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed[event.key] = true;
    if (keysPressed["Control"] && keysPressed["Shift"]) {
      handleSubmit();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    delete keysPressed[event.key];
  };

  // remove auto-execution for now
  // useEffect(() => {
  //   const timer = setTimeout(handleSubmit, 2000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [cell.content]);
  const Editor = ()=> <CodeEditor
    initialValue={cell.content}
    onChange={(value) =>
      updateCellContent({ id: cell.id, content: value })
    }
    handleSubmit={handleSubmit}
    language={cell.language || "javascript"}
    meta={cell.meta}
    lineNumbers={false}
    height={'40px'}
  />
  return (
    <div className="code-cell">
      {
        cell.language === 'shell' &&
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          <Editor />
          <Preview id={cell.id} />
          </div>
      }
      {cell.language !== 'shell' && <CodeEnv cell={cell} />}

     
    </div>
  );

  function Shell({ cell, handleKeyDown, handleKeyUp }) {
    return <Resizable direction="vertical">
      <div
        style={{ height: "100%", display: "flex", flexDirection: "row" }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        {cell.meta.file && <FileTree />}
        {cell?.meta?.preview ?
          <>

            <Resizable direction="horizontal">

              <Editor />
            </Resizable>

            <Preview id={cell.id} />
          </> :
          <Editor />}
      </div>
    </Resizable>;
  }
};

export default CodeCell;
function getShellCode( cell: Cell) {
  const code = `

async function run(){
  const streamResponse = await fetch('/run/${cell.id}');
  const reader = streamResponse.body.getReader();
  document.body.innerHTML = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    document.body.innerHTML += '<br/>' + new TextDecoder().decode(value);
    window.scrollTo(0,document.body.scrollHeight);

  }

}
document.body.style.background = 'black'
document.body.style.color = 'white'

run()
`;
  return code;
}

