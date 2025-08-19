import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AdminApp from './AdminApp';
import UserApp from './UserApp';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  useEffect(() => {
    const token = Cookies.get('usertoken');
    const admintoken = Cookies.get('admintoken');
    
    console.log("User token:", token);
    console.log("Admin token:", admintoken);
  });
  return (
    <ThemeProvider>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <Router>
        <Routes>
        <Route path="/*" element={<UserApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};
export default App;