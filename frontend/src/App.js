import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { Fragment } from "react";
import ChatPage from "./components/ChatPage";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatPage" element={<ChatPage />} />
      </Routes>
    </Fragment>
  );
}

export default App;
