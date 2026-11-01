/* =========================================================
   OFICINAS — edite somente este arquivo para atualizar o conteúdo

   Campos de cada oficina:
     k        → kanji do carimbo
     t        → nome da oficina
     who      → quem ministra
     price    → valor em reais (0 = gratuita, null = valor a consultar)
     label    → texto antes do preço (opcional, ex.: "Sessão")
     spots    → vagas (opcional)
     img      → foto: coloque o arquivo em imgs/oficinas/ e escreva o caminho
                (ex.: "imgs/oficinas/bonsai.jpg"). Vazio = mostra o carimbo no lugar.
     texto    → parágrafos do "Ver mais" (cada item da lista é um parágrafo)
     detalhes → lista de informações extras exibidas em destaque
                (ex.: { rotulo: "Duração", valor: "2 horas" }). Itens vazios são ocultados.
   ========================================================= */
window.OFICINAS = [
  {
    k: "書", t: "Shodô · Escrita em Kanji", who: "Akira Imanishi",
    price: null, note: "Valor a consultar",
    img: "imgs/oficinas/shodo.jpg",
    texto: [
      "Uma introdução à arte da caligrafia japonesa, em que cada traço de pincel convida à calma e à concentração.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "盆", t: "Bonsai", who: "Agostinho Guedes · mestre em Bonsai",
    price: 40, spots: "10 vagas",
    img: "imgs/oficinas/bonsai.jpg",
    texto: [
      "Conheça os cuidados básicos e a filosofia por trás do bonsai, a arte de cultivar a natureza em miniatura.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "彩", t: "Aquarela Experimental", who: "Breno Barbosa",
    price: 120, spots: "20 vagas",
    img: "imgs/oficinas/aquarela.jpg",
    texto: [
      "Uma vivência livre com a aquarela, explorando cores, água e texturas inspiradas nas paisagens japonesas.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "折", t: "Origami", who: "Célio Costa · mestre em Origami",
    price: 0, spots: "15 vagas",
    img: "imgs/oficinas/origami.jpg",
    texto: [
      "Descubra a arte de dobrar o papel e aprenda a fazer o tsuru, símbolo de paz, longevidade e boa sorte.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "陶", t: "Cerâmica", who: "Sonia Imanishi e alunas",
    price: 0, spots: "Crianças 20 · Adultos 10 vagas",
    img: "imgs/oficinas/ceramica.jpg",
    texto: [
      "Um encontro com o barro ao lado de Sonia Imanishi e suas alunas, para crianças e adultos colocarem a mão na massa.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "刺", t: "Bordado Sashikô", who: "Conceição Reale",
    price: 0, spots: "10 vagas",
    img: "imgs/oficinas/sashiko.jpg",
    texto: [
      "Conheça o sashikô, bordado tradicional japonês em que pontos simples formam padrões delicados.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "寿", t: "Comida Japonesa", who: "Geraldo Faraci · sushiman",
    price: 80, spots: "10 vagas",
    img: "imgs/oficinas/comida-japonesa.jpg",
    texto: [
      "Uma experiência prática na cozinha japonesa, com dicas de preparo e montagem de pratos tradicionais.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "苔", t: "Kokedama", who: "Jean e Maurício",
    price: 180,
    img: "imgs/oficinas/kokedama.jpg",
    texto: [
      "Conheça a kokedama, técnica japonesa que envolve as raízes da planta em uma esfera de terra e musgo.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "茶", t: "Preparo de Chás", who: "Paula Braga",
    price: 20, spots: "8 vagas",
    img: "imgs/oficinas/chas.jpg",
    texto: [
      "Um momento para conhecer o preparo dos chás japoneses e a tranquilidade que acompanha cada xícara.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
      { rotulo: "O que levar", valor: "" },
    ],
  },
  {
    k: "指", t: "Massagem Shiatsu", who: "Jonas Machado",
    price: 90, label: "Sessão",
    img: "imgs/oficinas/shiatsu.jpg",
    texto: [
      "Uma sessão de shiatsu, massagem japonesa que usa a pressão dos dedos para promover relaxamento e bem-estar.",
    ],
    detalhes: [
      { rotulo: "Horário", valor: "" },
      { rotulo: "Duração", valor: "" },
    ],
  },
];
