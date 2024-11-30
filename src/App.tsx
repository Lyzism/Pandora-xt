import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login.tsx';
import Dashboard from './pages/dashboard.tsx';
import NotFound from './pages/404.tsx';
import { useFileStore } from './stores/fileStore';
import { useTransparencyStore } from './stores/useTransparencyStore';

const App: React.FC = (): JSX.Element => {
  const resetFileStore = useFileStore((state) => state.resetState);
  const resetTransparencyStore = useTransparencyStore((state) => state.resetState);

  useEffect(() => {
    resetFileStore();
    resetTransparencyStore();
  }, [resetFileStore, resetTransparencyStore]);

  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;