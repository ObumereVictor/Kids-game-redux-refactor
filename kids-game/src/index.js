import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store";
import "normalize.css";
import { Provider } from "react-redux";
const rootDOM = document.getElementById("root");
const root = ReactDOM.createRoot(rootDOM);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
