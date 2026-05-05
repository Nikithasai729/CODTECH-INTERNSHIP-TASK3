import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./Editor";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/documents/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

function Redirect() {
  const id = uuidV4();
  window.location.href = `/documents/${id}`;
  return null;
}

export default App;