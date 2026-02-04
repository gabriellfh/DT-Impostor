
import React, { useState, useEffect } from 'react';
import { GamePhase, Player, PlayerRole, GameSettings, WordPair, GameMode } from './types.ts';
import { MAIN_CATEGORIES, AVATARS } from './constants.tsx';
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
  RotateCcw,
  Star,
  X,
  Edit2,
  Ghost,
  Search,
  ChevronLeft
} from 'lucide-react';

const SamuraiIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`}>
    {/* Body - Túnica Branca estilo Jujutsu/Roblox - Proporção Chibi (Corpo Pequeno) */}
    <rect x="35" y="65" width="30" height="25" rx="8" fill="white" />
    <path d="M50 65 L50 90" stroke="#1a1a1a" strokeWidth="1" />
    {/* Calça Preta */}
    <rect x="35" y="82" width="30" height="10" rx="3" fill="#1a1a1a" />
    {/* Head - Chibi/Boneco (Cabeça Grande) */}
    <circle cx="50" cy="40" r="35" fill="#ffe0bd" />
    {/* Cabelo Preto Espetado */}
    <path d="M15 40 Q10 5 50 5 Q90 5 85 40 L80 30 Q50 15 20 30 Z" fill="#1a1a1a" />
    {/* Detalhe do Olho / Bandagem (estilo Yuta) */}
    <rect x="25" y="38" width="50" height="8" rx="2" fill="white" opacity="0.9" transform="rotate(-5 50 40)" />
    {/* Olhos Pretos Redondos Grandes (Estilo Boneco) */}
    <circle cx="40" cy="48" r="5" fill="#1a1a1a" />
    <circle cx="65" cy="48" r="5" fill="#1a1a1a" opacity="0.4" />
    {/* Detalhes da Roupa (Botões) */}
    <circle cx="60" cy="72" r="2" fill="#1a1a1a" />
    <circle cx="60" cy="78" r="2" fill="#1a1a1a" />
  </svg>
);

const CountryIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`}>
    {/* Flag 1: Brazil (Back) */}
    <g transform="translate(10, 10) scale(0.75)">
      <rect x="0" y="5" width="5" height="70" fill="#a1a1a1" rx="2" /> {/* Pole */}
      <path d="M5 5 Q25 0 45 10 Q65 20 85 10 L85 50 Q65 60 45 50 Q25 40 5 50 Z" fill="#009c3b" /> {/* Wave Shape */}
      <path d="M15 27.5 L45 12.5 L75 27.5 L45 42.5 Z" fill="#ffdf00" />
      <circle cx="45" cy="27.5" r="8" fill="#002776" />
    </g>
    
    {/* Flag 2: Portugal (Front) */}
    <g transform="translate(35, 25) scale(0.75)">
      <rect x="0" y="5" width="5" height="70" fill="#666" rx="2" /> {/* Pole */}
      <mask id="flagMask">
        <path d="M5 5 Q25 0 45 10 Q65 20 85 10 L85 50 Q65 60 45 50 Q25 40 5 50 Z" fill="white" />
      </mask>
      <g mask="url(#flagMask)">
          <rect x="5" y="0" width="30" height="70" fill="#006600" />
          <rect x="35" y="0" width="60" height="70" fill="#ff0000" />
          <circle cx="35" cy="27.5" r="7" fill="#ffdf00" />
          <rect x="32" y="24.5" width="6" height="6" fill="#ffffff" stroke="#ff0000" strokeWidth="1" />
      </g>
    </g>
  </svg>
);

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.LOBBY);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [settings, setSettings] = useState<GameSettings>({
    category: '',
    impostorCount: 1,
    undercoverCount: 0,
    mode: GameMode.IMPOSTOR
  });
  const [distributionIndex, setDistributionIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  useEffect(() => {
    setPlayers([
      { id: '1', name: 'GabrielH', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[0] },
      { id: '2', name: 'Amigo 1', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[1] },
      { id: '3', name: 'Amigo 2', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[2] }
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

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const openAvatarPicker = (id: string) => {
    setActivePlayerId(id);
    setShowAvatarPicker(true);
  };

  const selectAvatar = (avatar: string) => {
    if (activePlayerId) {
      setPlayers(players.map(p => p.id === activePlayerId ? { ...p, avatar } : p));
      setShowAvatarPicker(false);
      setActivePlayerId(null);
    }
  };

  const startGame = () => {
    if (players.length < 3) return;
    setPhase(GamePhase.CATEGORY_SELECTION);
  };

  const setupWords = async (category: string) => {
    setIsLoading(true);
    const words = await generateWordPair(category);
    
    const indices = Array.from({ length: players.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const badGuyIndices = indices.slice(0, settings.impostorCount);
    
    const updatedPlayers = players.map((p, idx) => {
      let role = PlayerRole.CITIZEN;
      let word = words.citizenWord;
      
      if (badGuyIndices.includes(idx)) {
        if (settings.mode === GameMode.IMPOSTOR) {
          role = PlayerRole.IMPOSTOR;
          word = 'Você é o IMPOSTOR! (Tente descobrir a palavra)';
        } else {
          role = PlayerRole.UNDERCOVER; 
          word = words.undercoverWord;
        }
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

    const activeBadGuys = newPlayers.filter(p => !p.isEliminated && (p.role === PlayerRole.IMPOSTOR || p.role === PlayerRole.UNDERCOVER)).length;
    const activeCivilians = newPlayers.filter(p => !p.isEliminated && p.role === PlayerRole.CITIZEN).length;

    if (activeBadGuys === 0) {
      setWinner('CIDADÃOS');
      setPhase(GamePhase.REVEAL);
    } else if (activeBadGuys >= activeCivilians) {
      setWinner(settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO');
      setPhase(GamePhase.REVEAL);
    } else {
      setPhase(GamePhase.DISCUSSION);
    }
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, isEliminated: false, word: '', role: PlayerRole.CITIZEN })));
    setPhase(GamePhase.LOBBY);
    setWinner(null);
  };

  const updateImpostorCount = (val: number) => {
    const maxImpostors = Math.max(1, Math.floor(players.length / 2));
    const newCount = Math.min(maxImpostors, Math.max(0, settings.impostorCount + val));
    setSettings({ ...settings, impostorCount: newCount });
  };

  const setGameMode = (mode: GameMode) => {
    setSettings({ ...settings, mode });
  };

  const handleCategoryClick = (cat: any) => {
    setupWords(cat.name);
  };

  const getImpostorLabel = () => {
    const { mode, impostorCount } = settings;
    if (mode === GameMode.IMPOSTOR) {
      if (impostorCount === 0) return "Sem Impostor";
      if (impostorCount === 1) return "Impostor";
      return "Impostores";
    } else {
      if (impostorCount === 0) return "Sem Espião";
      if (impostorCount === 1) return "Espião";
      return "Espiões";
    }
  };

  const renderCategoryIcon = (id: string, icon: string) => {
    if (id === 'anime') return <SamuraiIcon className="w-14 h-14" />;
    if (id === 'countries') return <CountryIcon className="w-14 h-14" />;
    return <div className="text-4xl">{icon}</div>;
  };

  const ModeIcon = ({ className = "w-10 h-10" }: { className?: string }) => {
    if (settings.mode === GameMode.IMPOSTOR) {
      return <Ghost className={`${className} text-white drop-shadow-lg`} strokeWidth={3} />;
    }
    return <Search className={`${className} text-white drop-shadow-lg`} strokeWidth={4} />;
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen max-w-md mx-auto flex flex-col overflow-hidden relative">
      <header className="p-4 relative flex items-center justify-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <ModeIcon className="w-10 h-10" />
          <h1 className="text-3xl font-black text-white drop-shadow-lg tracking-tighter uppercase">
            {settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
          </h1>
          <ModeIcon className="w-10 h-10" />
        </div>
        {phase !== GamePhase.LOBBY && (
          <button onClick={resetGame} className="absolute right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <RotateCcw size={18} className="text-white" />
          </button>
        )}
      </header>

      <main className="flex-1 p-4 overflow-y-auto no-scrollbar overscroll-contain flex flex-col justify-center">
        {phase === GamePhase.LOBBY && (
          <div className="space-y-4 animate-in fade-in duration-500 w-full py-4">
            <div className="flex flex-col items-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-yellow-400/20 rounded-full scale-150 animate-pulse" />
                <div className="bg-white/10 p-10 rounded-[3rem] border-4 border-white/20 shadow-2xl animate-bounce duration-[3000ms] relative">
                   <ModeIcon className="w-24 h-24" />
                </div>
              </div>
              <div className="bg-white/10 px-4 py-1 rounded-full border border-white/20 mt-6">
                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">GabrielH [ 17 NÍVEL ]</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-1 border border-white/20 flex shadow-inner">
              <button 
                onClick={() => setGameMode(GameMode.IMPOSTOR)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.8rem] font-black transition-all ${settings.mode === GameMode.IMPOSTOR ? 'bg-yellow-400 text-red-800 shadow-lg' : 'text-white hover:bg-white/5'}`}
              >
                <Ghost size={20} /> IMPOSTOR
              </button>
              <button 
                onClick={() => setGameMode(GameMode.SPY)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.8rem] font-black transition-all ${settings.mode === GameMode.SPY ? 'bg-yellow-400 text-red-800 shadow-lg' : 'text-white hover:bg-white/5'}`}
              >
                <Search size={20} /> ESPIÃO
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-[2.5rem] p-5 border border-white/20 shadow-2xl flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-300">
                <Users className="text-yellow-400" size={20} /> Amiguinhos ({players.length}/10)
              </h2>
              
              <div className="space-y-2 max-h-[30vh] overflow-y-auto no-scrollbar pr-1">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-white/10 p-2 rounded-2xl border border-white/5 transition-all group">
                    <div className="flex items-center gap-3 flex-1">
                      <button 
                        onClick={() => openAvatarPicker(player.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl text-2xl hover:bg-white/40 transition-all shrink-0"
                      >
                        {player.avatar}
                      </button>
                      
                      {editingId === player.id ? (
                        <input
                          autoFocus
                          className="bg-transparent border-b-2 border-yellow-400 text-white font-bold text-base w-full outline-none"
                          value={player.name}
                          onChange={(e) => updatePlayerName(player.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                        />
                      ) : (
                        <div onClick={() => setEditingId(player.id)} className="flex items-center gap-2 cursor-pointer flex-1">
                          <span className="font-bold text-white text-base truncate">{player.name}</span>
                          <Edit2 size={12} className="text-white/20" />
                        </div>
                      )}
                    </div>
                    <button onClick={() => removePlayer(player.id)} className="text-white/30 hover:text-red-400 p-2 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                <div className="flex gap-2 p-1 pt-2 relative">
                  <input 
                    type="text" 
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    placeholder="Novo amigo..."
                    className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-white placeholder:text-white/30 font-bold"
                  />
                  <button onClick={addPlayer} className="bg-yellow-400 text-red-700 w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center shrink-0 active:scale-95">
                    <Plus size={24} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-[2.5rem] p-6 border border-white/20 shadow-2xl space-y-4">
              <h2 className="text-lg font-bold text-yellow-400">Opções Legais</h2>
              <div className="bg-white/5 p-4 rounded-[2rem] border border-white/10 flex items-center justify-between">
                <span className="text-lg font-black text-white italic">
                   {getImpostorLabel()}
                </span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateImpostorCount(-1)} 
                    className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-30" 
                    disabled={settings.impostorCount <= 0}
                  >
                    <Minus size={20} strokeWidth={4} />
                  </button>
                  <div className="bg-yellow-400 text-red-700 font-black w-10 h-10 flex items-center justify-center rounded-xl text-lg shadow-lg">
                    {settings.impostorCount}
                  </div>
                  <button 
                    onClick={() => updateImpostorCount(1)} 
                    className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-30" 
                    disabled={settings.impostorCount >= Math.floor(players.length / 2)}
                  >
                    <Plus size={20} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={startGame} disabled={players.length < 3} className="w-full bg-gradient-to-b from-orange-400 to-red-600 py-4 rounded-[2rem] font-black text-xl text-white shadow-[0_6px_0_rgb(154,52,18)] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
              <Play fill="currentColor" size={24} /> VAMOS JOGAR!
            </button>
          </div>
        )}

        {phase === GamePhase.CATEGORY_SELECTION && (
          <div className="space-y-4 animate-in slide-in-from-right-10 duration-300 w-full flex flex-col h-full overflow-hidden">
            <h2 className="text-2xl font-black text-center text-white drop-shadow-lg">Escolha o Tema!</h2>
            <div className="grid grid-cols-2 gap-3 pb-6 overflow-y-auto no-scrollbar flex-1">
              {MAIN_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => handleCategoryClick(cat)} className="bg-white/10 backdrop-blur-md p-4 rounded-[1.5rem] border-2 border-white/20 text-center transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="mb-2">
                    {renderCategoryIcon(cat.id, cat.icon)}
                  </div>
                  <div className="font-black text-sm text-white">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-sm">
            <div className="bg-orange-500 rounded-[2.5rem] w-full max-w-sm border-4 border-yellow-400 shadow-2xl overflow-hidden">
              <div className="p-4 border-b-4 border-orange-600 flex justify-between items-center bg-orange-400">
                <h3 className="text-white font-black text-xl">ESCOLHA SEU ANIMAL!</h3>
                <button onClick={() => setShowAvatarPicker(false)} className="bg-red-600 text-white p-2 rounded-full active:scale-90">
                  <X size={20} strokeWidth={4} />
                </button>
              </div>
              <div className="p-4 grid grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto bg-orange-500">
                {AVATARS.map((avatar, index) => (
                  <button key={index} onClick={() => selectAvatar(avatar)} className="aspect-square bg-white/20 rounded-2xl flex items-center justify-center text-3xl hover:bg-yellow-400 transition-all">
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === GamePhase.WORD_DISTRIBUTION && (
          <div className="flex flex-col items-center justify-center h-full space-y-8 py-2 w-full">
            <div className="text-center">
              <span className="text-7xl mb-2 block filter drop-shadow-2xl animate-bounce">{players[distributionIndex].avatar}</span>
              <h2 className="text-3xl font-black text-white">{players[distributionIndex].name}</h2>
              <p className="text-yellow-200 font-bold mt-1 uppercase text-xs">Sua vez de olhar!</p>
            </div>
            <button onClick={() => setIsWordVisible(!isWordVisible)} className={`w-full max-w-[240px] aspect-square rounded-[2.5rem] border-8 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${isWordVisible ? 'bg-white border-yellow-400 scale-105 shadow-2xl' : 'bg-red-900/40 border-white/20'}`}>
              {isWordVisible ? (
                <div className="text-center p-4">
                  <p className="text-xs text-red-600 uppercase font-black mb-2">Guarde Segredo! 🤫</p>
                  <p className="text-sm font-black text-red-600 mb-1 uppercase">
                    {players[distributionIndex].role === PlayerRole.CITIZEN ? 'VOCÊ É CIDADÃO' : settings.mode === GameMode.IMPOSTOR ? 'VOCÊ É O IMPOSTOR!' : 'VOCÊ É O ESPIÃO!'}
                  </p>
                  <p className="text-3xl font-black text-red-800 leading-tight">
                    {players[distributionIndex].word.includes('IMPOSTOR!') ? '?' : players[distributionIndex].word}
                  </p>
                  <EyeOff className="mt-6 text-red-300 mx-auto" size={32} />
                </div>
              ) : (
                <div className="text-center">
                  <Eye size={48} className="text-white/30 mx-auto mb-2" />
                  <p className="font-black text-white/50 text-lg">TOQUE PARA VER</p>
                </div>
              )}
            </button>
            <button onClick={nextDistribution} disabled={!isWordVisible} className={`w-full py-4 rounded-[2rem] font-black text-lg ${isWordVisible ? 'bg-yellow-400 text-red-800 shadow-lg' : 'bg-white/10 text-white/20 opacity-50'}`}>CONCLUÍDO! ✅</button>
          </div>
        )}

        {phase === GamePhase.DISCUSSION && (
          <div className="space-y-6 py-2 w-full text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-xl"><MessageSquare className="text-red-700" size={32} /></div>
            <h2 className="text-2xl font-black text-white">Hora de Falar!</h2>
            <p className="text-yellow-200 font-bold text-sm">Descreva sua palavra sem dizer o nome!</p>
            <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto">
              {players.filter(p => !p.isEliminated).map(p => (
                <div key={p.id} className="bg-red-600/20 p-3 rounded-2xl border border-white/10"><span className="text-4xl block mb-1">{p.avatar}</span><span className="font-black text-white text-xs">{p.name}</span></div>
              ))}
            </div>
            <button onClick={() => setPhase(GamePhase.VOTING)} className="w-full bg-gradient-to-r from-orange-400 to-red-600 py-4 rounded-[2rem] font-black text-lg text-white shadow-lg">VOTAR NO IMPOSTOR 🤔</button>
          </div>
        )}

        {phase === GamePhase.VOTING && (
          <div className="space-y-4 w-full">
            <h2 className="text-2xl font-black text-center text-white">Quem é o {settings.mode === GameMode.IMPOSTOR ? 'Impostor' : 'Espião'}?</h2>
            <div className="grid grid-cols-2 gap-3 pb-4">
              {players.filter(p => !p.isEliminated).map(p => (
                <button key={p.id} onClick={() => handleVote(p.id)} className="bg-white/10 p-4 rounded-[1.5rem] border-2 border-white/10 flex flex-col items-center">
                  <span className="text-5xl mb-2">{p.avatar}</span>
                  <span className="font-black text-white text-base">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.REVEAL && (
          <div className="flex flex-col items-center justify-center space-y-6 py-2 w-full text-center">
            <Trophy size={80} className="text-yellow-400 mx-auto mb-2 animate-pulse" />
            <h2 className="text-base uppercase text-yellow-300 font-black tracking-widest italic">Uhul! Vitória dos</h2>
            <h3 className="text-4xl font-black text-white drop-shadow-lg leading-tight">{winner}</h3>
            <div className="w-full space-y-2 max-h-[30vh] overflow-y-auto">
              {players.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded-2xl border-2 ${p.role !== PlayerRole.CITIZEN ? 'bg-red-500/30 border-red-500' : 'bg-white/10 border-white/20'}`}>
                  <div className="flex items-center gap-3"><span className="text-2xl">{p.avatar}</span><span className="font-black text-white text-base">{p.name}</span></div>
                  <div className="text-right">
                    <span className={`text-[8px] uppercase font-black px-2 py-1 rounded-full ${p.role !== PlayerRole.CITIZEN ? 'bg-red-500 text-white' : 'bg-white/30 text-white'}`}>
                      {p.role === PlayerRole.CITIZEN ? 'CIDADÃO' : settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
                    </span>
                    <p className="text-xs font-bold text-white/60 mt-0.5">{p.word.includes('IMPOSTOR!') ? 'IMPOSTOR' : p.word}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={resetGame} className="w-full bg-yellow-400 text-red-800 py-4 rounded-[2rem] font-black text-xl shadow-xl">JOGAR NOVAMENTE! 🎈</button>
          </div>
        )}
      </main>

      {isLoading && (
        <div className="absolute inset-0 bg-red-950/95 z-50 flex flex-col items-center justify-center p-8">
          <ModeIcon className="w-24 h-24 animate-spin mb-4" />
          <p className="font-black text-2xl text-white text-center animate-pulse uppercase tracking-widest">
            {settings.mode === GameMode.IMPOSTOR ? 'Infiltrando...' : 'Rastreado...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
