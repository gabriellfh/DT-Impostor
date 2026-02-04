
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
    <rect x="35" y="65" width="30" height="25" rx="8" fill="white" />
    <path d="M50 65 L50 90" stroke="#1a1a1a" strokeWidth="1" />
    <rect x="35" y="82" width="30" height="10" rx="3" fill="#1a1a1a" />
    <circle cx="50" cy="40" r="35" fill="#ffe0bd" />
    <path d="M15 40 Q10 5 50 5 Q90 5 85 40 L80 30 Q50 15 20 30 Z" fill="#1a1a1a" />
    <rect x="25" y="38" width="50" height="8" rx="2" fill="white" opacity="0.9" transform="rotate(-5 50 40)" />
    <circle cx="40" cy="48" r="5" fill="#1a1a1a" />
    <circle cx="65" cy="48" r="5" fill="#1a1a1a" opacity="0.4" />
    <circle cx="60" cy="72" r="2" fill="#1a1a1a" />
    <circle cx="60" cy="78" r="2" fill="#1a1a1a" />
  </svg>
);

const CountryIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-md`}>
    <g transform="translate(10, 10) scale(0.75)">
      <rect x="0" y="5" width="5" height="70" fill="#a1a1a1" rx="2" />
      <path d="M5 5 Q25 0 45 10 Q65 20 85 10 L85 50 Q65 60 45 50 Q25 40 5 50 Z" fill="#009c3b" />
      <path d="M15 27.5 L45 12.5 L75 27.5 L45 42.5 Z" fill="#ffdf00" />
      <circle cx="45" cy="27.5" r="8" fill="#002776" />
    </g>
    <g transform="translate(35, 25) scale(0.75)">
      <rect x="0" y="5" width="5" height="70" fill="#666" rx="2" />
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
      return <Ghost className={`${className} text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]`} strokeWidth={3} />;
    }
    return <Search className={`${className} text-[#FF1493] drop-shadow-[0_0_8px_rgba(255,20,147,0.5)]`} strokeWidth={4} />;
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen max-w-md mx-auto flex flex-col overflow-hidden relative">
      <header className="p-4 relative flex items-center justify-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <ModeIcon className="w-8 h-8" />
          <h1 className="text-3xl font-black text-white drop-shadow-lg tracking-tighter uppercase italic">
            {settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
          </h1>
          <ModeIcon className="w-8 h-8" />
        </div>
        {phase !== GamePhase.LOBBY && (
          <button onClick={resetGame} className="absolute right-4 bg-white/10 p-2 rounded-full hover:bg-white/30 transition-colors border border-white/10">
            <RotateCcw size={18} className="text-white" />
          </button>
        )}
      </header>

      <main className="flex-1 p-4 overflow-y-auto no-scrollbar overscroll-contain flex flex-col justify-center">
        {phase === GamePhase.LOBBY && (
          <div className="space-y-4 animate-in fade-in duration-500 w-full py-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-[#00FFFF]/20 rounded-full scale-150 animate-pulse" />
                <div className="bg-[#2F4F4F]/40 backdrop-blur-xl p-10 rounded-[3.5rem] border-4 border-[#8A2BE2]/50 shadow-[0_0_30px_rgba(138,43,226,0.3)] animate-bounce duration-[3000ms] relative">
                   <ModeIcon className="w-24 h-24" />
                </div>
              </div>
            </div>

            <div className="bg-[#4B0082]/30 backdrop-blur-lg rounded-[2.5rem] p-5 border border-white/10 shadow-2xl flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#00FFFF]">
                <Users className="text-[#00FFFF]" size={20} /> Amiguinhos ({players.length}/10)
              </h2>
              
              <div className="space-y-2 max-h-[30vh] overflow-y-auto no-scrollbar pr-1">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-white/5 p-2 rounded-2xl border border-white/5 transition-all group hover:bg-white/10">
                    <div className="flex items-center gap-3 flex-1">
                      <button 
                        onClick={() => openAvatarPicker(player.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl text-2xl hover:bg-[#8A2BE2]/40 transition-all shrink-0"
                      >
                        {player.avatar}
                      </button>
                      
                      {editingId === player.id ? (
                        <input
                          autoFocus
                          className="bg-transparent border-b-2 border-[#00FFFF] text-white font-bold text-base w-full outline-none"
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
                    <button onClick={() => removePlayer(player.id)} className="text-white/20 hover:text-[#FF1493] p-2 shrink-0 transition-colors">
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
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#00FFFF] text-white placeholder:text-white/20 font-bold"
                  />
                  <button onClick={addPlayer} className="bg-[#00FFFF] text-[#4B0082] w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center shrink-0 active:scale-95 transition-transform">
                    <Plus size={24} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#4B0082]/30 backdrop-blur-lg rounded-[2.5rem] p-6 border border-white/10 shadow-2xl space-y-4">
              <div className="bg-[#2F4F4F]/50 backdrop-blur-md rounded-[2rem] p-1 border border-white/10 flex shadow-inner">
                <button 
                  onClick={() => setGameMode(GameMode.IMPOSTOR)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.8rem] font-black transition-all ${settings.mode === GameMode.IMPOSTOR ? 'bg-[#FF1493] text-white shadow-[0_0_15px_rgba(255,20,147,0.5)]' : 'text-white hover:bg-white/5'}`}
                >
                  <Ghost size={20} /> IMPOSTOR
                </button>
                <button 
                  onClick={() => setGameMode(GameMode.SPY)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.8rem] font-black transition-all ${settings.mode === GameMode.SPY ? 'bg-[#00FFFF] text-[#4B0082] shadow-[0_0_15px_rgba(0,255,255,0.5)]' : 'text-white hover:bg-white/5'}`}
                >
                  <Search size={20} /> ESPIÃO
                </button>
              </div>

              <div className="bg-white/5 p-4 rounded-[2rem] border border-white/5 flex items-center justify-between">
                <span className="text-lg font-black text-white italic">
                   {getImpostorLabel()}
                </span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateImpostorCount(-1)} 
                    className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-20 transition-all" 
                    disabled={settings.impostorCount <= 0}
                  >
                    <Minus size={20} strokeWidth={4} />
                  </button>
                  <div className="bg-[#FF1493] text-white font-black w-10 h-10 flex items-center justify-center rounded-xl text-lg shadow-lg">
                    {settings.impostorCount}
                  </div>
                  <button 
                    onClick={() => updateImpostorCount(1)} 
                    className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-20 transition-all" 
                    disabled={settings.impostorCount >= Math.floor(players.length / 2)}
                  >
                    <Plus size={20} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={startGame} disabled={players.length < 3} className="w-full bg-gradient-to-r from-[#FF1493] via-[#8A2BE2] to-[#4B0082] py-4 rounded-[2rem] font-black text-xl text-white shadow-[0_6px_0_rgba(138,43,226,0.5)] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all disabled:opacity-40">
              <Play fill="currentColor" size={24} /> VAMOS JOGAR!
            </button>
          </div>
        )}

        {phase === GamePhase.CATEGORY_SELECTION && (
          <div className="space-y-4 animate-in slide-in-from-right-10 duration-300 w-full flex flex-col h-full overflow-hidden">
            <h2 className="text-2xl font-black text-center text-white drop-shadow-lg">Escolha o Tema!</h2>
            <div className="grid grid-cols-2 gap-3 pb-6 overflow-y-auto no-scrollbar flex-1">
              {MAIN_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => handleCategoryClick(cat)} className="bg-white/5 backdrop-blur-md p-4 rounded-[1.5rem] border-2 border-white/5 text-center transition-all hover:bg-[#8A2BE2]/20 hover:border-[#00FFFF]/30 active:scale-95 flex flex-col items-center justify-center min-h-[120px]">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F4F4F]/80 backdrop-blur-md">
            <div className="bg-[#4B0082] rounded-[3rem] w-full max-w-sm border-4 border-[#00FFFF] shadow-[0_0_50px_rgba(0,255,255,0.3)] overflow-hidden">
              <div className="p-5 border-b-4 border-white/10 flex justify-between items-center bg-[#8A2BE2]/50">
                <h3 className="text-white font-black text-xl italic uppercase tracking-wider">Mudar Avatar</h3>
                <button onClick={() => setShowAvatarPicker(false)} className="bg-[#FF1493] text-white p-2 rounded-full active:scale-90 shadow-lg">
                  <X size={20} strokeWidth={4} />
                </button>
              </div>
              <div className="p-4 grid grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto bg-[#2F4F4F]/30">
                {AVATARS.map((avatar, index) => (
                  <button key={index} onClick={() => selectAvatar(avatar)} className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center text-3xl hover:bg-[#00FFFF] hover:text-[#4B0082] transition-all">
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
              <span className="text-7xl mb-2 block filter drop-shadow-[0_0_15px_rgba(0,255,255,0.4)] animate-bounce">{players[distributionIndex].avatar}</span>
              <h2 className="text-3xl font-black text-white italic">{players[distributionIndex].name}</h2>
              <p className="text-[#00FFFF] font-bold mt-1 uppercase text-xs tracking-widest">Sua vez de olhar!</p>
            </div>
            <button onClick={() => setIsWordVisible(!isWordVisible)} className={`w-full max-w-[240px] aspect-square rounded-[3.5rem] border-8 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${isWordVisible ? 'bg-white border-[#00FFFF] scale-105 shadow-[0_0_40px_rgba(0,255,255,0.4)]' : 'bg-[#2F4F4F]/40 border-white/10'}`}>
              {isWordVisible ? (
                <div className="text-center p-4">
                  <p className="text-xs text-[#FF1493] uppercase font-black mb-2 italic">Segredo de Estado! 🤫</p>
                  <p className="text-sm font-black text-[#4B0082] mb-1 uppercase tracking-tight">
                    {players[distributionIndex].role === PlayerRole.CITIZEN ? 'VOCÊ É CIDADÃO' : settings.mode === GameMode.IMPOSTOR ? 'VOCÊ É O IMPOSTOR!' : 'VOCÊ É O ESPIÃO!'}
                  </p>
                  <p className="text-3xl font-black text-[#8A2BE2] leading-tight break-words">
                    {players[distributionIndex].word.includes('IMPOSTOR!') ? '?' : players[distributionIndex].word}
                  </p>
                  <EyeOff className="mt-6 text-[#8A2BE2]/30 mx-auto" size={32} />
                </div>
              ) : (
                <div className="text-center">
                  <Eye size={48} className="text-white/20 mx-auto mb-2" />
                  <p className="font-black text-white/30 text-lg uppercase tracking-tighter italic">Revelar Palavra</p>
                </div>
              )}
            </button>
            <button onClick={nextDistribution} disabled={!isWordVisible} className={`w-full py-4 rounded-[2rem] font-black text-lg ${isWordVisible ? 'bg-[#00FFFF] text-[#4B0082] shadow-lg active:scale-95' : 'bg-white/5 text-white/10 opacity-30 cursor-not-allowed'}`}>PRÓXIMO! ✅</button>
          </div>
        )}

        {phase === GamePhase.DISCUSSION && (
          <div className="space-y-6 py-2 w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00FFFF] to-[#8A2BE2] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-3"><MessageSquare className="text-white" size={40} /></div>
            <div>
                <h2 className="text-2xl font-black text-white italic">Hora de Falar!</h2>
                <p className="text-[#00FFFF]/70 font-bold text-sm mt-1 uppercase tracking-widest">Descreva sua palavra sem dar bandeira!</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[35vh] overflow-y-auto no-scrollbar">
              {players.filter(p => !p.isEliminated).map(p => (
                <div key={p.id} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="font-black text-white/80 text-xs truncate uppercase">{p.name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase(GamePhase.VOTING)} className="w-full bg-[#FF1493] py-4 rounded-[2rem] font-black text-lg text-white shadow-[0_5px_0_rgba(75,0,130,0.5)] active:translate-y-1 active:shadow-none transition-all">INICIAR VOTAÇÃO 🤔</button>
          </div>
        )}

        {phase === GamePhase.VOTING && (
          <div className="space-y-4 w-full h-full flex flex-col overflow-hidden">
            <h2 className="text-2xl font-black text-center text-white italic">Quem é o {settings.mode === GameMode.IMPOSTOR ? 'Culpado' : 'Suspeito'}?</h2>
            <div className="grid grid-cols-2 gap-3 pb-4 overflow-y-auto no-scrollbar flex-1">
              {players.filter(p => !p.isEliminated).map(p => (
                <button key={p.id} onClick={() => handleVote(p.id)} className="bg-white/5 p-4 rounded-[1.8rem] border-2 border-white/5 flex flex-col items-center hover:bg-[#FF1493]/20 hover:border-[#FF1493]/50 transition-all">
                  <span className="text-5xl mb-2 drop-shadow-lg">{p.avatar}</span>
                  <span className="font-black text-white text-base truncate w-full">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.REVEAL && (
          <div className="flex flex-col items-center justify-center space-y-6 py-2 w-full text-center h-full">
            <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-[#00FFFF]/40 scale-125 rounded-full animate-pulse" />
                <Trophy size={90} className="text-[#00FFFF] mx-auto mb-2 relative drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]" />
            </div>
            <div>
                <h2 className="text-xs uppercase text-[#00FFFF] font-black tracking-widest italic mb-1">Muitas palmas para</h2>
                <h3 className="text-4xl font-black text-white drop-shadow-lg leading-tight italic uppercase">{winner}</h3>
            </div>
            <div className="w-full space-y-2 max-h-[30vh] overflow-y-auto no-scrollbar">
              {players.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded-[1.5rem] border-2 transition-all ${p.role !== PlayerRole.CITIZEN ? 'bg-[#FF1493]/20 border-[#FF1493] shadow-[0_0_10px_rgba(255,20,147,0.2)]' : 'bg-white/5 border-white/5 opacity-80'}`}>
                  <div className="flex items-center gap-3"><span className="text-2xl">{p.avatar}</span><span className="font-black text-white text-sm">{p.name}</span></div>
                  <div className="text-right">
                    <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full ${p.role !== PlayerRole.CITIZEN ? 'bg-[#FF1493] text-white' : 'bg-white/10 text-white/50'}`}>
                      {p.role === PlayerRole.CITIZEN ? 'CIDADÃO' : settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
                    </span>
                    <p className="text-xs font-bold text-[#00FFFF] mt-0.5 italic">{p.word.includes('IMPOSTOR!') ? '?' : p.word}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={resetGame} className="w-full bg-gradient-to-r from-[#00FFFF] to-[#8A2BE2] text-[#4B0082] py-4 rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">NOVO ROUND! 🎈</button>
          </div>
        )}
      </main>

      {isLoading && (
        <div className="absolute inset-0 bg-[#4B0082]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8 transition-all">
          <div className="relative mb-6">
              <div className="absolute inset-0 blur-2xl bg-[#00FFFF]/50 animate-pulse rounded-full" />
              <ModeIcon className="w-24 h-24 animate-spin relative" />
          </div>
          <p className="font-black text-2xl text-white text-center animate-pulse uppercase tracking-[0.2em] italic drop-shadow-md">
            {settings.mode === GameMode.IMPOSTOR ? 'Criando Caos...' : 'Sincronizando...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
