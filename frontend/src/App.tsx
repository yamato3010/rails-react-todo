import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';

import './App.css'

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // トークンが存在するか確認
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}


export default App
