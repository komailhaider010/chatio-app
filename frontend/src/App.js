import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import ChatProvider from "./Context/ChatProvider";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route exact path="/" Component={Home} />
          <Route path="/dashboard" Component={Dashboard} />
      </Routes>
    </div>
  );
}

export default App;
