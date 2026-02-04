
import React, { useState, useEffect } from 'react';
import { GamePhase, Player, PlayerRole, GameSettings, WordPair } from './types.ts';
import { CATEGORIES, AVATARS } from './constants.tsx';
import { generateWordPair } from './services/geminiService.ts';
import { 
  Users, 
  Play, 
  Trash2, 
  Plus, 
  Minus,
  Eye, 
  EyeOff, 
  MessageSquare, 
  Vote, 
  Trophy,
  ArrowRight,
  RotateCcw,
  Star
} from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.LOBBY);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [settings, setSettings] = useState<GameSettings>({
    category: 'Comida',
    impostorCount: 1,
    undercoverCount: 0
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
      } else if (idx > 0 && idx <= settings.undercoverCount) {
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
      const activeImpostors = newPlayers.filter(p => !p.isEliminated && (p.role === PlayerRole.IMPOSTOR || p.role === PlayerRole.UNDERCOVER)).length;
      const activeCivilians = newPlayers.filter(p => !p.isEliminated && p.role === PlayerRole.CITIZEN).length;
      
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

  const updateUndercoverCount = (val: number) => {
    const newCount = Math.min(5, Math.max(0, settings.undercoverCount + val));
    setSettings({ ...settings, undercoverCount: newCount });
  };

  const getLabel = () => {
    return settings.undercoverCount > 0 ? "Impostores" : "Impostor";
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen max-w-md mx-auto flex flex-col overflow-hidden relative">
      <header className="p-4 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400 fill-yellow-400" size={20} />
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-tighter">
            IMPOSTOR <span className="text-yellow-400 italic text-xl">KIDS</span>
          </h1>
        </div>
        {phase !== GamePhase.LOBBY && (
          <button onClick={resetGame} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <RotateCcw size={18} className="text-white" />
          </button>
        )}
      </header>

      <main className="flex-1 p-4 overflow-y-auto overscroll-contain pb-10">
        {phase === GamePhase.LOBBY && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-orange-500/20 backdrop-blur-lg rounded-[2rem] p-5 border border-white/20 shadow-2xl">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-yellow-300">
                <Users className="text-yellow-400" size={20} /> Amiguinhos ({players.length}/10)
              </h2>
              <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-red-600/20 p-3 rounded-2xl border border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl filter drop-shadow-md">{player.avatar}</span>
                      <span className="font-bold text-white text-sm">{player.name}</span>
                    </div>
                    <button onClick={() => removePlayer(player.id)} className="text-white/40 hover:text-white p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input 
                  type="text" 
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="Nome do amigo..."
                  className="flex-1 bg-white/20 border-2 border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-white placeholder:text-white/40 font-bold text-sm"
                />
                <button onClick={addPlayer} className="bg-yellow-400 hover:bg-yellow-300 text-red-700 w-12 h-12 rounded-2xl shadow-lg transition-all active:scale-90 flex items-center justify-center shrink-0">
                  <Plus size={24} strokeWidth={4} />
                </button>
              </div>
            </div>

            <div className="bg-red-600/30 backdrop-blur-lg rounded-[2rem] p-5 border border-white/20 shadow-2xl space-y-3">
              <h2 className="text-lg font-bold text-yellow-400">Opções Legais</h2>
              
              <div className="flex items-center justify-between bg-orange-700/40 p-4 rounded-[1.5rem] border-2 border-orange-400/30">
                <div className="flex-1 mr-4">
                  <span className="text-lg font-black text-white italic transition-all duration-300">
                    {getLabel()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => updateUndercoverCount(-1)}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-30"
                    disabled={settings.undercoverCount === 0}
                  >
                    <Minus size={20} strokeWidth={4} />
                  </button>
                  
                  <div className="bg-yellow-400 text-red-700 font-black w-10 h-10 flex items-center justify-center rounded-xl text-xl shadow-[0_4px_10px_rgba(255,215,0,0.3)]">
                    {settings.undercoverCount + 1}
                  </div>
                  
                  <button 
                    onClick={() => updateUndercoverCount(1)}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-30"
                    disabled={settings.undercoverCount >= 5}
                  >
                    <Plus size={20} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={startGame}
              disabled={players.length < 3}
              className="w-full bg-gradient-to-b from-orange-400 to-red-600 hover:from-orange-300 hover:to-red-500 py-4 rounded-[2rem] font-black text-xl text-white shadow-[0_6px_0_rgb(154,52,18)] flex items-center justify-center gap-3 transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:translate-y-0 mt-2"
            >
              <Play fill="currentColor" size={24} /> VAMOS JOGAR!
            </button>
          </div>
        )}

        {phase === GamePhase.CATEGORY_SELECTION && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-center text-white drop-shadow-lg">Escolha o Tema!</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setupWords(cat.name)}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-[1.5rem] border-2 border-white/20 text-center transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  <div className="text-4xl mb-2 filter drop-shadow-lg">{cat.icon}</div>
                  <div className="font-black text-base text-white tracking-tight">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.WORD_DISTRIBUTION && (
          <div className="flex flex-col items-center justify-center h-full space-y-8 py-2 animate-in slide-in-from-bottom-10 duration-500">
            <div className="text-center">
              <span className="text-7xl mb-2 block filter drop-shadow-2xl animate-bounce">{players[distributionIndex].avatar}</span>
              <h2 className="text-3xl font-black text-white drop-shadow-md">{players[distributionIndex].name}</h2>
              <p className="text-yellow-200 font-bold mt-1 uppercase tracking-widest text-xs">Sua vez de olhar!</p>
            </div>
            
            <button 
              onClick={() => setIsWordVisible(!isWordVisible)}
              className={`w-full max-w-[240px] aspect-square rounded-[2.5rem] border-8 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${isWordVisible ? 'bg-white border-yellow-400 rotate-0 scale-105 shadow-[0_20px_50px_rgba(255,215,0,0.3)]' : 'bg-red-900/40 border-white/20 rotate-3'}`}
            >
              {isWordVisible ? (
                <div className="text-center p-4 animate-in zoom-in duration-300">
                  <p className="text-xs text-red-600 uppercase font-black mb-2 tracking-tighter">Guarde Segredo! 🤫</p>
                  <p className="text-3xl font-black text-red-800 leading-tight">{players[distributionIndex].word}</p>
                  <EyeOff className="mt-6 text-red-300 mx-auto" size={32} />
                </div>
              ) : (
                <div className="text-center">
                  <Eye size={48} className="text-white/30 mx-auto mb-2" />
                  <p className="font-black text-white/50 text-lg">TOQUE PARA VER</p>
                </div>
              )}
            </button>
            
            <button
              onClick={nextDistribution}
              disabled={!isWordVisible}
              className={`w-full py-4 rounded-[2rem] font-black text-lg transition-all ${isWordVisible ? 'bg-yellow-400 text-red-800 shadow-lg active:scale-95' : 'bg-white/10 text-white/20 opacity-50'}`}
            >
              CONCLUÍDO! ✅
            </button>
          </div>
        )}

        {phase === GamePhase.DISCUSSION && (
          <div className="space-y-6 py-2 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <MessageSquare className="text-red-700" size={32} />
              </div>
              <h2 className="text-2xl font-black text-white">Hora de Falar!</h2>
              <p className="text-yellow-200 font-bold text-sm">Conte algo sobre sua palavra sem dizer o nome!</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {players.filter(p => !p.isEliminated).map(p => (
                <div key={p.id} className="bg-red-600/20 p-3 rounded-2xl border border-white/10 text-center shadow-lg">
                  <span className="text-4xl block mb-1">{p.avatar}</span>
                  <span className="font-black text-white text-xs">{p.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPhase(GamePhase.VOTING)}
              className="w-full bg-gradient-to-r from-orange-400 to-red-600 py-4 rounded-[2rem] font-black text-lg text-white shadow-lg active:scale-95"
            >
              QUEM É O IMPOSTOR? 🤔
            </button>
          </div>
        )}

        {phase === GamePhase.VOTING && (
          <div className="space-y-4 animate-in slide-in-from-right-10 duration-300">
            <h2 className="text-2xl font-black text-center text-white">Escolha o Suspeito!</h2>
            <div className="grid grid-cols-2 gap-3">
              {players.filter(p => !p.isEliminated).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleVote(p.id)}
                  className="bg-white/10 p-4 rounded-[1.5rem] border-2 border-white/10 text-center flex flex-col items-center hover:bg-yellow-500/20 active:scale-95"
                >
                  <span className="text-5xl mb-2 filter drop-shadow-lg">{p.avatar}</span>
                  <span className="font-black text-white text-sm">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.REVEAL && (
          <div className="flex flex-col items-center justify-center space-y-6 py-2 animate-in zoom-in-50 duration-500">
            <div className="text-center">
              <Trophy size={80} className="text-yellow-400 mx-auto mb-2 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-pulse" />
              <h2 className="text-base uppercase text-yellow-300 font-black tracking-widest italic">Uhul! Vitória dos</h2>
              <h3 className="text-4xl font-black text-white drop-shadow-lg leading-tight">{winner}</h3>
            </div>
            <div className="w-full space-y-2">
              {players.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded-2xl border-2 ${p.role === PlayerRole.IMPOSTOR ? 'bg-red-500/30 border-red-500' : p.role === PlayerRole.UNDERCOVER ? 'bg-orange-500/30 border-orange-500' : 'bg-white/10 border-white/20'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="font-black text-white text-sm">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] uppercase font-black px-2 py-1 rounded-full ${p.role === PlayerRole.IMPOSTOR ? 'bg-red-500 text-white' : p.role === PlayerRole.UNDERCOVER ? 'bg-orange-500 text-white' : 'bg-white/30 text-white'}`}>
                      {p.role}
                    </span>
                    <p className="text-xs font-bold text-white/60 mt-0.5">{p.word.split('!')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={resetGame} className="w-full bg-yellow-400 text-red-800 py-4 rounded-[2rem] font-black text-xl shadow-xl hover:bg-yellow-300 active:translate-y-1">
              JOGAR NOVAMENTE! 🎈
            </button>
          </div>
        )}
      </main>

      <footer className="p-3 text-center text-white/30 text-[9px] font-black uppercase tracking-tighter shrink-0 bg-red-950/20 backdrop-blur-sm">
        Dedução Social Kids • v1.1.2 🚀
      </footer>

      {isLoading && (
        <div className="absolute inset-0 bg-red-950/95 z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="w-16 h-16 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black text-2xl text-white text-center animate-pulse">PREPARANDO A BAGUNÇA...</p>
        </div>
      )}
    </div>
  );
};

export default App;
