// src/App.js
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DashBoard from './pages/dashboard';
import FeedbackForm from './pages/feedbackForm';
import About from './pages/About';
import Contact from './pages/Contact';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home/*" element={<PrivateRoute element={<Home />} />}>
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="feedback" element={<FeedbackForm />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
