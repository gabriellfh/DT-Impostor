
export const FOOD_CATEGORIES = [
  { id: 'healthy', name: 'Comidas Saudáveis', icon: '🥗' },
  { id: 'fried', name: 'Comidas Fritas', icon: '🍟' },
  { id: 'meals', name: 'Almoço e Jantar', icon: '🍽️' },
  { id: 'afternoon_snack', name: 'Lanches da Tarde', icon: '🥪' },
  { id: 'picnic', name: 'Lanches no Parque', icon: '🧺' },
  { id: 'fast_food', name: 'Fast Food', icon: '🍔' },
  { id: 'desserts_drinks', name: 'Doces e Bebidas', icon: '🍦' },
];

export const MAIN_CATEGORIES = [
  { id: 'food_group', name: 'Comida', icon: '🥘', isGroup: true },
  { id: 'animals', name: 'Animais', icon: '🐶' },
  { id: 'movies', name: 'Filmes', icon: '🎬' },
  { id: 'objects', name: 'Objetos', icon: '🪑' },
  { id: 'places', name: 'Lugares', icon: '🌍' },
  { id: 'sports', name: 'Esportes', icon: '⚽' },
  { id: 'tech', name: 'Tecnologia', icon: '💻' },
  { id: 'random', name: 'Aleatório', icon: '🎲' }
];

// Dados estruturados para sorteio instantâneo (Zero Latência)
export const LOCAL_WORD_DATA: Record<string, string[][]> = {
  'Animais': [
    ['Elefante', 'Leão', 'Tigre', 'Girafa', 'Zebra'],
    ['Urso polar', 'Urso pardo', 'Gorila', 'Chimpanzé', 'Orangotango'],
    ['Lobo', 'Raposa', 'Coiote', 'Lince', 'Puma'],
    ['Cavalo', 'Vaca', 'Porco', 'Ovelha', 'Cabra'],
    ['Golfinho', 'Baleia', 'Foca', 'Morsa', 'Lontra'],
    ['Águia', 'Coruja', 'Papagaio', 'Arara', 'Tucano'],
    ['Pinguim', 'Avestruz', 'Pavão', 'Pelicano', 'Beija-flor'],
    ['Galo', 'Galinha', 'Pato', 'Ganso', 'Peru'],
    ['Cobra', 'Jacaré', 'Crocodilo', 'Tartaruga', 'Camaleão'],
    ['Sapo', 'Rã', 'Iguana', 'Lagarto'],
    ['Tubarão', 'Polvo', 'Lagosta', 'Cavalo-marinho', 'Peixe'],
    ['Caranguejo', 'Estrela-do-mar'],
    ['Escorpião', 'Aranha', 'Abelha', 'Formiga', 'Porco-espinho'],
    ['Hamster', 'Rato', 'Esquilo', 'Porquinho-da-índia', 'Tatu']
  ],
  'Filmes': [
    ['Toy Story', 'Toy Story 5', 'Monstros S.A.', 'Vida de Inseto'],
    ['Procurando Nemo', 'Luca', 'A Pequena Sereia', 'Shark Tale'],
    ['Os Incríveis', 'Super Mario Galaxy: O Filme', 'Detona Ralph', 'Wi-Fi Ralph'],
    ['Frozen', 'Moana', 'Enrolados', 'A Bela e a Fera', 'Mulan', 'Aladdin'],
    ['O Rei Leão', 'Madagascar', 'Zootopia', 'A Era do Gelo'],
    ['Shrek', 'Kung Fu Panda', 'Como Treinar Seu Dragão', 'Gato de Botas'],
    ['Wall-E', 'Soul', 'Divertida Mente', 'Ratatouille'],
    ['Viva - A Vida é uma Festa', 'Encanto', 'Raya e o Último Dragão'],
    ['Meu Amigo Totoro', 'Castelo no Céu', 'Ponyo'],
    ['Mary Poppins', 'O Mágico de Oz', 'A Fantástica Fábrica de Chocolate'],
    ['Paddington', 'O Pequeno Stuart Little', 'Christopher Robin'],
    ['Turma da Mônica - Laços', 'O Menino que Descobriu o Vento']
  ]
};

export const AVATARS = [
  '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐙', '🦄', '🐲', '🐧',
  '🐶', '🐱', '🐹', '🐰', '🦒', '🐘', '🦏', '🐎', '🐖', '🐑',
  'REX', '🐍', '🐬', '🐳', '🐝', '🐞', '🦋', '🐥', '🦉', '🐢'
];

export const SYSTEM_PROMPT = `
Você é um mestre de jogo para o jogo "Impostor". 
Gere um par de palavras relacionadas mas diferentes.

A "citizenWord" (palavra do cidadão) e a "undercoverWord" (palavra do espião/infiltrado) devem ser do mesmo campo semântico.
Exemplo: Categoria "Tecnologia" -> Celular e Tablet.

Retorne APENAS um JSON: {"citizenWord": "...", "undercoverWord": "..."}.
`;
