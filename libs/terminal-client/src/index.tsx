import React, { useRef, useEffect, useState, useCallback } from "react";

import { XTerm, XTermProps } from "xterm-for-react";

export interface TerminalProps {
  onData: (listener: (newData: string) => void) => void;
  sendData: (newData: string) => void
};


export const Terminal = ({ onData, sendData }: TerminalProps) => {

  const [bufferedCommand, setBufferedCommand] = useState();

  const xTerminalRef = useRef<XTerm>(null);
  const prompt = useCallback(() => {
    xTerminalRef.current?.terminal.write("\r\n$ ");
  }, [])
  const onKeyPressed = (event: { key?: string; domEvent: any; }) => {
    const printable =
      !event.domEvent.altKey &&
      !event.domEvent.ctrlKey &&
      !event.domEvent.metaKey;

    if (event.domEvent.keyCode === 13) {
      prompt();

      if (bufferedCommand !== undefined) {
        sendData(bufferedCommand);
        setBufferedCommand(undefined);
      }
    } else if (event.domEvent.keyCode === 8) {
      // Do not delete the prompt

      if (printable) {
        xTerminalRef.current?.terminal.write(event.domEvent.key);
        setBufferedCommand(
          bufferedCommand !== undefined
            ? bufferedCommand + event.domEvent.key
            : event.domEvent.key
        );
      }
    };
  }
  useEffect(() => {
    // Create a new function "propmt" which
    // requests a promt from the user

    // Only do this, when reference has changes and is not undefined
    if (xTerminalRef.current) {
      prompt();
    }
  }, [xTerminalRef]);

  useEffect(() => {
    onData &&
      onData((newData) => {
        xTerminalRef.current?.terminal.writeln(newData);
      });
  }, []);

  return (
    <div>
      <XTerm
        options={{
          cursorBlink: true,
          disableStdin: false
        }}
        onKey={(event) => onKeyPressed(event)}
        ref={xTerminalRef}
      />
    </div>
  );
}
