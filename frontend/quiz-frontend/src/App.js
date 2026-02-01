import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./Intro";
import Home from "./Home";
import ResultPage from "./ResultPage";
import History from "./History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<History/>} />
      </Routes>
    </BrowserRouter>
  );
}
