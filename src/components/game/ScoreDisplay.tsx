import React from 'react';

interface ScoreDisplayProps {
  team1Score: number;
  team2Score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ team1Score, team2Score }) => {
  return (
    <div className="absolute right-4 top-4 rounded-lg bg-white/90 p-4 shadow-lg">
      <h3 className="text-lg font-bold mb-2">Score</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Équipe 1:</span>
          <span className="font-bold text-blue-600">{team1Score}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Équipe 2:</span>
          <span className="font-bold text-red-600">{team2Score}</span>
        </div>
      </div>
    </div>
  );
};