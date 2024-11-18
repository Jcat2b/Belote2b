import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { GameTable } from './components/game/GameTable';
import { AdminPanel } from './components/admin/AdminPanel';
import { useAuthStore } from './store/auth';
import { Button } from './components/ui/Button';

function App() {
  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <LoginForm />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.isAdmin ? 'Administration - Belote Contrée' : 'Belote Contrée'}
            </h1>
            <Button
              variant="outline"
              onClick={() => useAuthStore.getState().logout()}
            >
              Déconnexion
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={user?.isAdmin ? <AdminPanel /> : <GameTable />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;