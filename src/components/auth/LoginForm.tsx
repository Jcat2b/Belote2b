import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { LogIn, Shield } from 'lucide-react';

const ADMIN_CREDENTIALS = {
  email: 'jerem.catta@gmail.com',
  password: 'TestAdminJC',
};

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleAdminToggle = (checked: boolean) => {
    setIsAdmin(checked);
    if (checked) {
      setEmail(ADMIN_CREDENTIALS.email);
      setPassword(ADMIN_CREDENTIALS.password);
      login({
        id: '1',
        username: 'Administrateur',
        email: ADMIN_CREDENTIALS.email,
        isAdmin: true,
      });
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAdmin) {
      login({
        id: '1',
        username: 'Joueur',
        email: email,
        isAdmin: false,
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
      <div className="text-center">
        {isAdmin ? (
          <Shield className="mx-auto h-12 w-12 text-red-600" />
        ) : (
          <LogIn className="mx-auto h-12 w-12 text-blue-600" />
        )}
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {isAdmin ? 'Administration' : 'Connexion'}
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isAdmin}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAdmin}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div className="flex items-center">
            <input
              id="admin-mode"
              name="admin-mode"
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => handleAdminToggle(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="admin-mode" className="ml-2 block text-sm text-gray-900">
              Mode administrateur
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!isAdmin && (
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        )}
      </form>
    </div>
  );
};