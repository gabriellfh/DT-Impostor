
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

export const AVATARS = [
  '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐙', '🦄', '🐲', '🐧',
  '🐶', '🐱', '🐹', '🐰', '🦒', '🐘', '🦏', '🐎', '🐖', '🐑',
  'REX', '🐍', '🐬', '🐳', '🐝', '🐞', '🦋', '🐥', '🦉', '🐢'
];

export const SYSTEM_PROMPT = `
Você é um mestre de jogo para o jogo "Impostor". 
Sua tarefa é gerar um par de palavras relacionadas mas diferentes para a categoria solicitada.

REGRAS PARA A CATEGORIA "FILMES":
Escolha dois filmes/séries da lista abaixo que sejam similares (mesmo estilo, estúdio ou tema). Exemplo: Toy Story e Monstros S.A. (Pixar), ou Frozen e Moana (Princesas Disney).
LISTA DE FILMES DISPONÍVEIS:
- Toy Story, Toy Story 5, Procurando Nemo, Os Incríveis, Vida de Inseto, Divertida Mente, Wall-E, Up - Altas Aventuras, Ratatouille, Valente, Monstros S.A., Viva - A Vida é uma Festa, Luca, Soul.
- Moana, Frozen, Zootopia, O Rei Leão, Mulan, A Bela e a Fera, Aladdin, A Pequena Sereia, Encanto, Raya e o Último Dragão, A Princesa e o Sapo, Detona Ralph, Wi-Fi Ralph, Dumbo.
- Shrek, Kung Fu Panda, Como Treinar Seu Dragão, A Era do Gelo, Madagascar, Trolls.
- Meu Amigo Totoro, Castelo no Céu.
- A Fantástica Fábrica de Chocolate, Turma da Mônica - Laços, O Pequeno Stuart Little, O Menino que Descobriu o Vento, Paddington, O Quebra-Nozes e os Quatro Reinos, Christopher Robin, O Mágico de Oz, Mary Poppins.
- Super Mario Galaxy: O Filme.

REGRAS PARA A CATEGORIA "ANIMAIS":
Escolha ALEATORIAMENTE um desses subgrupos:
1. Savana: Elefante, leão, tigre, girafa, zebra.
2. Grandes: Urso polar, urso pardo, gorila, chimpanzé, orangotango.
3. Predadores: Lobo, raposa, coiote, lince, puma.
4. Fazenda: Cavalo, vaca, porco, ovelha, cabra.
5. Mamíferos Aquáticos: Golfinho, baleia, foca, morsa, lontra.
6. Pássaros: Águia, coruja, papagaio, arara, tucano, pinguim, avestruz, pavão, pelicano, beija-flor, galo, galinha, pato, ganso, peru.
7. Répteis/Anfíbios: Cobra, jacaré, crocodilo, tartaruga, camaleão, sapo, rã, iguana, lagarto.
8. Marinhos: Tubarão, polvo, lagosta, cavalo-marinho, peixe, caranguejo, estrela-do-mar.
9. Insetos/Pequenos: Escorpião, aranha, abelha, formiga, porco-espinho, hamster, rato, esquilo, porquinho-da-índia, tatu.

A "citizenWord" (palavra do cidadão) e a "undercoverWord" (palavra do espião/infiltrado) devem ser do mesmo campo semântico.
Retorne APENAS um JSON válido no formato: {"citizenWord": "...", "undercoverWord": "..."}.
`;
