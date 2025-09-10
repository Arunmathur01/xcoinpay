import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Tokenomics from './components/Tokenomics';
import ICO from './components/ICO';
import SignIn from './components/SignIn';
import KYC from './components/KYC';
import History from './components/History';
import Admin from './components/Admin';

import Footer from './components/Footer';
import './App.css';
import './animations.css';



function AppContent() {
  const location = useLocation();
  const isSignInPage = location.pathname === '/signin';
  const isKYCPage = location.pathname === '/kyc';

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tokenomics" element={<Tokenomics />} />
        <Route path="/ico" element={<ICO />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isSignInPage && !isKYCPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
