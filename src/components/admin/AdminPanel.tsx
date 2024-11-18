import React, { useState } from 'react';
import { Users, Activity, Trophy, Plus, Search, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TestMode } from './TestMode';
import { StatCard } from './StatCard';

export const AdminPanel = () => {
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);
  const [connectedPlayers] = useState(0);
  const [activeGames] = useState(0);
  const [activeTournaments] = useState(0);

  if (showTestMode) {
    return <TestMode onClose={() => setShowTestMode(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Test Mode Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowTestMode(true)}
          className="flex items-center gap-2"
          variant="outline"
        >
          <TestTube className="h-4 w-4" />
          Mode Test
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={Users}
          title="Joueurs connectés"
          value={connectedPlayers}
          description="En ligne maintenant"
        />
        <StatCard
          icon={Activity}
          title="Parties en cours"
          value={activeGames}
          description="En temps réel"
        />
        <StatCard
          icon={Trophy}
          title="Tournois actifs"
          value={activeTournaments}
          description="En cours"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Tournament Card */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-lg font-medium">Créer un tournoi</h3>
          <p className="mt-1 text-sm text-gray-500">
            Organisez un nouveau tournoi de Belote Contrée
          </p>
          <Button
            onClick={() => setShowTournamentModal(true)}
            className="mt-4 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau tournoi
          </Button>
        </div>

        {/* Search Players Card */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-lg font-medium">Rechercher des joueurs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Trouvez et gérez les joueurs inscrits
          </p>
          <Button
            variant="outline"
            className="mt-4 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
};