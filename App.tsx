
import React, { useState, useEffect } from 'react';
import { GamePhase, Player, PlayerRole, GameSettings, WordPair } from './types.ts';
import { CATEGORIES, AVATARS } from './constants.tsx';
import { generateWordPair } from './services/geminiService.ts';
import { 
  Users, 
  Play, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Vote, 
  Trophy,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.LOBBY);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [settings, setSettings] = useState<GameSettings>({
    category: 'Comida',
    impostorCount: 1,
    undercoverCount: 1
  });
  const [distributionIndex, setDistributionIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    setPlayers([
      { id: '1', name: 'Jogador 1', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[0] },
      { id: '2', name: 'Jogador 2', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[1] },
      { id: '3', name: 'Jogador 3', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[2] }
    ]);
  }, []);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPlayerName.trim(),
        role: PlayerRole.CITIZEN,
        word: '',
        isEliminated: false,
        avatar: AVATARS[players.length % AVATARS.length]
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startGame = () => {
    if (players.length < 3) return;
    setPhase(GamePhase.CATEGORY_SELECTION);
  };

  const setupWords = async (category: string) => {
    setIsLoading(true);
    const words = await generateWordPair(category);

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const updatedPlayers = shuffled.map((p, idx) => {
      let role = PlayerRole.CITIZEN;
      let word = words.citizenWord;

      if (idx === 0) {
        role = PlayerRole.IMPOSTOR;
        word = 'Você é o IMPOSTOR! (Tente descobrir a palavra)';
      } else if (idx === 1 && settings.undercoverCount > 0) {
        role = PlayerRole.UNDERCOVER;
        word = words.undercoverWord;
      }

      return { ...p, role, word, isEliminated: false };
    });

    setPlayers(updatedPlayers);
    setDistributionIndex(0);
    setIsWordVisible(false);
    setPhase(GamePhase.WORD_DISTRIBUTION);
    setIsLoading(false);
  };

  const nextDistribution = () => {
    if (distributionIndex < players.length - 1) {
      setDistributionIndex(distributionIndex + 1);
      setIsWordVisible(false);
    } else {
      setPhase(GamePhase.DISCUSSION);
    }
  };

  const handleVote = (id: string) => {
    const votedPlayer = players.find(p => p.id === id);
    if (!votedPlayer) return;

    const newPlayers = players.map(p => p.id === id ? { ...p, isEliminated: true } : p);
    setPlayers(newPlayers);

    if (votedPlayer.role === PlayerRole.IMPOSTOR) {
      setWinner('CIDADÃOS');
      setPhase(GamePhase.REVEAL);
    } else {
      const activeImpostors = newPlayers.filter(p => !p.isEliminated && p.role === PlayerRole.IMPOSTOR).length;
      const activeCivilians = newPlayers.filter(p => !p.isEliminated && p.role !== PlayerRole.IMPOSTOR).length;
      
      if (activeImpostors >= activeCivilians) {
        setWinner('IMPOSTOR');
        setPhase(GamePhase.REVEAL);
      } else {
        setPhase(GamePhase.DISCUSSION);
      }
    }
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, isEliminated: false, word: '', role: PlayerRole.CITIZEN })));
    setPhase(GamePhase.LOBBY);
    setWinner(null);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-900 shadow-2xl flex flex-col overflow-hidden relative">
      <header className="p-6 text-center border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          IMPOSTOR
        </h1>
        {phase !== GamePhase.LOBBY && (
          <button onClick={resetGame} className="text-slate-400 hover:text-white transition-colors">
            <RotateCcw size={20} />
          </button>
        )}
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        {phase === GamePhase.LOBBY && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="text-cyan-400" /> Jogadores ({players.length}/10)
              </h2>
              <div className="space-y-3">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{player.avatar}</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <button onClick={() => removePlayer(player.id)} className="text-slate-500 hover:text-red-400 p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <input 
                  type="text" 
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Nome do amigo..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
                <button onClick={addPlayer} className="bg-cyan-600 px-4 rounded-xl shadow-lg">
                  <Plus />
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">Opções</h2>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
                <span>Com Infiltrado?</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSettings({...settings, undercoverCount: 0})} className={`w-10 h-10 rounded-lg ${settings.undercoverCount === 0 ? 'bg-cyan-600' : 'bg-slate-700'}`}>Não</button>
                  <button onClick={() => setSettings({...settings, undercoverCount: 1})} className={`w-10 h-10 rounded-lg ${settings.undercoverCount === 1 ? 'bg-cyan-600' : 'bg-slate-700'}`}>Sim</button>
                </div>
              </div>
            </div>

            <button 
              onClick={startGame}
              disabled={players.length < 3}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2"
            >
              <Play fill="currentColor" size={20} /> COMEÇAR
            </button>
          </div>
        )}

        {phase === GamePhase.CATEGORY_SELECTION && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Qual o tema?</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setupWords(cat.name)}
                  className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center"
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="font-bold">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.WORD_DISTRIBUTION && (
          <div className="flex flex-col items-center justify-center h-full space-y-12 py-10">
            <div className="text-center">
              <span className="text-7xl mb-4 block">{players[distributionIndex].avatar}</span>
              <h2 className="text-3xl font-extrabold">{players[distributionIndex].name}</h2>
            </div>
            <button 
              onClick={() => setIsWordVisible(!isWordVisible)}
              className={`w-full max-w-[280px] aspect-square rounded-3xl border-4 border-dashed flex flex-col items-center justify-center transition-all ${isWordVisible ? 'bg-slate-800 border-cyan-500 scale-100 shadow-2xl' : 'bg-slate-900 border-slate-700'}`}
            >
              {isWordVisible ? (
                <div className="text-center p-6">
                  <p className="text-xs text-cyan-400 uppercase font-bold mb-4">Sua palavra:</p>
                  <p className="text-3xl font-black">{players[distributionIndex].word}</p>
                  <EyeOff className="mt-8 text-slate-600 mx-auto" size={32} />
                </div>
              ) : (
                <div className="text-center">
                  <Eye size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="font-bold text-slate-400">Ver palavra</p>
                </div>
              )}
            </button>
            <button
              onClick={nextDistribution}
              disabled={!isWordVisible}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${isWordVisible ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-500 opacity-50'}`}
            >
              PRÓXIMO
            </button>
          </div>
        )}

        {phase === GamePhase.DISCUSSION && (
          <div className="space-y-8 py-4">
            <div className="text-center space-y-2">
              <MessageSquare className="text-cyan-400 mx-auto" size={48} />
              <h2 className="text-2xl font-bold">Discussão</h2>
              <p className="text-slate-400">Descreva sua palavra rapidamente!</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {players.filter(p => !p.isEliminated).map(p => (
                <div key={p.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center">
                  <span className="text-3xl block mb-1">{p.avatar}</span>
                  <span className="font-bold text-sm">{p.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPhase(GamePhase.VOTING)}
              className="w-full bg-cyan-600 py-4 rounded-2xl font-bold"
            >
              VOTAR NO SUSPEITO
            </button>
          </div>
        )}

        {phase === GamePhase.VOTING && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Quem sai?</h2>
            <div className="grid grid-cols-2 gap-4">
              {players.filter(p => !p.isEliminated).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleVote(p.id)}
                  className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center flex flex-col items-center"
                >
                  <span className="text-4xl mb-2">{p.avatar}</span>
                  <span className="font-bold">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.REVEAL && (
          <div className="flex flex-col items-center justify-center space-y-10 py-10">
            <div className="text-center">
              <Trophy size={80} className="text-yellow-400 mx-auto mb-4" />
              <h2 className="text-sm uppercase text-cyan-400 font-bold tracking-widest">Vitória de</h2>
              <h3 className="text-5xl font-black">{winner}</h3>
            </div>
            <div className="w-full space-y-3">
              {players.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border ${p.role === PlayerRole.IMPOSTOR ? 'bg-red-900/20 border-red-800' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <span>{p.avatar}</span>
                    <span className="font-bold">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-700">{p.role}</span>
                    <p className="text-xs text-slate-400 mt-1">{p.word.split('!')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={resetGame} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold">
              JOGAR DE NOVO
            </button>
          </div>
        )}
      </main>

      <footer className="p-4 text-center text-slate-600 text-[10px] uppercase">
        Dedução Social • v1.0.1
      </footer>

      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold">Gerando mistério...</p>
        </div>
      )}
    </div>
  );
};

export default App;
