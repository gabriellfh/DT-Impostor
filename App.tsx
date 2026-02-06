import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare, 
  Trophy,
  X,
  Edit2,
  Ghost,
  Search,
  ChevronLeft,
  Clock,
  Skull,
  Zap,
  HelpCircle
} from 'lucide-react';

const AVATAR_COLORS = [
  // Vermelhos e Rosas
  '#FF0000', '#DC2626', '#B91C1C', '#991B1B', '#F87171',
  '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#F472B6',
  '#FF1493', '#FF69B4', '#FFB6C1', '#C71585', '#E11D48',
  
  // Laranjas e Amarelos
  '#FF4500', '#F97316', '#EA580C', '#C2410C', '#FB923C',
  '#FFA500', '#FACC15', '#EAB308', '#CA8A04', '#A16207',
  '#FFD700', '#FFF700', '#FF8C00', '#ED8936', '#F6AD55',
  
  // Verdes
  '#00FF00', '#22C55E', '#16A34A', '#15803D', '#4ADE80',
  '#008000', '#10B981', '#059669', '#047857', '#34D399',
  '#32CD32', '#9ACD32', '#ADFF2F', '#00FF7F', '#00FA9A',
  
  // Azuis e Cianos
  '#00FFFF', '#06B6D4', '#0891B2', '#0E7490', '#22D3EE',
  '#00BFFF', '#3B82F6', '#2563EB', '#1D4ED8', '#60A5FA',
  '#0000FF', '#0000CD', '#00008B', '#1E90FF', '#4169E1',
  '#14B8A6', '#0D9488', '#0F766E', '#2DD4BF', '#5EEAD4',
  
  // Roxos e Violetas
  '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#A78BFA',
  '#800080', '#A855F7', '#9333EA', '#7E22CE', '#C084FC',
  '#4B0082', '#9400D3', '#8A2BE2', '#DA70D6', '#BA55D3',
  
  // Tons de Marrom e Neutros
  '#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460',
  '#78350F', '#92400E', '#B45309', '#D97706', '#F59E0B',
  
  // Grises e Escuros
  '#64748B', '#475569', '#334155', '#1E293B', '#0F172A',
  '#71717A', '#52525B', '#3F3F46', '#27272A', '#18181B',
  '#808080', '#A9A9A9', '#C0C0C0', '#2F4F4F', '#000000'
];

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

const MiniPersonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="8">
    <circle cx="50" cy="35" r="20" />
    <path d="M20 85 Q20 60 50 60 Q80 60 80 85" strokeLinecap="round" />
  </svg>
);

const FrameIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="8">
    <rect x="15" y="25" width="70" height="50" rx="4" />
    <path d="M30 40 L70 60 M30 60 L70 40" strokeWidth="6" opacity="0.3" />
    <circle cx="15" cy="25" r="7" fill="currentColor" stroke="none" />
    <circle cx="85" cy="25" r="7" fill="currentColor" stroke="none" />
    <circle cx="15" cy="75" r="7" fill="currentColor" stroke="none" />
    <circle cx="85" cy="75" r="7" fill="currentColor" stroke="none" />
  </svg>
);

const FloatingEmojis = ({ mysteryOnly = false }: { mysteryOnly?: boolean }) => {
  const emojis = mysteryOnly ? ['?', '🔍', '🤔', '🤫', '🕯️', '👀'] : ['🕵️', '👻', '🤫', '🔎', '💀', '🤡', '👽', '👺'];
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 20,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2,
    }));
    setParticles(initialParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animation: `float ${p.duration}s infinite ease-in-out`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(10deg); }
          50% { transform: translate(-5px, -30px) rotate(-10deg); }
          75% { transform: translate(-15px, -15px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

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
  const [votingIndex, setVotingIndex] = useState(0);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [voteCountMap, setVoteCountMap] = useState<Record<string, number>>({});
  
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'avatar' | 'bg'>('avatar');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  useEffect(() => {
    setPlayers([
      { id: '1', name: 'GabrielH', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[0], avatarColor: AVATAR_COLORS[0] },
      { id: '2', name: 'Amigo 1', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[1], avatarColor: AVATAR_COLORS[1] },
      { id: '3', name: 'Amigo 2', role: PlayerRole.CITIZEN, word: '', isEliminated: false, avatar: AVATARS[2], avatarColor: AVATAR_COLORS[2] }
    ]);
  }, []);

  useEffect(() => {
    let interval: any;
    if (phase === GamePhase.TIMER) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPlayerName.trim(),
        role: PlayerRole.CITIZEN,
        word: '',
        isEliminated: false,
        avatar: AVATARS[players.length % AVATARS.length],
        avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length]
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
    setPickerTab('avatar');
    setShowAvatarPicker(true);
  };

  const selectAvatar = (avatar: string) => {
    if (activePlayerId) {
      setPlayers(players.map(p => p.id === activePlayerId ? { ...p, avatar } : p));
    }
  };

  const selectColor = (color: string) => {
    if (activePlayerId) {
      setPlayers(players.map(p => p.id === activePlayerId ? { ...p, avatarColor: color } : p));
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
      setPhase(GamePhase.TIMER);
    }
  };

  const startAppVoting = () => {
    setVotingIndex(0);
    setVoteCountMap({});
    setSelectedSuspectId(null);
    setPhase(GamePhase.VOTING_SEQUENCE);
  };

  const recordVoteAndNext = () => {
    if (!selectedSuspectId) return;

    const newMap = { ...voteCountMap };
    newMap[selectedSuspectId] = (newMap[selectedSuspectId] || 0) + 1;
    setVoteCountMap(newMap);

    const activePlayers = players.filter(p => !p.isEliminated);
    if (votingIndex < activePlayers.length - 1) {
      setVotingIndex(votingIndex + 1);
      setSelectedSuspectId(null);
    } else {
      processVotingResults(newMap);
    }
  };

  const processVotingResults = (votes: Record<string, number>) => {
    let mostVotedId = '';
    let maxVotes = -1;

    Object.entries(votes).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVotedId = id;
      }
    });

    if (mostVotedId) {
      handleVote(mostVotedId);
    } else {
      resetGame();
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
      setPhase(GamePhase.VOTING);
    }
  };

  const finishGameFriends = () => {
    setWinner('FIM DO JOGO');
    setPhase(GamePhase.REVEAL);
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
    } else if (phase === GamePhase.DECISION) {
      setPhase(GamePhase.TIMER);
    } else if (phase === GamePhase.GUESS_FRIENDS || phase === GamePhase.VOTING_SEQUENCE) {
      setPhase(GamePhase.DECISION);
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

  const HeaderGhost = ({ className = "w-7 h-7" }: { className?: string }) => (
    <Ghost className={`${className} text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]`} strokeWidth={3} />
  );

  const activePlayers = players.filter(p => !p.isEliminated);
  const currentVoter = activePlayers[votingIndex];

  return (
    <div className="h-screen h-[100dvh] max-h-screen max-w-md mx-auto flex flex-col overflow-hidden relative">
      <header className="p-2 pt-4 relative flex items-center justify-center z-10 shrink-0">
        {phase !== GamePhase.LOBBY && (
          <button onClick={handleBack} className="absolute left-4 bg-white/10 p-2 rounded-full hover:bg-white/30 transition-colors border border-white/10">
            <ChevronLeft size={20} className="text-white" strokeWidth={3} />
          </button>
        )}
        <div className="flex items-center gap-3">
          <HeaderGhost />
          <h1 className="text-2xl font-arcadia text-white drop-shadow-lg">
            IMPOSTOR
          </h1>
          <HeaderGhost />
        </div>
      </header>

      <main className="flex-1 px-4 py-1 overflow-hidden flex flex-col relative">
        {phase === GamePhase.LOBBY && (
          <div className="h-full flex flex-col justify-start gap-3 animate-in fade-in duration-500 py-2 overflow-hidden">
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
                        className="w-10 h-10 flex items-center justify-center rounded-full text-xl hover:opacity-80 transition-all shrink-0 shadow-lg border-2 border-white/10"
                        style={{ backgroundColor: player.avatarColor || '#333' }}
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
                          <span className="font-bold text-white text-sm truncate uppercase tracking-tight">{player.name}</span>
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

            <button onClick={startGame} disabled={players.length < 3} className="w-full bg-[#FF1493] py-4 rounded-[1.5rem] font-black text-xl text-white flex items-center justify-center gap-3 active:translate-y-1 transition-all disabled:opacity-40 shrink-0">
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

        {phase === GamePhase.WORD_DISTRIBUTION && (
          <div className="h-full flex flex-col py-2 w-full relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">
                <span className="font-arcadia text-[10px] text-[#00FFFF] tracking-widest">
                  {distributionIndex + 1}/{players.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-center">
                <span 
                  className="text-6xl mb-1 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20"
                  style={{ backgroundColor: players[distributionIndex].avatarColor || '#333' }}
                >
                  {players[distributionIndex].avatar}
                </span>
                <h2 className="text-2xl font-black text-white italic mt-2 uppercase tracking-tighter">{players[distributionIndex].name}</h2>
              </div>
              <button 
                onClick={() => setIsWordVisible(!isWordVisible)} 
                className={`w-[92%] max-w-[360px] aspect-square rounded-[3.5rem] border-6 border-dashed flex flex-col items-center justify-center transition-all duration-500 overflow-hidden ${isWordVisible ? 'bg-white border-[#00FFFF] scale-100 shadow-[0_0_40px_rgba(0,255,255,0.4)]' : 'bg-[#2F4F4F]/40 border-white/10'}`}
              >
                {isWordVisible ? (
                  <div className="text-center p-6 w-full flex flex-col items-center justify-center h-full">
                    <p 
                      className="text-xl xs:text-2xl font-arcadia mb-6 uppercase tracking-widest shrink-0 font-bold"
                      style={{ color: players[distributionIndex].role === PlayerRole.CITIZEN ? '#48cae4' : '#dd2d4a' }}
                    >
                      {players[distributionIndex].role === PlayerRole.CITIZEN ? 'CIDADÃO' : (settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO')}
                    </p>
                    <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                      <p 
                        className="text-5xl xs:text-7xl font-black leading-[1.1] break-words px-2 text-center max-h-full overflow-hidden hyphens-auto drop-shadow-sm"
                        style={{ color: players[distributionIndex].word.includes('IMPOSTOR!') ? '#dd2d4a' : '#8A2BE2' }}
                      >
                        {players[distributionIndex].word.includes('IMPOSTOR!') ? '?' : players[distributionIndex].word}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Eye size={56} className="text-white/20 mx-auto mb-3" />
                    <p className="font-arcadia text-white/30 text-xl uppercase tracking-[0.2em] font-bold">Revelar</p>
                  </div>
                )}
              </button>
            </div>
            
            <button 
              onClick={nextDistribution} 
              disabled={!isWordVisible} 
              className={`w-full py-4 rounded-[1.5rem] font-black text-xl active:translate-y-1 transition-all flex items-center justify-center shrink-0 ${isWordVisible ? 'bg-[#00FFFF] text-[#4B0082]' : 'bg-white/5 text-white/10 opacity-30 cursor-not-allowed'}`}
            >
              {distributionIndex === players.length - 1 ? 'PRONTO' : 'PRÓXIMO'}
            </button>
          </div>
        )}

        {phase === GamePhase.TIMER && (
          <div className="h-full flex flex-col py-4 w-full relative animate-in zoom-in duration-500 overflow-hidden">
            <FloatingEmojis />
            
            <div className="flex-1 flex flex-col items-center justify-start pt-8 z-10">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 mb-12">
                <Clock size={40} className="text-[#00FFFF] animate-pulse" />
                <span className="text-6xl font-arcadia font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  {formatTime(timerSeconds)}
                </span>
                <p className="text-[#00FFFF] font-bold text-xs uppercase tracking-widest text-center max-w-[150px]">
                  Fale sobre sua palavra sem revelar!
                </p>
              </div>

              <div className="flex-1"></div>
            </div>

            <button 
              onClick={() => setPhase(GamePhase.DECISION)} 
              className="w-full bg-[#FF1493] py-4 rounded-[1.5rem] font-black text-2xl text-white flex items-center justify-center gap-3 active:translate-y-1 transition-all z-10"
            >
              ADIVINHAR
            </button>
          </div>
        )}

        {phase === GamePhase.DECISION && (
          <div className="h-full flex flex-col items-center justify-center w-full relative animate-in fade-in duration-500 overflow-hidden px-4">
            <div className="flex flex-col items-center justify-center gap-16 w-full max-w-sm">
               <button 
                  onClick={() => setPhase(GamePhase.GUESS_FRIENDS)} 
                  className="w-full bg-[#FF1493] py-6 rounded-[1.8rem] font-black text-2xl text-white flex items-center justify-center shadow-[0_10px_30px_rgba(255,20,147,0.3)] active:scale-95 transition-all uppercase tracking-tighter"
                >
                  Adivinhar entre Amigos
                </button>
                <button 
                  onClick={startAppVoting} 
                  className="w-full bg-[#FF1493] py-6 rounded-[1.8rem] font-black text-2xl text-white flex items-center justify-center shadow-[0_10px_30px_rgba(255,20,147,0.3)] active:scale-95 transition-all uppercase tracking-tighter"
                >
                  Adivinhar na App
                </button>
            </div>
          </div>
        )}

        {phase === GamePhase.GUESS_FRIENDS && (
          <div className="h-full flex flex-col items-center justify-center w-full relative animate-in fade-in duration-500 overflow-hidden px-4">
            <FloatingEmojis mysteryOnly={true} />
            <div className="flex-1 flex flex-col items-center justify-center w-full z-10 gap-8">
              <p className="text-white/40 font-arcadia text-xs uppercase tracking-[0.3em] text-center max-w-[200px] leading-relaxed">
                Cliquem quando estiverem prontos!
              </p>
              <button 
                onClick={finishGameFriends}
                className="w-full bg-[#00FFFF] text-[#4B0082] py-6 rounded-[1.8rem] font-black text-3xl shadow-[0_15px_40px_rgba(0,255,255,0.4)] active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-4 group"
              >
                REVELAR
              </button>
            </div>
          </div>
        )}

        {phase === GamePhase.VOTING_SEQUENCE && currentVoter && (
          <div className="h-full flex flex-col py-2 w-full relative overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="absolute top-2 right-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">
                <span className="font-arcadia text-[10px] text-[#FF1493] tracking-widest">
                  {votingIndex + 1}/{activePlayers.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col items-center pt-10">
              <p className="text-[#FF1493] font-arcadia text-2xl uppercase tracking-tighter italic mb-4">Quem é o Impostor?</p>
              
              <div className="flex flex-col items-center gap-2 mb-8">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: currentVoter.avatarColor || '#333' }}
                >
                  {currentVoter.avatar}
                </div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-widest">{currentVoter.name}</h2>
                <p className="text-white/40 text-[10px] uppercase font-bold">É a sua vez de votar!</p>
              </div>

              <div className="w-full flex-1 overflow-y-auto no-scrollbar px-2">
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.2em] mb-3 ml-2">Suspeitos:</p>
                <div className="grid grid-cols-2 gap-2 pb-6">
                  {activePlayers.map(suspect => (
                    <button 
                      key={suspect.id} 
                      onClick={() => setSelectedSuspectId(suspect.id)}
                      className={`p-3 rounded-[1.5rem] border-2 flex flex-col items-center transition-all ${selectedSuspectId === suspect.id ? 'bg-[#FF1493]/30 border-[#FF1493] scale-105 shadow-[0_0_20px_rgba(255,20,147,0.3)]' : 'bg-white/5 border-white/5 opacity-80'}`}
                    >
                      <span 
                        className="text-3xl mb-1 w-12 h-12 flex items-center justify-center rounded-full shadow-md border border-white/10"
                        style={{ backgroundColor: suspect.avatarColor || '#333' }}
                      >
                        {suspect.avatar}
                      </span>
                      <span className="font-black text-white text-[10px] truncate w-full text-center uppercase tracking-tight">{suspect.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={recordVoteAndNext} 
              disabled={!selectedSuspectId} 
              className={`w-full py-4 rounded-[1.5rem] font-black text-xl active:translate-y-1 transition-all flex items-center justify-center shrink-0 ${selectedSuspectId ? 'bg-[#00FFFF] text-[#4B0082]' : 'bg-white/5 text-white/10 opacity-30 cursor-not-allowed'}`}
            >
              {votingIndex === activePlayers.length - 1 ? 'PRONTO' : 'PRÓXIMO'}
            </button>
          </div>
        )}

        {phase === GamePhase.VOTING && (
          <div className="space-y-3 w-full h-full flex flex-col overflow-hidden">
            <h2 className="text-xl font-black text-center text-white italic">Quem é o {settings.mode === GameMode.IMPOSTOR ? 'Culpado' : 'Suspeito'}?</h2>
            <div className="grid grid-cols-2 gap-2 pb-4 overflow-y-auto no-scrollbar flex-1">
              {players.filter(p => !p.isEliminated).map(p => (
                <button key={p.id} onClick={() => handleVote(p.id)} className="bg-white/5 p-3 rounded-[1.5rem] border-2 border-white/5 flex flex-col items-center hover:bg-[#FF1493]/20 hover:border-[#FF1493]/50 transition-all">
                  <span 
                    className="text-4xl mb-1 w-16 h-16 flex items-center justify-center rounded-full shadow-xl border-2 border-white/10"
                    style={{ backgroundColor: p.avatarColor || '#333' }}
                  >
                    {p.avatar}
                  </span>
                  <span className="font-black text-white text-xs truncate w-full uppercase tracking-tighter">{p.name}</span>
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
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xl w-8 h-8 flex items-center justify-center rounded-full shadow-sm border border-white/10"
                      style={{ backgroundColor: p.avatarColor || '#333' }}
                    >
                      {p.avatar}
                    </span>
                    <span className="font-black text-white text-[10px] uppercase">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[7px] uppercase font-arcadia px-1.5 py-0.5 rounded-full ${p.role !== PlayerRole.CITIZEN ? 'bg-[#FF1493] text-white' : 'bg-white/10 text-white/50'}`}>
                      {p.role === PlayerRole.CITIZEN ? 'CIDADÃO' : settings.mode === GameMode.IMPOSTOR ? 'IMPOSTOR' : 'ESPIÃO'}
                    </span>
                    <p className="text-[10px] font-bold text-[#00FFFF] mt-0.5 italic uppercase">{p.word.includes('IMPOSTOR!') ? '?' : p.word}</p>
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
              <HeaderGhost className="w-16 h-16 animate-spin relative" />
          </div>
          <p className="font-arcadia text-xl text-white text-center animate-pulse">
            {settings.mode === GameMode.IMPOSTOR ? 'Criando Caos...' : 'Sincronizando...'}
          </p>
        </div>
      )}

      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2F4F4F]/80 backdrop-blur-md">
          <div className="bg-[#4B0082] rounded-[2.5rem] w-full max-w-[340px] border-3 border-[#00FFFF] shadow-[0_0_40px_rgba(0,255,255,0.3)] overflow-hidden flex flex-col">
            <div className="flex bg-[#8A2BE2]/40 relative items-stretch border-b border-white/10">
              <button 
                onClick={() => setPickerTab('avatar')}
                className={`flex-1 pt-7 pb-5 px-4 flex items-center justify-center gap-2 transition-all ${pickerTab === 'avatar' ? 'bg-white/10 border-b-2 border-[#00FFFF]' : 'opacity-40 hover:opacity-100'}`}
              >
                <MiniPersonIcon className="w-5 h-5 text-white" />
                <h3 className="text-white font-black text-sm uppercase tracking-wider">Avatar</h3>
              </button>
              
              <button 
                onClick={() => setPickerTab('bg')}
                className={`flex-1 pt-7 pb-5 px-4 flex items-center justify-center gap-2 transition-all ${pickerTab === 'bg' ? 'bg-white/10 border-b-2 border-[#00FFFF]' : 'opacity-40 hover:opacity-100'}`}
              >
                <FrameIcon className="w-5 h-5 text-white" />
                <h3 className="text-white font-black text-sm uppercase tracking-wider">Fundo</h3>
              </button>

              <button 
                onClick={() => setShowAvatarPicker(false)} 
                className="absolute top-2 right-2 bg-[#FF1493] text-white w-9 h-9 rounded-full active:scale-90 shadow-lg border-2 border-white/30 z-20 flex items-center justify-center transition-transform hover:rotate-90"
              >
                <X size={20} strokeWidth={4} />
              </button>
            </div>

            <div className="p-4 bg-[#2F4F4F]/40 flex flex-col gap-5">
              <div className="flex items-center justify-center py-6 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-2xl border-3 border-white/20 transition-all duration-300 transform"
                  style={{ backgroundColor: players.find(p => p.id === activePlayerId)?.avatarColor || '#333' }}
                >
                  {players.find(p => p.id === activePlayerId)?.avatar}
                </div>
              </div>

              <div className="max-h-[32vh] overflow-y-auto no-scrollbar grid grid-cols-5 gap-3 px-1 py-1">
                {pickerTab === 'avatar' ? (
                  AVATARS.map((avatar, index) => (
                    <button 
                      key={index} 
                      onClick={() => selectAvatar(avatar)} 
                      className={`aspect-square bg-white/5 rounded-2xl flex items-center justify-center text-3xl hover:bg-[#00FFFF]/20 hover:scale-105 transition-all ${players.find(p => p.id === activePlayerId)?.avatar === avatar ? 'ring-3 ring-[#00FFFF] bg-white/20 shadow-lg scale-105' : 'border border-white/5'}`}
                    >
                      {avatar}
                    </button>
                  ))
                ) : (
                  AVATAR_COLORS.map((color, index) => (
                    <button 
                      key={index} 
                      onClick={() => selectColor(color)} 
                      className={`aspect-square rounded-full border-3 transition-all hover:scale-110 shadow-md ${players.find(p => p.id === activePlayerId)?.avatarColor === color ? 'border-white ring-4 ring-[#00FFFF]/50 shadow-xl scale-110' : 'border-white/10'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div className="p-5 pt-0 pb-7 bg-[#2F4F4F]/40">
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="w-full bg-[#00FFFF] text-[#4B0082] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-lg shadow-[0_10px_20px_rgba(0,255,255,0.3)] active:scale-95 active:translate-y-1 transition-all"
              >
                PRONTO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;