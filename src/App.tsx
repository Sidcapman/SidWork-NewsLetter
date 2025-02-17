import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Write from './pages/Write';
import Subscribe from './pages/Subscribe';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(() => {
      setIsInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_OUT') {
        // Clear any user-specific data from localStorage
        localStorage.removeItem('supabase.auth.token');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="animate-pulse">Initializing...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-green-400 font-mono">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/write" element={<Write />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App