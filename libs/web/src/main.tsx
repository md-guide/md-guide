import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Layout from "./components/Layout/Layout";
import { Provider } from "react-redux";
import store from "./redux";
import "./global.scss";
import dynamicImportPolyfill from 'dynamic-import-polyfill'
dynamicImportPolyfill.initialize()


ReactDOM.render(
  <Provider store={store}>
    <Layout>
      <App />
    </Layout>
  </Provider>,
  document.getElementById("root")
);
