import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/game';
import { PlayingCard } from '../game/PlayingCard';
import type { Card, Player } from '@/types/game';

interface TestModeProps {
  onClose: () => void;
}

export const TestMode: React.FC<TestModeProps> = ({ onClose }) => {
  const { 
    players, 
    initGame, 
    playCard, 
    currentPlayer, 
    phase,
    passBid,
    currentBid,
    currentTrick,
    trump
  } = useGameStore();

  // Initialiser une nouvelle partie au montage du composant
  useEffect(() => {
    initGame();
  }, []);

  // Simulation des bots
  useEffect(() => {
    if (currentPlayer === 0) return; // Skip si c'est le tour de l'admin

    const timer = setTimeout(() => {
      const player = players[currentPlayer];
      
      if (phase === 'bidding') {
        // Les bots passent toujours
        passBid(player.id);
      } else if (phase === 'playing') {
        // Jouer une carte valide au hasard
        const playableCards = player.hand.filter(card => {
          if (currentTrick.length === 0) return true;
          const leadSuit = currentTrick[0].suit;
          return card.suit === leadSuit || !player.hand.some(c => c.suit === leadSuit);
        });
        
        const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
        playCard(player.id, randomCard);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentPlayer, phase, players, currentTrick]);

  const handlePlayCard = (playerId: string, card: Card) => {
    if (currentPlayer === 0) {
      // Vérifier si la carte est jouable
      if (currentTrick.length === 0) {
        playCard(playerId, card);
      } else {
        const leadSuit = currentTrick[0].suit;
        const player = players[0];
        const hasSuit = player.hand.some(c => c.suit === leadSuit);
        
        if (!hasSuit || card.suit === leadSuit) {
          playCard(playerId, card);
        }
      }
    }
  };

  const renderPlayerHand = (player: Player) => {
    const isAdmin = player.position === 0;
    const isCurrentPlayer = currentPlayer === player.position;

    return (
      <div className={`rounded-lg p-4 shadow-lg ${
        isCurrentPlayer ? 'bg-blue-50' : 'bg-white'
      }`}>
        <h3 className="mb-4 text-lg font-bold flex items-center justify-between">
          <span>
            {player.name}
            {isCurrentPlayer && ' (Tour actuel)'}
          </span>
          <span className="text-sm font-normal text-gray-500">
            {isAdmin ? 'Vous' : 'Bot'}
          </span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {player.hand.map((card) => (
            <PlayingCard
              key={`${card.suit}-${card.rank}`}
              card={card}
              onClick={() => isAdmin ? handlePlayCard(player.id, card) : null}
              className={`transform transition-transform ${
                isAdmin ? 'hover:-translate-y-2 cursor-pointer' : ''
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentTrick = () => {
    if (currentTrick.length === 0) return null;

    return (
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-4 text-lg font-bold">Pli en cours</h3>
        <div className="flex gap-4">
          {currentTrick.map((card, index) => (
            <PlayingCard
              key={`${card.suit}-${card.rank}-${index}`}
              card={card}
              className="transform-none"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex items-center gap-4">
          <span className="font-medium">
            Phase: <span className="capitalize">{phase}</span>
          </span>
          {currentBid && (
            <span className="font-medium">
              Enchère actuelle: {currentBid.points} {currentBid.suit}
            </span>
          )}
          {trump && (
            <span className="font-medium">
              Atout: <span className="capitalize">{trump}</span>
            </span>
          )}
          <Button onClick={() => initGame()}>Nouvelle partie</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {players.map((player) => (
          <div key={player.id}>{renderPlayerHand(player)}</div>
        ))}
      </div>

      {renderCurrentTrick()}

      <div className="rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-4 text-lg font-bold">Instructions</h3>
        <ul className="list-inside list-disc space-y-2">
          <li>Vous êtes le joueur "Nord" (en haut à gauche)</li>
          <li>Les autres joueurs sont des bots qui :</li>
          <ul className="ml-6 list-inside list-disc space-y-1">
            <li>Passent systématiquement pendant les enchères</li>
            <li>Jouent une carte aléatoire valide pendant la phase de jeu</li>
          </ul>
          <li>Le joueur actuel est mis en évidence en bleu</li>
          <li>Vous ne pouvez jouer que des cartes valides selon les règles de la belote</li>
          <li>Cliquez sur "Nouvelle partie" pour recommencer</li>
        </ul>
      </div>
    </div>
  );
};