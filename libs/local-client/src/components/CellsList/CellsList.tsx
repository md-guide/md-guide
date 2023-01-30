import React, { useEffect, useRef } from "react";
import CellItem from "./CellItem";
import { useActions, useDispatch, useSelector } from "../../hooks";
import { Cell } from "../../redux";
import AddCell from "../AddCell";
const cellSocket = new WebSocket(`ws://${document.location.hostname}${document.location.port ? ':' + document.location.port : ''}/cells`);

const CellsList: React.FC = () => {
  const dispatch = useDispatch();
  const {setCells, } = useActions()
  const { cellsData, order, hasTypescript } = useSelector(({ cells }) => {
    let { data, order } = cells;
    const cellsData = order.map((id) => data[id]);
    // updateCells()
    const hasTypescript =
      cellsData.filter((cell) => cell.language === "typescript").length > 0;
    return { cellsData, order, hasTypescript };
  });
  const cellRef = useRef(cellsData)
  cellRef.current = cellsData
  // fetch cells from file
  useEffect(() => {
    cellSocket.onopen = () => {
      cellSocket.onmessage = (ev)=>{
        setCells({data: JSON.parse(ev.data)})
      }
    }
    document.onkeydown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        cellSocket.send(JSON.stringify(cellRef.current))
      }
    }
  }, []);


 

  const cells = cellsData.map((cell) => {
    return (
      <div className="cells-list-item" key={cell.id}>
        <CellItem cell={cell} hasTypescript={hasTypescript} />
        <AddCell prevCellId={cell.id} />
      </div>
    );
  });

  return (
    <div className="cells-list" >
      {order.length === 0 && (
        <div className="visible">
          <AddCell prevCellId={null} />
        </div>
      )}
      {cells}
    </div>
  );
};

export default CellsList;
