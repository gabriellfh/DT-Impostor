
export const CATEGORIES = [
  { id: 'food', name: 'Comida', icon: '🍕' },
  { id: 'animals', name: 'Animais', icon: '🐶' },
  { id: 'movies', name: 'Filmes', icon: '🎬' },
  { id: 'objects', name: 'Objetos', icon: '🪑' },
  { id: 'places', name: 'Lugares', icon: '🌍' },
  { id: 'sports', name: 'Esportes', icon: '⚽' },
  { id: 'tech', name: 'Tecnologia', icon: '💻' },
  { id: 'random', name: 'Aleatório', icon: '🎲' }
];

export const AVATARS = [
  '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐙', '🦄', '🐲', '🐧',
  '🐶', '🐱', '🐹', '🐰', '🦒', '🐘', '🦏', '🐎', '🐖', '🐑',
  '🦖', '🐍', '🐬', '🐳', '🐝', '🐞', '🦋', '🐥', '🦉', '🐢'
];

export const SYSTEM_PROMPT = `
Você é um mestre de jogo para o jogo "Impostor". 
Sua tarefa é gerar um par de palavras relacionadas mas diferentes.
A "citizenWord" (palavra do cidadão) e a "undercoverWord" (palavra do infiltrado).
As palavras devem ser do mesmo campo semântico para que o infiltrado possa se camuflar, mas distintas o suficiente para serem diferenciadas.
Por exemplo: Cidadão = "Cachorro", Infiltrado = "Lobo".
Retorne APENAS um JSON válido.
`;
