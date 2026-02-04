
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

  const handleBack = () => {
    if (phase === GamePhase.CATEGORY_SELECTION) {
      setPhase(GamePhase.LOBBY);
    } else if (phase === GamePhase.WORD_DISTRIBUTION) {
      setPhase(GamePhase.CATEGORY_SELECTION);
    } else {
      resetGame();
    }
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
    if (cat.id === 'random') {
      const validCategories = MAIN_CATEGORIES.filter(c => c.id !== 'random');
      const randomCat = validCategories[Math.floor(Math.random() * validCategories.length)];
      setupWords(randomCat.name);
    } else {
      setupWords(cat.name);
    }
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
    if (id === 'anime') return <SamuraiIcon className="w-12 h-12" />;
    if (id === 'countries') return <CountryIcon className="w-12 h-12" />;
    return <div className="text-3xl">{icon}</div>;
  };

  const ModeIcon = ({ className = "w-10 h-10" }: { className?: string }) => {
    if (settings.mode === GameMode.IMPOSTOR) {
      return <Ghost className={`${className} text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]`} strokeWidth={3} />;
    }
    return <Search className={`${className} text-[#FF1493] drop-shadow-[0_0_8px_rgba(255,20,147,0.5)]`} strokeWidth={4} />;
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen max-w-md mx-auto flex flex-col overflow-hidden relative">
      <header className="p-2 pt-4 relative flex items-center justify-center z-10 shrink-0">
        {phase !== GamePhase.LOBBY && (
          <button onClick={handleBack} className="absolute left-4 bg-white/10 p-2 rounded-full hover:bg-white/30 transition-colors border border-white/10">
            <ChevronLeft size={20} className="text-white" strokeWidth={3} />
          </button>
        )}
        <div className="flex items-center gap-3">
          <ModeIcon className="w-7 h-7" />
          <h1 className="text-2xl font-arcadia text-white drop-shadow-lg">
            {settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
          </h1>
          <ModeIcon className="w-7 h-7" />
        </div>
      </header>

      <main className="flex-1 px-4 py-1 overflow-hidden flex flex-col">
        {phase === GamePhase.LOBBY && (
          <div className="h-full flex flex-col justify-start gap-3 animate-in fade-in duration-500 py-2 overflow-hidden">
            {/* Configurações de Modo (Sem a Box de fundo) */}
            <div className="space-y-2 flex-shrink-0">
              <div className="bg-[#2F4F4F]/50 backdrop-blur-md rounded-[1.5rem] p-1 border border-white/10 flex shadow-inner">
                <button 
                  onClick={() => setGameMode(GameMode.IMPOSTOR)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.2rem] font-arcadia text-xs transition-all ${settings.mode === GameMode.IMPOSTOR ? 'bg-[#FF1493] text-white shadow-[0_0_10px_rgba(255,20,147,0.4)]' : 'text-white hover:bg-white/5'}`}
                >
                  <Ghost size={14} /> IMPOSTOR
                </button>
                <button 
                  onClick={() => setGameMode(GameMode.SPY)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.2rem] font-arcadia text-xs transition-all ${settings.mode === GameMode.SPY ? 'bg-[#00FFFF] text-[#4B0082] shadow-[0_0_10px_rgba(0,255,255,0.4)]' : 'text-white hover:bg-white/5'}`}
                >
                  <Search size={14} /> ESPIÃO
                </button>
              </div>

              <div className="bg-white/5 p-3 rounded-[1.5rem] border border-white/5 flex items-center justify-between">
                <span className="text-sm font-arcadia text-white">
                   {getImpostorLabel()}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateImpostorCount(-1)} 
                    className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-20 transition-all" 
                    disabled={settings.impostorCount <= 0}
                  >
                    <Minus size={16} strokeWidth={4} />
                  </button>
                  <div className="bg-[#FF1493] font-arcadia text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm shadow-md">
                    {settings.impostorCount}
                  </div>
                  <button 
                    onClick={() => updateImpostorCount(1)} 
                    className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-full active:scale-90 disabled:opacity-20 transition-all" 
                    disabled={settings.impostorCount >= Math.floor(players.length / 2)}
                  >
                    <Plus size={16} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Jogadores (Centralizada) */}
            <div className="bg-[#4B0082]/30 backdrop-blur-lg rounded-[2rem] p-4 border border-white/10 shadow-xl flex flex-col flex-grow min-h-0 overflow-hidden">
              <h2 className="text-sm font-bold mb-2 flex items-center gap-2 text-[#00FFFF]">
                <Users className="text-[#00FFFF]" size={16} /> Amiguinhos ({players.length}/10)
              </h2>
              
              <div className="space-y-1 overflow-y-auto no-scrollbar pr-1 flex-grow min-h-0">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between bg-white/5 p-1.5 rounded-xl border border-white/5 transition-all group hover:bg-white/10">
                    <div className="flex items-center gap-2 flex-1">
                      <button 
                        onClick={() => openAvatarPicker(player.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-xl hover:bg-[#8A2BE2]/40 transition-all shrink-0"
                      >
                        {player.avatar}
                      </button>
                      
                      {editingId === player.id ? (
                        <input
                          autoFocus
                          className="bg-transparent border-b border-[#00FFFF] text-white font-bold text-sm w-full outline-none"
                          value={player.name}
                          onChange={(e) => updatePlayerName(player.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                        />
                      ) : (
                        <div onClick={() => setEditingId(player.id)} className="flex items-center gap-2 cursor-pointer flex-1">
                          <span className="font-bold text-white text-sm truncate">{player.name}</span>
                          <Edit2 size={10} className="text-white/20" />
                        </div>
                      )}
                    </div>
                    <button onClick={() => removePlayer(player.id)} className="text-white/20 hover:text-[#FF1493] p-1.5 shrink-0 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-1 relative">
                  <input 
                    type="text" 
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    placeholder="Novo amigo..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#00FFFF] text-white placeholder:text-white/20 font-bold text-sm"
                  />
                  <button onClick={addPlayer} className="bg-[#FF1493] text-white w-10 h-10 rounded-xl shadow-lg flex items-center justify-center shrink-0 active:scale-95 transition-transform">
                    <Plus size={20} strokeWidth={4} />
                  </button>
                </div>
              </div>
            </div>

            {/* Botão Jogar (Fixo na Base) */}
            <button onClick={startGame} disabled={players.length < 3} className="w-full bg-gradient-to-r from-[#FF1493] via-[#8A2BE2] to-[#4B0082] py-4 rounded-[1.5rem] font-black text-xl text-white shadow-[0_4px_0_rgba(138,43,226,0.4)] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 shrink-0">
              <Play fill="currentColor" size={24} /> VAMOS JOGAR!
            </button>
          </div>
        )}

        {phase === GamePhase.CATEGORY_SELECTION && (
          <div className="space-y-3 animate-in slide-in-from-right-10 duration-300 w-full flex flex-col h-full overflow-hidden">
            <h2 className="text-xl font-black text-center text-white drop-shadow-lg">Escolha o Tema!</h2>
            <div className="grid grid-cols-2 gap-2 pb-4 overflow-y-auto no-scrollbar flex-1">
              {MAIN_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => handleCategoryClick(cat)} className="bg-white/5 backdrop-blur-md p-3 rounded-[1.2rem] border-2 border-white/5 text-center transition-all hover:bg-[#8A2BE2]/20 hover:border-[#00FFFF]/30 active:scale-95 flex flex-col items-center justify-center min-h-[90px]">
                  <div className="mb-1">
                    {renderCategoryIcon(cat.id, cat.icon)}
                  </div>
                  <div className="font-black text-xs text-white">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F4F4F]/80 backdrop-blur-md">
            <div className="bg-[#4B0082] rounded-[2.5rem] w-full max-w-xs border-3 border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden">
              <div className="p-4 border-b-2 border-white/10 flex justify-between items-center bg-[#8A2BE2]/50">
                <h3 className="text-white font-black text-lg uppercase tracking-wider">Avatar</h3>
                <button onClick={() => setShowAvatarPicker(false)} className="bg-[#FF1493] text-white p-1.5 rounded-full active:scale-90 shadow-lg">
                  <X size={18} strokeWidth={4} />
                </button>
              </div>
              <div className="p-3 grid grid-cols-5 gap-2 max-h-[40vh] overflow-y-auto bg-[#2F4F4F]/30 no-scrollbar">
                {AVATARS.map((avatar, index) => (
                  <button key={index} onClick={() => selectAvatar(avatar)} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center text-2xl hover:bg-[#00FFFF] hover:text-[#4B0082] transition-all">
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === GamePhase.WORD_DISTRIBUTION && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-2 w-full">
            <div className="text-center">
              <span className="text-6xl mb-1 block filter drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">{players[distributionIndex].avatar}</span>
              <h2 className="text-2xl font-black text-white italic">{players[distributionIndex].name}</h2>
              <p className="text-[#00FFFF] font-bold mt-1 uppercase text-[10px] tracking-widest">Sua vez de olhar!</p>
            </div>
            <button onClick={() => setIsWordVisible(!isWordVisible)} className={`w-full max-w-[200px] aspect-square rounded-[3rem] border-6 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${isWordVisible ? 'bg-white border-[#00FFFF] scale-105 shadow-[0_0_30px_rgba(0,255,255,0.3)]' : 'bg-[#2F4F4F]/40 border-white/10'}`}>
              {isWordVisible ? (
                <div className="text-center p-3">
                  <p className="text-[10px] text-[#FF1493] uppercase font-black mb-1 italic">Segredo! 🤫</p>
                  <p className="text-[10px] font-arcadia text-[#4B0082] mb-1">
                    {players[distributionIndex].role === PlayerRole.CITIZEN ? 'CIDADÃO' : settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
                  </p>
                  <p className="text-xl font-black text-[#8A2BE2] leading-tight break-words">
                    {players[distributionIndex].word.includes('IMPOSTOR!') ? '?' : players[distributionIndex].word}
                  </p>
                  <EyeOff className="mt-4 text-[#8A2BE2]/30 mx-auto" size={24} />
                </div>
              ) : (
                <div className="text-center">
                  <Eye size={40} className="text-white/20 mx-auto mb-1" />
                  <p className="font-arcadia text-white/30 text-sm">Revelar</p>
                </div>
              )}
            </button>
            <button onClick={nextDistribution} disabled={!isWordVisible} className={`w-full py-3 rounded-[1.5rem] font-black text-base ${isWordVisible ? 'bg-[#00FFFF] text-[#4B0082] shadow-md active:scale-95' : 'bg-white/5 text-white/10 opacity-30 cursor-not-allowed'}`}>PRÓXIMO! ✅</button>
          </div>
        )}

        {phase === GamePhase.DISCUSSION && (
          <div className="space-y-4 py-2 w-full text-center flex flex-col h-full justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00FFFF] to-[#8A2BE2] rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl rotate-3"><MessageSquare className="text-white" size={32} /></div>
            <div>
                <h2 className="text-xl font-black text-white italic">Hora de Falar!</h2>
                <p className="text-[#00FFFF]/70 font-bold text-[10px] mt-1 uppercase tracking-widest">Descreva sem dar bandeira!</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto no-scrollbar">
              {players.filter(p => !p.isEliminated).map(p => (
                <div key={p.id} className="bg-white/5 p-2 rounded-xl border border-white/5 flex items-center gap-2">
                    <span className="text-xl">{p.avatar}</span>
                    <span className="font-black text-white/80 text-[10px] truncate uppercase">{p.name}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase(GamePhase.VOTING)} className="w-full bg-[#FF1493] py-3.5 rounded-[1.5rem] font-black text-base text-white shadow-lg active:translate-y-1 transition-all">VOTAÇÃO 🤔</button>
          </div>
        )}

        {phase === GamePhase.VOTING && (
          <div className="space-y-3 w-full h-full flex flex-col overflow-hidden">
            <h2 className="text-xl font-black text-center text-white italic">Quem é o {settings.mode === GameMode.IMPOSTOR ? 'Culpado' : 'Suspeito'}?</h2>
            <div className="grid grid-cols-2 gap-2 pb-4 overflow-y-auto no-scrollbar flex-1">
              {players.filter(p => !p.isEliminated).map(p => (
                <button key={p.id} onClick={() => handleVote(p.id)} className="bg-white/5 p-3 rounded-[1.5rem] border-2 border-white/5 flex flex-col items-center hover:bg-[#FF1493]/20 hover:border-[#FF1493]/50 transition-all">
                  <span className="text-4xl mb-1">{p.avatar}</span>
                  <span className="font-black text-white text-xs truncate w-full">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === GamePhase.REVEAL && (
          <div className="flex flex-col items-center justify-center space-y-4 py-2 w-full text-center h-full">
            <div className="relative">
                <Trophy size={70} className="text-[#00FFFF] mx-auto mb-1 relative drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]" />
            </div>
            <div>
                <h2 className="text-[10px] uppercase text-[#00FFFF] font-black tracking-widest italic mb-0.5">Parabéns</h2>
                <h3 className="text-3xl font-arcadia text-white drop-shadow-lg">{winner}</h3>
            </div>
            <div className="w-full space-y-1.5 max-h-[35vh] overflow-y-auto no-scrollbar">
              {players.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-2 rounded-[1.2rem] border-2 transition-all ${p.role !== PlayerRole.CITIZEN ? 'bg-[#FF1493]/20 border-[#FF1493]' : 'bg-white/5 border-white/5 opacity-80'}`}>
                  <div className="flex items-center gap-2"><span className="text-xl">{p.avatar}</span><span className="font-black text-white text-[10px]">{p.name}</span></div>
                  <div className="text-right">
                    <span className={`text-[7px] uppercase font-arcadia px-1.5 py-0.5 rounded-full ${p.role !== PlayerRole.CITIZEN ? 'bg-[#FF1493] text-white' : 'bg-white/10 text-white/50'}`}>
                      {p.role === PlayerRole.CITIZEN ? 'CIDADÃO' : settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
                    </span>
                    <p className="text-[10px] font-bold text-[#00FFFF] mt-0.5 italic">{p.word.includes('IMPOSTOR!') ? '?' : p.word}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={resetGame} className="w-full bg-gradient-to-r from-[#00FFFF] to-[#8A2BE2] text-[#4B0082] py-3.5 rounded-[1.5rem] font-black text-lg shadow-xl active:scale-95 transition-all">NOVO ROUND! 🎈</button>
          </div>
        )}
      </main>

      {isLoading && (
        <div className="absolute inset-0 bg-[#4B0082]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 transition-all">
          <div className="relative mb-4">
              <ModeIcon className="w-16 h-16 animate-spin relative" />
          </div>
          <p className="font-arcadia text-xl text-white text-center animate-pulse">
            {settings.mode === GameMode.IMPOSTOR ? 'Criando Caos...' : 'Sincronizando...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
