import React from "react";
import LanguageDropdown from "../LanguageDropdown";
import { useActions } from "../../hooks";
import { meta } from "./CellItem";

export function CodeCellActions({ cell }) {
  const { updateCodeCellMeta } = useActions();
  console.log(cell);
  return (
    <>
      <LanguageDropdown
        id={cell.id}
        initialLanguage={cell.language || "javascript"} />
      {Object.keys(meta).map(m => {
        // @ts-ignore
        const type = meta[m];
        return <label key={m}>
          {m}: <input value={cell?.meta?.[m]} checked={type === 'checkbox' ? cell?.meta?.[m] : false} onChange={(e) => {
            updateCodeCellMeta({
              id: cell.id, meta: {
                ...cell.meta,
                [m]: type === 'checkbox' ? e.target.checked : e.target.value
              }
            });
          }} type={type}></input>
        </label>;
      })}
    </>
  );
}
