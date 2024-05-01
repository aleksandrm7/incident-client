import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Login from "./components/LoginPage/LoginPage.jsx";
import IncidentList from "./components/IncidentPage/IncidentList.jsx";
import IncidentLogList from "./components/IncidentLogPage/IncidentLogList.jsx"

import NavBar from "./components/NavBar.jsx";
import UserList from "./components/UserPage/UserList.jsx";
import ChartsPage from "./components/ChartsPage/ChartsPage.jsx";

function App() {
  return (
      <Router>
          <NavBar/>
          <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="/user/incident-list" element={<IncidentList />} />
              <Route path="/user/incident-log-list" element={<IncidentLogList />} />
              <Route path="/user-list" element={<UserList />} />
              <Route path="/charts" element={<ChartsPage />} />
          </Routes>
      </Router>
  );
}

export default App;
