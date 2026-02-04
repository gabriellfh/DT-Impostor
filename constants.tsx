
export const MAIN_CATEGORIES = [
  { id: 'food', name: 'Comida', icon: '🥘' },
  { id: 'animals', name: 'Animais', icon: '🐶' },
  { id: 'movies', name: 'Filmes', icon: '🎬' },
  { id: 'anime', name: 'Anime', icon: '👤' }, // Ícone será estilizado no componente
  { id: 'objects', name: 'Objetos', icon: '🪑' },
  { id: 'places', name: 'Lugares', icon: '🌍' },
  { id: 'sports', name: 'Esportes', icon: '⚽' },
  { id: 'tech', name: 'Tecnologia', icon: '💻' },
  { id: 'countries', name: 'País', icon: '🚩' },
  { id: 'random', name: 'Aleatório', icon: '🎲' }
];

// Dados estruturados para sorteio instantâneo (Zero Latência)
export const LOCAL_WORD_DATA: Record<string, string[][]> = {
  'Comida': [
    ['Maçã', 'Banana', 'Pêra', 'Uva', 'Morango', 'Melancia'],
    ['Brócolis', 'Cenoura', 'Alface', 'Espinapre', 'Beterraba'],
    ['Batata Frita', 'Onion Rings', 'Nuggets', 'Polenta Frita'],
    ['Pastel', 'Coxinha', 'Quibe', 'Enroladinho', 'Empada'],
    ['Lasanha', 'Canelone', 'Ravioli', 'Nhoque', 'Espaguete'],
    ['Strogonoff', 'Fricassê', 'Escondidinho', 'Feijoada'],
    ['Hambúrguer', 'Hot Dog', 'X-Salada', 'X-Burguer', 'Taco'],
    ['Pizza', 'Calzone', 'Focaccia', 'Bruschetta'],
    ['Sushi', 'Sashimi', 'Temaki', 'Guioza'],
    ['Sorvete', 'Açaí', 'Picolé', 'Gelato', 'Milkshake'],
    ['Chocolate', 'Bombom', 'Trufa', 'Brigadeiro'],
    ['Pudim', 'Mousse', 'Gelatina', 'Quindim', 'Pavê'],
    ['Café', 'Chá', 'Chocolate Quente', 'Cappuccino'],
    ['Refrigerante', 'Suco', 'Limonada', 'Chá Gelado', 'Guaraná'],
    ['Sanduíche', 'Misto Quente', 'Bauru', 'Tapioca'],
    ['Croissant', 'Pão de Queijo', 'Baguete', 'Donut']
  ],
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
  ],
  'Anime': [
    ['One Piece', 'Naruto', 'Dragon Ball', 'Dragon Ball Z', 'Yu Yu Hakusho'],
    ['Fullmetal Alchemist: Brotherhood', 'Hunter x Hunter', 'Attack on Titan', 'Black Clover'],
    ['Jujutsu Kaisen', 'Demon Slayer', 'My Hero Academia', 'One Punch Man'],
    ['Death Note', 'Code Geass', 'Psycho-Pass', 'Ghost in the Shell'],
    ['Neon Genesis Evangelion', 'Cowboy Bebop', 'Steins;Gate'],
    ['Sword Art Online', 'Re:Zero', 'No Game No Life', 'Overlord'],
    ['Konosuba', 'That Time I Got Reincarnated as a Slime'],
    ['Your Lie in April', 'Clannad', 'A Silent Voice', 'Violet Evergarden', 'March Comes in Like a Lion'],
    ['Spy x Family', 'The Disastrous Life of Saiki K.', 'Gintama', 'Nichijou', 'Daily Lives of High School Boys'],
    ['Pokémon', 'Sailor Moon', 'Rurouni Kenshin', 'Berserk'],
    ['Haikyuu!!', 'Kuroko no Basket', 'Hajime no Ippo', 'Slam Dunk', 'Ping Pong The Animation']
  ],
  'Objetos': [
    ['Lápis', 'Caneta', 'Borracha', 'Apagador', 'Estojo'],
    ['Caderno', 'Livro', 'Mochila', 'Régua'],
    ['Cadeira', 'Mesa', 'Sofá', 'Cama'],
    ['Geladeira', 'Fogão', 'Micro-ondas'],
    ['Televisão', 'Computador', 'Celular'],
    ['Prato', 'Copo', 'Talher', 'Panela'],
    ['Faca', 'Colher', 'Garfo'],
    ['Liquidificador', 'Cafeteira', 'Frigideira', 'Peneira']
  ],
  'Lugares': [
    ['Casa', 'Apartamento', 'Escola', 'Hospital', 'Supermercado', 'Parque', 'Praia', 'Rua', 'Praça', 'Estação de trem'],
    ['Floresta', 'Montanha', 'Rio', 'Lago', 'Deserto', 'Ilha', 'Caverna', 'Cachoeira', 'Vale', 'Planície'],
    ['Cinema', 'Zoológico', 'Piscina', 'Estádio', 'Circo', 'Parque de diversões', 'Biblioteca', 'Museu', 'Teatro', 'Praia de nudismo'],
    ['Escritório', 'Fábrica', 'Loja', 'Restaurante', 'Fazenda', 'Construção', 'Banco', 'Posto de gasolina', 'Hotel', 'Canteiro de obras'],
    ['Castelo', 'Pirâmide', 'Templo', 'Vulcão', 'Geleira', 'Oásis', 'Selva', 'Savana', 'Polo Norte', 'Abismo oceânico']
  ],
  'Esportes': [
    ['Futebol', 'Futsal', 'Basquete', 'Handebol', 'Rugby', 'Futebol americano', 'Hóquei no gelo', 'Polo aquático', 'Corfebol'],
    ['Atletismo', 'Natação', 'Ciclismo', 'Triatlo', 'Vela', 'Remo', 'Canoagem', 'Hipismo', 'Automobilismo'],
    ['Golfe', 'Tiro com arco', 'Tiro esportivo', 'Dardos', 'Sinuca', 'Bocha'],
    ['Voleibol', 'Vôlei de praia', 'Tênis', 'Tênis de mesa', 'Badminton', 'Squash', 'Padel'],
    ['Boxe', 'Judô', 'Karatê', 'Taekwondo', 'Jiu-jitsu', 'MMA', 'Luta livre', 'Esgrima'],
    ['Ginástica artística', 'Ginástica rítmica', 'Saltos ornamentais', 'Patinação artística', 'Nado sincronizado', 'Surfe'],
    ['Beisebol', 'Críquete', 'Snowboard', 'Esqui', 'Parkour', 'Paintball', 'Xadrez (esportivo)']
  ],
  'País': [
    ['Brasil', 'Argentina', 'Chile', 'Uruguai', 'Paraguai', 'Bolívia', 'Colômbia', 'Peru', 'Venezuela', 'Equador'],
    ['Estados Unidos', 'Canadá', 'México', 'Panamá', 'Costa Rica', 'Guatemala', 'Honduras', 'El Salvador', 'Nicarágua'],
    ['França', 'Alemanha', 'Reino Unido', 'Bélgica', 'Países Baixos', 'Luxemburgo', 'Suíça', 'Áustria'],
    ['Itália', 'Espanha', 'Portugal', 'Grécia', 'Malta', 'Andorra', 'San Marino', 'Cidade do Vaticano'],
    ['Japão', 'China', 'Coreia do Sul', 'Coreia do Norte', 'Taiwan', 'Mongólia'],
    ['Rússia', 'Ucrânia', 'Polônia', 'República Checa', 'Hungria', 'Romênia', 'Bulgária', 'Bielorrússia'],
    ['Austrália', 'Nova Zelândia', 'Fiji', 'Ilhas Salomão', 'Vanuatu', 'Samoa', 'Tonga', 'Tuvalu'],
    ['Egito', 'Marrocos', 'Argélia', 'Tunísia', 'Líbia', 'Sudão', 'Mauritânia'],
    ['Angola', 'Moçambique', 'Cabo Verde', 'Guiné-Bissau', 'São Tomé e Príncipe', 'Portugal'],
    ['Arábia Saudita', 'Emirados Árabes Unidos', 'Catar', 'Kuwait', 'Bahrein', 'Omã', 'Iraque', 'Irã'],
    ['Índia', 'Paquistão', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Butão', 'Maldivas'],
    ['Tailândia', 'Vietnã', 'Indonésia', 'Filipinas', 'Malásia', 'Singapura', 'Camboja', 'Laos', 'Brunei', 'Timor Leste'],
    ['Suécia', 'Noruega', 'Dinamarca', 'Finlândia', 'Islândia', 'Estônia', 'Letônia', 'Lituânia'],
    ['Turquia', 'Israel', 'Jordânia', 'Líbano', 'Síria', 'Chipre', 'Armênia', 'Geórgia', 'Azerbaijão'],
    ['Nigéria', 'Gana', 'Senegal', 'Costa do Marfim', 'Mali', 'Níger', 'Burkina Faso', 'Benim'],
    ['Etiópia', 'Quênia', 'Tanzânia', 'Uganda', 'Ruanda', 'Burundi', 'Madagascar', 'Somália'],
    ['África do Sul', 'Namíbia', 'Botsuana', 'Zimbábue', 'Zâmbia', 'Malawi', 'Lesoto', 'Suazilândia'],
    ['Cuba', 'Jamaica', 'Haiti', 'República Dominicana', 'Porto Rico', 'Bahamas', 'Barbados', 'Trinidad e Tobago'],
    ['Cazaquistão', 'Uzbequistão', 'Turcomenistão', 'Quirguistão', 'Tadjiquistão', 'Afeganistão'],
    ['Irlanda', 'Islândia', 'Groenlândia', 'Reino Unido', 'Ilhas Feroé']
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
Retorne APENAS um JSON: {"citizenWord": "...", "undercoverWord": "..."}.
`;
