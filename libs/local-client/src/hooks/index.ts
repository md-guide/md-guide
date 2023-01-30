import store, { RootState } from "../redux/store";
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from "react-redux";
import { bindActionCreators } from "redux";
import {
  moveCell,
  updateCellContent,
  updateCellLanguage,
  updateCodeCellMeta,
  insertCell,
  deleteCell,
  setCells,

} from "../redux";

type AppDispatch = typeof store.dispatch;

// Export typed version of useDispatch and useSelector
export const useDispatch = () => _useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;

// action creators
const actionCreators = {
  moveCell,
  updateCellContent,
  updateCellLanguage,
  updateCodeCellMeta,
  insertCell,
  deleteCell,
  setCells,

  
};
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actionCreators, dispatch);
};

export const useCumulativeCode = (id: string) => {
  return useSelector((state) => {
    const defineShow = `
    show = (value, concat = false) => {
      const root = document.querySelector("#root")
      if (typeof value === "object") {
        if (value.$$typeof && value.props) {
          if (!concat) {
            ReactDOM.render(value, root)
          }
        } else {
          !concat ? root.innerHTML = JSON.stringify(value,null,2) : root.innerHTML = root.innerHTML + '<br/>' + JSON.stringify(value,null,2)
        }
      } else {
        !concat ? root.innerHTML = value : root.innerHTML = root.innerHTML + '<br/>' + value
      }
    }
  `;
    const { data, order } = state.cells;
    const orderedCodeCells = order
      .map((cellid) => data[cellid])
      .filter((c) => c.id === id);
    const cumulativeCodeArray = ["let show;"];
    for (let c of orderedCodeCells) {
      if (c.id !== id) {
        cumulativeCodeArray.push("show = () => {}" + "\n" + c.content);
      } else if (c.id === id) {
        cumulativeCodeArray.push(defineShow + "\n" + c.content);
        break;
      }
    }

    const cumulativeCode = cumulativeCodeArray.reduce((all, prev) => {
      return all + "\n" + prev;
    }, "");

    return cumulativeCode;
  });
};
