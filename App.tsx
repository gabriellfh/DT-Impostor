
import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, Player, PlayerRole, GameSettings, WordPair } from './types';
import { CATEGORIES, AVATARS } from './constants';
import { generateWordPair } from './services/geminiService';
import { 
  Users, 
  Play, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
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
  const [currentWordPair, setCurrentWordPair] = useState<WordPair | null>(null);
  const [distributionIndex, setDistributionIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Initialize with some default players
  useEffect(() => {
    setPlayers([
      { id: '1', name: 'João', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[0] },
      { id: '2', name: 'Maria', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[1] },
      { id: '3', name: 'Pedro', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[2] }
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

  const startGame = async () => {
    if (players.length < 3) return;
    setIsLoading(true);
    setPhase(GamePhase.CATEGORY_SELECTION);
    setIsLoading(false);
  };

  const setupWords = async (category: string) => {
    setIsLoading(true);
    const words = await generateWordPair(category);
    setCurrentWordPair(words);

    // Shuffle and assign roles
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

    // Check game over
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
        // Continue game
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
    <div className="min-h-screen max-w-md mx-auto bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-6 text-center border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          IMPOSTOR <span className="text-white font-light text-sm ml-1">O INTRUSO</span>
        </h1>
        {phase !== GamePhase.LOBBY && (
          <button onClick={resetGame} className="text-slate-400 hover:text-white transition-colors">
            <RotateCcw size={20} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {phase === GamePhase.LOBBY && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="text-cyan-400" /> Jogadores ({players.length}/10)
              </h2>
              <div className="space-y-3">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 group">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{player.avatar}</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <button 
                      onClick={() => removePlayer(player.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
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
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-white"
                />
                <button 
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim() || players.length >= 10}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 rounded-xl transition-all shadow-lg"
                >
                  <Plus />
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4">Configurações</h2>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700 mb-3">
                <span>Infiltrado</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSettings({...settings, undercoverCount: 0})} className={`w-8 h-8 rounded-lg ${settings.undercoverCount === 0 ? 'bg-cyan-600' : 'bg-slate-700'}`}>0</button>
                  <button onClick={() => setSettings({...settings, undercoverCount: 1})} className={`w-8 h-8 rounded-lg ${settings.undercoverCount === 1 ? 'bg-cyan-600' : 'bg-slate-700'}`}>1</button>
                </div>
              </div>
              <p className="text-xs text-slate-400 px-1">
                O infiltrado recebe uma palavra parecida. O impostor não recebe palavra.
              </p>
            </div>

            <button 
              onClick={startGame}
              disabled={players.length < 3}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-900/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Play fill="currentColor" size={20} /> COMEÇAR JOGO
            </button>
          </div>
        )}

        {phase === GamePhase.CATEGORY_SELECTION && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Escolha a Categoria</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setupWords(cat.name)}
                  className="bg-slate-800 hover:bg-slate-700 p-6 rounded-2xl border border-slate-700 transition-all transform hover:scale-105 text-center group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <div className="font-bold text-slate-200">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.WORD_DISTRIBUTION && (
          <div className="flex flex-col items-center justify-center h-full space-y-12">
            <div className="text-center">
              <span className="text-6xl mb-4 block">{players[distributionIndex].avatar}</span>
              <h2 className="text-3xl font-extrabold text-white">{players[distributionIndex].name}</h2>
              <p className="text-slate-400 mt-2 uppercase tracking-widest text-sm">É a sua vez de olhar</p>
            </div>

            <div className="relative w-full max-w-xs">
              <button 
                onClick={() => setIsWordVisible(!isWordVisible)}
                className={`w-full aspect-square rounded-3xl border-4 border-dashed border-slate-700 flex flex-col items-center justify-center transition-all duration-500 ${isWordVisible ? 'bg-slate-800 border-solid border-cyan-500 scale-100 shadow-2xl shadow-cyan-500/20' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
              >
                {isWordVisible ? (
                  <div className="text-center p-6">
                    <p className="text-xs text-cyan-400 uppercase font-bold tracking-widest mb-4">Sua palavra é</p>
                    <p className="text-4xl font-black text-white">{players[distributionIndex].word}</p>
                    <EyeOff className="mt-8 text-slate-600 mx-auto" size={32} />
                  </div>
                ) : (
                  <div className="text-center animate-pulse">
                    <Eye size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="font-bold text-slate-400">Pressione para ver</p>
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={nextDistribution}
              disabled={!isWordVisible}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${isWordVisible ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              OK, PRÓXIMO <ArrowRight size={20} />
            </button>
          </div>
        )}

        {phase === GamePhase.DISCUSSION && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-cyan-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <MessageSquare className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">Hora da Discussão</h2>
              <p className="text-slate-400 text-sm">Descreva sua palavra sem dizê-la!</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {players.filter(p => !p.isEliminated).map(p => (
                <div key={p.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
                  <span className="text-3xl mb-1">{p.avatar}</span>
                  <span className="font-bold text-sm">{p.name}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border-l-4 border-cyan-500">
              <p className="text-sm italic text-slate-300">"Uma dica por pessoa. Começando pelo mais jovem. No final, todos votam em quem parece suspeito."</p>
            </div>

            <button
              onClick={() => setPhase(GamePhase.VOTING)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-900/20 transition-all flex items-center justify-center gap-2"
            >
              <Vote size={20} /> IR PARA VOTAÇÃO
            </button>
          </div>
        )}

        {phase === GamePhase.VOTING && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Quem é o Impostor?</h2>
              <p className="text-slate-400">Selecione o jogador mais suspeito</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {players.filter(p => !p.isEliminated).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleVote(p.id)}
                  className="bg-slate-800 hover:bg-red-900/40 hover:border-red-500 p-6 rounded-2xl border border-slate-700 transition-all transform active:scale-95 text-center flex flex-col items-center group"
                >
                  <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{p.avatar}</span>
                  <span className="font-bold">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.REVEAL && (
          <div className="flex flex-col items-center justify-center h-full space-y-12 animate-in slide-in-from-bottom duration-500">
            <div className="text-center">
              <Trophy size={80} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-sm uppercase tracking-widest text-cyan-400 font-bold">Vitória de</h2>
              <h3 className="text-5xl font-black text-white mt-1">{winner}</h3>
            </div>

            <div className="w-full space-y-4">
              <h4 className="text-center text-slate-400 font-semibold">Os Papéis Eram:</h4>
              <div className="space-y-2">
                {players.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border ${p.role === PlayerRole.IMPOSTOR ? 'bg-red-900/20 border-red-800' : p.role === PlayerRole.UNDERCOVER ? 'bg-purple-900/20 border-purple-800' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <span>{p.avatar}</span>
                      <span className="font-bold">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.role === PlayerRole.IMPOSTOR ? 'bg-red-600' : p.role === PlayerRole.UNDERCOVER ? 'bg-purple-600' : 'bg-slate-600'}`}>
                        {p.role}
                      </span>
                      <p className="text-xs text-slate-300 mt-1">{p.word}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> JOGAR NOVAMENTE
            </button>
          </div>
        )}
      </main>

      {/* Footer / Info */}
      <footer className="p-4 text-center text-slate-500 text-[10px] uppercase tracking-tighter">
        Dedução Social • Diversão em Grupo • v1.0.0
      </footer>

      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-bold text-white mb-2">Preparando o mistério...</h2>
          <p className="text-slate-400 text-center text-sm">Consultando a inteligência artificial para palavras criativas.</p>
        </div>
      )}
    </div>
  );
};

export default App;
