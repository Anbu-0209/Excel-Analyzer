import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Register from "./scenes/form/Register";
import ExcelUploadAndTable from "./scenes/excel/Excel";
import UploadHistory from "./scenes/excel/UploadHistory";
import HistoryCards from "./scenes/excel/UploadHistory";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [history, setHistory] = useState([]);

  const location = useLocation(); 

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('uploadHistory')) || [];
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadHistory', JSON.stringify(history));
  }, [history]);

  const isHomePage = location.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isHomePage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isHomePage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/line" element={<Line />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/upload" element={<ExcelUploadAndTable setHistory={setHistory} />} />
              <Route path="/history" element={<UploadHistory history={history} />} />
              <Route path="/his" element={<HistoryCards />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
