import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateMystery from './pages/CreateMystery';
import InvestigationRoom from './pages/InvestigationRoom';
import Results from './pages/Results';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#08090C] text-[#F8FAFC] noir-bg selection:bg-amber-500/30 selection:text-amber-200">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMystery />} />
            <Route path="/investigate/:caseId" element={<InvestigationRoom />} />
            <Route path="/results/:caseId" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
