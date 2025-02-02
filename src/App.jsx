import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatInitPage from './components/specialization';
import DSATutorChat from './components/chatbot';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatInitPage />} />
        <Route path="/chat:id" element={<DSATutorChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;