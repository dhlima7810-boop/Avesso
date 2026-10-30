/* ===========================================================================
   AVESSO — as 30 roupas.

   Cada uma e uma LINHA DE DADOS, nao um desenho. Seis eixos se combinam:

     forma   disco · quadrado · losango · hexagono · triangulo · capsula · cruz
     casca   solido · vazado (so contorno) · anel (furo no meio) · partido
     cor     paleta de luminancia media
     rastro  bolhas · risco · pontos · nenhum
     mov     o movimento proprio — a tabela MOVS, no jogo.js
     diz     a frase que descreve esse movimento, lida na tela de ajuda
     por     como se ganha

   O NOME E O MOVIMENTO SAO A MESMA COISA. Prumo pende, Mola salta, Relogio
   anda de segundo em segundo, Espelho se inverte, Eco deixa um fantasma
   atras. Se um dia o movimento mudar, o nome muda junto — nome que nao
   descreve o que se ve e so rotulo.

   MOVIMENTO NAO E FISICA. Nada aqui mexe na colisao: ela continua sendo o
   mesmo circulo de raio A.raio no centro de onde o disco esta de verdade.
   Uma roupa que esticasse a caixa faria a pessoa escolher a mais estreita.

   A COR NAO E LIVRE. A tela inverte quando se segura o botao, entao a cor
   precisa contrastar com o preto E com o osso. Em brilho percebido
   (0.299R + 0.587G + 0.114B) isso quer dizer ficar entre 68 e 180. Ha um
   teste que confere as 30.

   Os `id` nao mudam nunca: e por eles que o armario lembra o que ja foi
   ganho (`avesso.ganhas`). Nome, forma, cor e movimento podem mudar.

   `por` diz como se ganha:
     {tipo:'livre'}            — ja vem vestida
     {tipo:'soma', m:1200}     — metros somados de TODAS as corridas
     {tipo:'proeza', id:'cem'} — uma proeza, descrita em PROEZAS no jogo.js
   ======================================================================== */

// Os cortes de ANTES da primeira subida da curva. Servem uma vez so, na
// migracao do jogo.js: quem ja tinha uma roupa nao pode perde-la porque a
// exigencia subiu. Nao use para mais nada e nao mexa.
window.AVESSO_CORTES_ANTIGOS = [120, 300, 550, 850, 1200, 1600, 2050, 2550, 3100, 3700, 4400,
  5200, 6100, 7100, 8200, 9400, 10700, 12100, 13600, 15200, 17500];

window.AVESSO_PERSONAGENS = [
  { id:'avesso',   nome:'Avesso',     forma:'disco',     casca:'solido',  cor:'#ff3b14', rastro:'bolhas', mov:'vira',    diz:'dá meia volta a cada inversão', por:{ tipo:'livre' } },

  { id:'brasa',    nome:'Brasa',      forma:'disco',     casca:'anel',    cor:'#ff6a2b', rastro:'risco',  mov:'pulsa',   diz:'pulsa como uma brasa respirando', por:{ tipo:'soma', m:500 } },
  { id:'cal',      nome:'Prumo',      forma:'losango',   casca:'solido',  cor:'#a8aab0', rastro:'risco',  mov:'pende',   diz:'pende para o lado da queda, como um fio de prumo', por:{ tipo:'soma', m:1200 } },
  { id:'gema',     nome:'Gema',       forma:'disco',     casca:'solido',  cor:'#e8a400', rastro:'pontos', mov:'escorre', diz:'estica e achata conforme a velocidade', por:{ tipo:'soma', m:2400 } },
  { id:'grafite',  nome:'Fuso',       forma:'capsula',   casca:'vazado',  cor:'#7a828c', rastro:'risco',  mov:'fia',     diz:'gira sem parar no próprio eixo', por:{ tipo:'soma', m:4200 } },
  { id:'carmim',   nome:'Pulso',      forma:'disco',     casca:'solido',  cor:'#c21f3a', rastro:'bolhas', mov:'bate',    diz:'bate em dois tempos, como um coração', por:{ tipo:'soma', m:6800 } },
  { id:'indigo',   nome:'Vaga',       forma:'capsula',   casca:'partido', cor:'#4455c8', rastro:'bolhas', mov:'ondula',  diz:'sobe e desce em onda', por:{ tipo:'soma', m:10000 } },
  { id:'musgo',    nome:'Rolha',      forma:'capsula',   casca:'solido',  cor:'#5f8c3f', rastro:'pontos', mov:'boia',    diz:'boia, balançando devagar', por:{ tipo:'soma', m:14000 } },
  { id:'ambar',    nome:'Pião',       forma:'triangulo', casca:'solido',  cor:'#d98324', rastro:'risco',  mov:'piao',    diz:'roda rápido e bamboleia', por:{ tipo:'soma', m:19000 } },
  { id:'vidro',    nome:'Vulto',      forma:'disco',     casca:'vazado',  cor:'#4fb3c9', rastro:'nenhum', mov:'some',    diz:'aparece e some devagar', por:{ tipo:'soma', m:25000 } },
  { id:'polvora',  nome:'Estilhaço',  forma:'triangulo', casca:'solido',  cor:'#8a7f9e', rastro:'pontos', mov:'treme',   diz:'treme sem parar', por:{ tipo:'soma', m:32000 } },
  { id:'ferrugem', nome:'Roda',       forma:'hexagono',  casca:'anel',    cor:'#9e4a28', rastro:'bolhas', mov:'roda',    diz:'gira conforme a distância, como uma roda', por:{ tipo:'soma', m:40000 } },
  { id:'ocre',     nome:'Relógio',    forma:'disco',     casca:'anel',    cor:'#b89150', rastro:'risco',  mov:'tique',   diz:'anda de segundo em segundo', por:{ tipo:'soma', m:50000 } },
  { id:'menta',    nome:'Fole',       forma:'capsula',   casca:'partido', cor:'#3fbf8f', rastro:'pontos', mov:'infla',   diz:'infla e esvazia, como um fole', por:{ tipo:'soma', m:62000 } },
  { id:'lilas',    nome:'Pluma',      forma:'losango',   casca:'vazado',  cor:'#9b6bd6', rastro:'risco',  mov:'flutua',  diz:'vagueia solta no ar', por:{ tipo:'soma', m:76000 } },
  { id:'pessego',  nome:'Bumerangue', forma:'triangulo', casca:'vazado',  cor:'#e8886b', rastro:'bolhas', mov:'volta',   diz:'gira inteiro e volta de repente', por:{ tipo:'soma', m:92000 } },

  { id:'cem',      nome:'Bússola',    forma:'losango',   casca:'partido', cor:'#e09a28', rastro:'risco',  mov:'aponta',  diz:'aponta para onde a gravidade puxa', por:{ tipo:'proeza', id:'cem' } },
  { id:'folego',   nome:'Sopro',      forma:'disco',     casca:'vazado',  cor:'#46b06b', rastro:'risco',  mov:'respira', diz:'cresce e encolhe devagar', por:{ tipo:'proeza', id:'folego' } },
  { id:'giz',      nome:'Serra',      forma:'hexagono',  casca:'vazado',  cor:'#a8a394', rastro:'bolhas', mov:'serra',   diz:'gira aos trancos, como uma serra', por:{ tipo:'proeza', id:'rente' } },
  { id:'lasca',    nome:'Lasca',      forma:'triangulo', casca:'vazado',  cor:'#c9a44a', rastro:'risco',  mov:'lasca',   diz:'tomba de repente, de vez em quando', por:{ tipo:'proeza', id:'limpao' } },
  { id:'breu',     nome:'Eco',        forma:'disco',     casca:'solido',  cor:'#5a4a6e', rastro:'nenhum', mov:'repete',  diz:'deixa um fantasma atrás', por:{ tipo:'proeza', id:'tres' } },
  { id:'nespera',  nome:'Mola',       forma:'capsula',   casca:'anel',    cor:'#d9663f', rastro:'pontos', mov:'salta',   diz:'dá um tranco e volta, a cada inversão', por:{ tipo:'proeza', id:'maratona' } },
  { id:'chumbo',   nome:'Âncora',     forma:'cruz',      casca:'partido', cor:'#6b7079', rastro:'nenhum', mov:'afunda',  diz:'atrasa para o lado da queda, pesada', por:{ tipo:'proeza', id:'voo25' } },
  { id:'voo',      nome:'Hélice',     forma:'cruz',      casca:'solido',  cor:'#5ab6cf', rastro:'risco',  mov:'ventila', diz:'gira mais rápido quanto mais rápido se cai', por:{ tipo:'proeza', id:'voo' } },
  { id:'fio',      nome:'Nó',         forma:'quadrado',  casca:'vazado',  cor:'#e03a6a', rastro:'pontos', mov:'ata',     diz:'torce para um lado e para o outro', por:{ tipo:'proeza', id:'fio' } },
  { id:'fundo',    nome:'Dado',       forma:'quadrado',  casca:'solido',  cor:'#3f7fd6', rastro:'nenhum', mov:'rolar',   diz:'vira de quarto em quarto de volta', por:{ tipo:'proeza', id:'fundo' } },
  { id:'cegas',    nome:'Espelho',    forma:'quadrado',  casca:'partido', cor:'#8f8f8f', rastro:'nenhum', mov:'reflete', diz:'se inverte de tempos em tempos', por:{ tipo:'proeza', id:'cegas' } },
  { id:'estopim',  nome:'Faísca',     forma:'losango',   casca:'solido',  cor:'#ff5a3c', rastro:'pontos', mov:'pisca',   diz:'pisca rápido', por:{ tipo:'proeza', id:'quatroMil' } },
  { id:'duzentos', nome:'Cometa',     forma:'capsula',   casca:'solido',  cor:'#ff7a00', rastro:'risco',  mov:'risca',   diz:'estica no sentido da corrida', por:{ tipo:'proeza', id:'duzentos' } },
  { id:'limalha',  nome:'Ímã',        forma:'capsula',   casca:'anel',    cor:'#b0a08c', rastro:'pontos', mov:'atrai',   diz:'puxa para o lado da gravidade', por:{ tipo:'proeza', id:'limalha' } }
];
