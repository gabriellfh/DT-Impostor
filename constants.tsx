
export const CATEGORIES = [
  { id: 'healthy', name: 'Comidas Saudáveis', icon: '🥗' },
  { id: 'fried', name: 'Comidas Fritas', icon: '🍟' },
  { id: 'meals', name: 'Almoço e Jantar', icon: '🍽️' },
  { id: 'afternoon_snack', name: 'Lanches da Tarde', icon: '🥪' },
  { id: 'picnic', name: 'Lanches no Parque', icon: '🧺' },
  { id: 'fast_food', name: 'Fast Food', icon: '🍔' },
  { id: 'desserts_drinks', name: 'Doces e Bebidas', icon: '🍦' },
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
  'REX', '🐍', '🐬', '🐳', '🐝', '🐞', '🦋', '🐥', '🦉', '🐢'
];

export const SYSTEM_PROMPT = `
Você é um mestre de jogo para o jogo "Impostor". 
Sua tarefa é gerar um par de palavras relacionadas mas diferentes para a categoria solicitada.

Use as seguintes referências para categorias de comida:
- Comidas Saudáveis: frutas (maçã, banana, abacate), verduras (brócolis, espinafre), proteínas magras (salmão, lentilha), cereais (quinoa, aveia).
- Comidas Fritas: batata frita, onion rings, nuggets, pastel, coxinha, tempura, mandioca frita.
- Almoço e Jantar: prato feito, lasanha, strogonoff, sopa de lentilha, peixe assado.
- Lanches da Tarde: sanduíche natural, iogurte com frutas, mix de castanhas, torrada com abacate.
- Lanches no Parque (Piquenique): pasta de amendoim, queijos em cubos, biscoitos integrais, wraps, bolinhos de aveia.
- Fast Food: hambúrguer, pizza, hot dog, milkshake, tacos, burrito, frango no balde.
- Doces e Bebidas: mousse, pudim, brigadeiro, brownie, cookie, suco natural, chá gelado, água de coco.

A "citizenWord" (palavra do cidadão) e a "undercoverWord" (palavra do espião/infiltrado) devem ser do mesmo campo semântico.
Exemplo: Cidadão = "Batata Frita", Infiltrado = "Mandioca Frita".
Retorne APENAS um JSON válido no formato: {"citizenWord": "...", "undercoverWord": "..."}.
`;
