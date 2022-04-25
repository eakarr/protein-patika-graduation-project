import { ToastContainer } from "react-toastify";
import Router from "./router/Router";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router />
      <ToastContainer />
    </div>
  );
}

export default App;
