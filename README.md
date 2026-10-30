# Avesso

Jogo de **um botão só**. Segure para inverter a gravidade, solte para cair.
Não há pulo: o que o botão faz é trocar o lado para onde o mundo puxa, e a
tela inverte junto — é daí que vem o nome.

Abre com um duplo clique no `index.html`. Não precisa de servidor, nem de
build, nem de internet depois do primeiro carregamento das fontes.

## Por que o repositório se chama Flappy-Bird

Porque foi daí que partiu. A ideia original era refazer o Flappy Bird com
outra cara — e no meio do caminho virou outro jogo.

**Avesso não é um clone.** No Flappy Bird cada toque é um impulso; aqui não
existe pulo nenhum. Segurar é aceleração contínua para cima, soltar é para
baixo, e a tela inverte junto com a gravidade. Toques curtos encadeados
deixam o disco flutuar no meio do campo, que é uma coisa que o original não
permite. O que sobrou do ponto de partida é só o formato: um botão, uma
corrida, um número.

## Como se joga

| | |
|---|---|
| Segurar | `Espaço`, `↑`, `W`, clique ou toque em qualquer lugar do campo |
| Pausar | `Esc` ou `P` (e também ao trocar de aba) |
| Recomeçar | o mesmo botão de segurar, assim que a tela de fim aparece |

O aperto que começa a corrida **é o mesmo que segura a gravidade**: dá para
morrer com o dedo afundado, apertar de novo e já subir, sem soltar no meio.

## Os sistemas

### Três atos

A corrida tem três atos, e **quem diz qual é o ato é o mundo, não o texto**.

| Ato | Metros | | O que se vê |
|---|---|---|---|
| **Subsolo** | 0–1000 | Fácil | terra caindo do teto, aresta desmoronada, estacas de madeira velha largando terra |
| **Forja** | 1000–2500 | Médio | brasa subindo do chão, fio quente na borda, escória pingando, rodas girando |
| **Desabamento** | 2500+ | Difícil | cascalho despencando, rocha lascada na aresta, pêndulos |

Cada ato tem **paleta própria** — o Subsolo é terroso, a Forja é quente, o
Desabamento é frio — e a paleta **caminha** até a do ato em 0,8s, para a
troca ser uma virada de luz e não um pisca. O nome do ato aparece em letra
pequena quando ele começa: é lembrete, não manchete.

A cada ato a velocidade dá um degrau e **a faixa do chão e do teto engrossa**,
apertando o campo de verdade em vez de só acelerar.

**Os limites dos atos moram numa linha só**, a constante `LIMITES` no topo do
`jogo.js`:

| `LIMITES` | O que dá |
|---|---|
| `[1000, 2500, 4000]` | os números que o dono quis ver, **em vigor** |
| `[250, 625, 1000]` | a mesma proporção numa escala alcançável |

Os **dois primeiros** são limites de verdade: é por eles que o ato muda. O
terceiro é só o fim escrito do último ato na legenda do menu, e o alvo do
desafio mais difícil — o Desabamento não acaba ali, dali para a frente ele
continua, só mais rápido.

**A legenda dos atos é uma linha, não um quadro.** Em bloco com borda ela
media 112px e empurrava o recorde e as opções para baixo da dobra em tela
curta. Agora são 17px em paisagem e 30px no celular, com um ponto na cor do
ato.

Com `[1000, 2500]`, medido com o piloto automático em 110 s: **12 corridas,
mediana 152 m, melhor 315 m, nenhuma chegou aos 1.000**. Só o Subsolo
aparece; Forja e Desabamento existem no código e não na tela.

A conta por trás disso: 1.000 m são 20.000px, uns 50 segundos vivo, e a
corrida mediana dura 5. Para os absolutos caberem, o contador teria de correr
5x mais rápido do que a velocidade aprovada — que é exatamente o que foi
corrigido na rodada anterior.

Está assim **por escolha de quem manda, para ver com os próprios olhos**.
Voltar é trocar aquela linha.

O Subsolo também ganhou mais respiro entre obstáculos (`esp` 1.08).

**A régua: 1 m = 20px.** A 400px/s o contador sobe uns 20 m por segundo e dá
para atravessar a tela antes de chegar aos 100. Com 7px ele subia três vezes
mais rápido e o número inflava antes de a pessoa sair do lugar. Mexer em
`A.passoM` muda só a escala do placar, nunca a dificuldade: quem decide o
quanto aperta é a tabela `ATOS` mais a rampa de velocidade.

**O ato sai do PLACAR, não da distância crua.** O placar soma o bônus da
roçada e dos desafios; com o ato preso apenas à distância, o número na tela e
a troca de mundo andavam em unidades diferentes e a divisão nunca fechava com
o que se via.

**O tema de um obstáculo é o do ato de agora**, não o do ato em que ele
nasceu. A geração enche bem à frente; com o tema gravado no nascimento, o
mundo mudava de cara muito depois do aviso.

**Nenhum enfeite tem colisão.** Faísca, cascalho, terra, escória, recorte de
borda e espinho de pêndulo são só desenho — quem mata é a caixa, e só ela. Um
enfeite que mata é um enfeite que mente. Por isso o recorte da borda só
**tira** da faixa ou pendura algo curto, e nunca sugere chão onde não há.

A textura é pintada **na cor do fundo**, nunca numa cor própria: assim ela
inverte junto com o mundo sem ninguém escrever a regra duas vezes. E cada
peça carrega uma semente fixa — sem ela a textura sorteia de novo a cada
quadro e o obstáculo ferve.

**A borda e as lascas são irregulares de propósito.** Em tamanho parelho e
sem pular nenhuma, o olho pega a repetição antes de pegar o tema: vira renda
no Subsolo e serrilha de selo no Desabamento.

### Pêndulos

No Forja e no Desabamento aparecem **pêndulos**: uma bola de espinhos presa
por corrente a um pino no teto ou no chão, varrendo um arco.

- **A bola é círculo contra círculo**, não a caixa que a cerca. Com caixa, os
  cantos matariam sem encostar, e o desenho estaria mentindo.
- **Os espinhos ficam todos dentro do raio que mata.** O que passasse da
  conta seria desenho prometendo o que a física não cumpre.
- **O arco fica desenhado na tela.** É o que torna o pêndulo justo: avisa
  para onde a bola vai antes de ela ir. Sem ele, seria sorte.
- **A largura do grupo cobre o arco inteiro.** Sem isso a bola sai da faixa
  que o jogo olha e mata por trás.
- A corrente é feita de **elos**, não de um risco: é o que faz ler como peso
  pendurado em vez de linha esticada.

### Desafios da partida

Antes de cada corrida saem **três desafios sorteados** — um fácil, um médio e
um difícil, sempre nessa ordem — e uma contagem de 3 a 1. Cumprido, cada um
paga **metros de bônus**, iguais aos da roçada: entram no placar, no recorde
e nos metros somados.

São oito tipos (distância, roçadas, multiplicador, voo sem tocar nas bordas,
ato alcançado, tempo vivo, obstáculos passados, passagens limpas seguidas),
cada um com três níveis e três prêmios, de **+28 m a +148 m**. Os prêmios e os
alvos **em metros** estão no dobro do que já estiveram, a pedido do dono;
contagens e segundos não dobraram, porque "roçar 3 vezes" é uma meta e não uma
distância. Com a mediana em ~113 m, um prêmio difícil agora mais que dobra a
corrida — e é para ser assim: desafio cumprido tem de ser sentido no número.

**A contagem é pulável, e isso é de propósito.** Uma corrida dura uns dez
segundos; 2,2 s de pré-jogo obrigatório a cada tentativa viraria castigo lá
pela vigésima. Quem chega vê; quem está tentando de novo aperta e larga — e
o mesmo aperto já segura a gravidade.

### Roçada

**Roçar é passar raspando num obstáculo sem bater nele.** A folga entre a
borda do disco e a borda do obstáculo precisa ficar abaixo de `A.rocada`
(50px, cerca de uma vez e meia a largura do disco).

**É uma escala, não uma porteira.** Qualquer passagem dentro da janela conta;
o valor sobe conforme a folga encolhe, e de `A.rocadaRente` (10px) para
dentro paga cheio:

```
valor = multiplicador × (0,35 + 0,65 × qualidade)      mínimo 1
qualidade = 0 na beirada dos 50px, 1 colado no obstáculo
```

Antes eram 24px no liso: ou valia tudo ou não valia nada, e passar a 25px não
dava nada. Quem jogava não via a diferença, então não aprendia o gesto.

Três coisas importantes:

1. **Conta uma vez por obstáculo**, não por quadro. O jogo guarda a **menor**
   folga de toda a passagem e julga quando o obstáculo passa inteiro por trás
   do disco.
2. **Um vão conta uma roçada só**, mesmo sendo duas peças.
3. **Passar folgado zera o multiplicador**, de uma vez, e conta uma passagem
   limpa.

Roçadas **seguidas** sobem o multiplicador até ×8, e ele é quem diz quanto se
leva. O retorno é imediato e triplo: um **anel** que cresce e engrossa
conforme a roçada foi mais rente, um **número** subindo ao lado dizendo
quanto valeu, e um **tom** que sobe com a corrente. No HUD aparece
`ROÇADA ×N`.

A câmera lenta dispara a 20px, que está dentro da janela: **se o tempo
desacelerou e você não morreu, roçou**. O contrário não vale — dá para roçar
entre 20 e 50px sem câmera lenta.

### Os desafios avisam na hora

Cumprir um desafio no meio da corrida mostra **qual** foi, não só o prêmio:
`Desafio · Roçar 6 vezes · +74 m`. Com três por partida, dizer só "+74 m" não
conta o que caiu nem o que ainda falta.

**Os avisos entram numa fila**, um a cada 1,8s. Medido: "Roçar 1 vez" e
"Levar a roçada a ×1" caem na **mesma** roçada, e sem a fila o segundo aviso
apagava o primeiro antes de dar tempo de ler.

### Roupas

São **30**, e cada uma é uma linha de dados em `personagens.js`, não um
desenho: forma × casca × cor × rastro × **movimento**.

**O nome é o movimento.** Prumo pende, Mola salta, Relógio anda de segundo em
segundo, Espelho se inverte, Eco deixa um fantasma atrás, Bússola aponta para
onde a gravidade puxa, Hélice gira mais rápido quanto mais rápido se cai. São
30 movimentos, um por roupa. Se um dia o movimento mudar, o nome muda junto —
nome que não descreve o que se vê é só rótulo.

**Movimento não é física.** Nada em `MOVS` mexe na colisão: ela continua sendo
o mesmo círculo de raio `A.raio` no centro de onde o disco está de verdade.
`dx`, `dy`, `ex` e `ey` só deslocam e deformam o desenho. Uma roupa que
esticasse a caixa faria a pessoa escolher a mais estreita, e o jogo deixaria
de ser sobre conduzir para ser sobre escolher bem no armário.

**No vestiário os 30 cartões se mexem**, cada um do seu jeito, com um estado
de mentira que inverte a gravidade a cada 1,2s. Cartão parado não conta o que
a roupa é. Medido: 30 quadros distintos entre si, de 30.

- **15 por metros somados** de todas as corridas, de **500 m a 92.000 m**. A
  soma nunca anda para trás: uma corrida ruim ainda aproxima da próxima.
- **14 por proeza.** Metade do armário sai daqui, e é de propósito: moer
  metros desbloqueia o começo, mas as roupas que valem a pena caçar pedem
  domínio — roçar cinco vezes bem rente, passar 30 obstáculos seguidos sem
  roçar, cumprir os três desafios da mesma corrida, 60 segundos vivo, 25
  obstáculos sem tocar nas bordas, passar dos 4.000 m.
- **1 de saída**, a Avesso.

A ordem no armário é a da dificuldade: as duas primeiras fileiras e um pedaço
da terceira são metros somados; da metade da terceira em diante, só proezas.

**Uma vez ganha, nunca se perde.** O conjunto fica em `avesso.ganhas`. A
régua e a curva já mudaram três vezes; sem esse registro, cada mudança
**tiraria do armário** uma roupa que a pessoa já tinha — a pior coisa que uma
coleção pode fazer. `avesso.regua` diz qual régua gerou os números no disco, e
cada mudança passa o que está guardado pela mesma conta. Medido nas três
gerações de save: quem tinha 6 de 30 continua com 6 de 30.

**Os `id` não mudam nunca**: é por eles que o armário lembra. Nome, forma, cor
e movimento podem mudar.

**A cor não é livre.** A tela inverte, então a cor precisa contrastar com o
preto **e** com o osso: em brilho percebido, ficar entre 68 e 180. Há um teste
que confere as 30.

### Reviver

Na tela de fim, **acima do "De novo"**, há um botão que devolve a corrida de
onde ela parou. A moeda são os **metros somados**, e o preço sobe com a
distância já feita e com quantas vezes já se reviveu nesta corrida:

```
custo = (80 + placar × 2) × (revives + 1)
```

Sem o segundo fator, uma corrida boa viraria infinita para quem tem poupança.
Sem metros bastantes, o botão aparece desabilitado e diz quanto falta.

**Reviver é SEGURAR, não clicar.** Um clique seco torraria a poupança no
susto da morte; a barra laranja que enche é a confirmação. Ao renascer, o
caminho à frente é aberto — renascer em cima do obstáculo que matou seria
piada — e um clarão cobre a tela.

**O bloco é do mesmo tamanho do DE NOVO.** Os dois moram na mesma coluna
(`.fim__acoes`), com a mesma largura, o mesmo recheio e um piso de altura
comum: sem o piso o reviver nascia 12px mais alto, porque a frase dele é
maior. A frase fica em **uma linha só** (`white-space:nowrap`) — quebrada em
duas, ela escorregava para o pé da pílula e parecia saindo da borda.

**A frase aparece duas vezes, uma por camada.** Em osso na de cima, em tinta
dentro da carga; as duas camadas têm o mesmo `inset` e o mesmo recheio, então
as letras caem no mesmo pixel, e o que cresce é o `clip-path`, que descobre a
letra escura da esquerda para a direita. Antes era `mix-blend-mode:difference`
numa camada só: legível, mas a letra saía de uma cor que não existe em lugar
nenhum do jogo.

**A barra anda pelo relógio, não pelo tempo de quadro.** Somar `dt` amarra a
confirmação à velocidade de renderização: medido num navegador lento, a carga
subia 0,51 por segundo em vez de 0,91, e segurar 1,1 s não bastava. Quanto
tempo o dedo ficou em cima é pergunta de relógio.

**Há um respiro de 0,3 s antes de o reinício ser aceito.** Quem morre quase
sempre está martelando o botão, e sem a pausa a corrida recomeçava antes de a
pessoa ver que dava para reviver — a escolha sumia antes de existir.

**O placar só credita o que ainda não foi creditado.** Com o reviver, a mesma
corrida passa por `morrer()` mais de uma vez; somar o placar inteiro a cada
morte daria os metros em dobro. Medido: morrer em 35 m, reviver, morrer em
177 m credita 142.

### A roupa se apresenta

Vestir uma peça no vestiário abre um **close**: ela aparece grande no meio da
tela, fazendo o próprio movimento, com o resto fora de foco, ao lado do nome e
da frase que descreve o movimento. Trocar só a borda do cartão não conta o que
a roupa é — e o movimento é justamente o que a diferencia.

Fecha sozinho em 2,1 s, ou num clique. Ele **recebe o ponteiro de propósito**:
com `pointer-events:none` dava para clicar às cegas no armário por baixo do
desfoque, e não havia como dispensá-lo a não ser esperando. E sair do
vestiário o fecha, senão ele atravessa a saída e engole a tecla seguinte.

### A tela de fim diz por quanto você perdeu

Cada desafio não cumprido vira uma **barra que enche até onde a corrida
chegou**, e no lugar do ponto aparece **o que faltou**: `−6`, `−110`,
`−2,4k`. Um desafio perdido por um obstáculo e um perdido por dez ficavam
iguais na tela; agora não ficam.

**A posição é o nível.** O sorteio dá ao primeiro desafio o alvo mais baixo
do seu tipo, ao segundo o do meio e ao terceiro o mais alto — sempre fácil,
médio, difícil, nessa ordem. Isso já era verdade no código; o que faltava era
aparecer.

**O laranja sobe a cada nível**: `.12` de fundo no fácil, `.21` no médio e
`.33` no difícil, com a linha d'água em `.42`, `.68` e `.98`. Na largada
ainda não há barra, então quem mostra o nível é o número da posição, na mesma
escada. É a única pista de dificuldade que não precisa de texto.

O cumprido continua no acento, qualquer que seja o nível: feito é feito.

**O preenchimento é laranja** (`--laranja`, o mesmo da faísca e da Forja) —
um degrau abaixo do acento, que fica reservado para o desafio **cumprido**.
Assim a cor já diz, de relance, o que caiu e o que faltou.

**Encostar traz o desafio para a frente**: a linha cresce 4,5%, ganha borda
laranja e uma sombra por baixo, e passa na frente das vizinhas. Hover que
move segue os 0.6s do projeto; a cor e a borda ficam em 0.25s. Em tela de
toque não há ponteiro, então `:active` cobre o dedo apoiado, e sob
`prefers-reduced-motion` a linha não se move — só a borda muda.

**A linha d'água é o que faz a barra ler como barra.** Sem a borda na ponta,
o preenchimento parecia uma etiqueta atrás do número — em 11% ele terminava
bem na borda do `−890` e virava uma caixinha. A borda é o que diz "cheguei
até aqui".

Acima de mil o número é abreviado (`−2,4k`), senão estoura a fenda e empurra
o texto do desafio. O número inteiro fica no `aria-label`, para o leitor de
tela: *"Faltaram 2387. Chegar ao Desabamento"*.

As barras enchem **quando a tela entra**, não quando ela é montada: montada
ela ainda está escondida, e a animação passaria sem ninguém ver.

### A marca do recorde

Um fio vertical no campo, **pintado com a cor do setor onde ele cai** — do
aço frio do Raso ao vermelho do Avesso. Ele **anda para trás a cada roçada**,
porque o bônus já comeu parte da diferença: a marca é o ponto onde o recorde
cai se dali em diante não vier mais bônus nenhum.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | A página. Carrega o GSAP de `vendor/`, nada de CDN |
| `estilo.css` | Só a interface por cima do canvas |
| `personagens.js` | As 30 roupas, em dados. É aqui que se acrescenta uma |
| `jogo.js` | Motor: medida, setores, mundo, física, roçada, desenho, telas |

## As decisões que não são óbvias

**Tudo que é gerado guarda fração da altura útil, nunca pixel.** A faixa
engrossa a cada setor e a janela pode mudar de tamanho; com pixel gravado, um
vão que já existia fecharia sozinho e mataria quem estivesse dentro dele.

**A faixa engrossa devagar** (meio segundo), senão ela empurra de uma vez
quem está encostado na borda.

**O primeiro obstáculo da corrida nunca sai do chão.** Quem começa nasce
parado, encostado no chão: um bloco de chão logo de cara pede uma subida do
zero com pouco aviso, e um de teto não pede nada. Medido antes da correção:
**7 de 11 corridas morriam no mesmo lugar**, sempre aos 16 m, que é
exatamente onde cai o primeiro obstáculo. Depois: mínimo de 29 m e mediana
de 43 m.

**O HUD mora DENTRO da faixa do teto, e o corpo do número sai da altura
dela** (`calc(var(--faixa) * .58)`). Foram três tentativas:

1. cruzando a borda, a linha do chão cortava o número ao meio;
2. abaixo da faixa, os obstáculos passavam por trás dele;
3. dentro da faixa, nada atravessa o placar — porque ali só existe a faixa.

A faixa engrossa a cada ato e muda com o tamanho da janela, então nem o recuo
nem o corpo podem ser fixos: o jogo escreve `--faixa` e o CSS lê. Medido:
47px de base numa faixa de 63 (paisagem), 62 em 84 (tela grande), 49 em 66
(retrato) e 25 em 33 (janela de 700×420).

**`--faixa` nunca é lido do layout dentro do laço.** `clientHeight` a cada
quadro força o navegador a recalcular layout a cada quadro — exatamente o
tremor que a regra do `transform` existe para evitar. O valor vem do
`medir()`, e só é reescrito quando muda de pixel.

**A câmera lenta sobe depressa e desce devagar.** Com a mesma constante nos
dois sentidos ela pisca ao raspar de leve. Sobe em 35ms, volta em 220ms.

**O mundo lógico preenche o canvas por inteiro, e quem cede é a altura.** A
referência é 720 de altura, mas em tela estreita a largura lógica é fixada em
980 e a altura cresce. Sem isso, num celular em pé o campo visível à frente
ficaria em ~250px e não daria tempo de reagir.

**A inversão da tela é desenhada, não é CSS.** As duas cores do mundo são
interpoladas a cada quadro, com constante de tempo de 55ms. Em CSS seria um
`transition` curto, que é justamente o que o `CLAUDE.md` do repositório
proíbe — com razão, porque lá se trata de interface. Aqui é devolutiva de
jogo: precisa ser imediata.

**O som nasce no primeiro aperto, nunca no carregamento.** O contexto de
áudio só pode ser criado dentro de um gesto. Os tons são gerados por código:
nenhum arquivo, nenhum CDN.

**O HUD usa `mix-blend-mode: difference`**, que o deixa legível dos dois
lados da inversão sem ninguém trocar a cor dele. O efeito colateral: baixar a
opacidade aproxima o texto do fundo **nos dois lados**, então a hierarquia
ali vem do tamanho, não da opacidade.

**As telas que saem param de receber clique na hora.** Uma tela leva 0.6s
saindo e continua no documento, com os botões inteiros. Medido antes:
um clique repetido em **De novo** reiniciava a corrida a cada quadro.

## Dificuldade, medida

Um piloto automático lendo os pixels do canvas — acha o maior corredor livre
a 34% da largura à frente e persegue o centro dele:

| | |
|---|---|
| corrida mediana | ~113 m (Subsolo) |
| corrida boa | ~278 m (entrando na Forja) |
| corrida ótima | 625 m+ (Desabamento) |

A medição vale para o piloto automático, que lê uma coluna de pixels; quem
joga enxerga a tela inteira e vai mais longe.

**O piloto tem de engolir os blocos curtos.** Faísca, terra e cascalho ocupam
poucos pixels na coluna e não são parede: sem ignorar sequências de até 9px,
o piloto desvia de poeira e a mediana medida cai de 113 m para 77 m. Isso é
erro de medição, não dificuldade — foi o que quase me fez "corrigir" o jogo
por causa do próprio enfeite.

É **piso, não teto**: o piloto enxerga uma coluna, quem joga enxerga a tela
inteira. Serve para dizer que a geração não produz parede impossível — não
para dizer que o ajuste está bom. Isso só o dedo diz.

## Degradação

| Situação | O que acontece |
|---|---|
| Sem JavaScript | A tela de início aparece parada, com um aviso no lugar do botão |
| GSAP não carrega | O jogo roda igual pelo `requestAnimationFrame`, vestiário e desafios incluídos; as telas trocam sem animação |
| `prefers-reduced-motion` | Sem inversão de tela, sem tremor, sem faísca, sem cascalho; a roda de fogo fica parada |
| Sem canvas 2D | A tela de início fica de pé e o botão continua alcançável |

As quatro foram medidas no navegador, não deduzidas.

## O que ainda não existe

Placar compartilhado, modos de jogo e obstáculos que reagem a quem joga. Os
números de ajuste estão todos no objeto `A`, no topo do `jogo.js`; a cara de
cada setor está em `SETORES`, logo abaixo; as roupas, em `personagens.js`.

## Publicar

O jogo é estático: serve em qualquer lugar que entregue arquivos. Em GitHub
Pages, aponte para a raiz do repositório e pronto.

A única coisa que vem de fora é a fonte (Space Grotesk, pelo Google Fonts).
Sem ela a página cai na fonte do sistema e continua inteira — o jogo em si
não depende de nada remoto, porque o GSAP viaja em `vendor/`.

## A tela "Como se joga"

No menu, ao lado de **Inverter a tela** e **Som**, há um botão com uma
interrogação que abre uma tela explicando o jogo inteiro: o botão, a
inversão, **a roçada**, os três atos, os desafios, a marca do recorde, as 30
roupas (com a frase do movimento de cada uma) e as teclas.

Ela existe porque o **dono do projeto jogou sem saber o que era roçar**. Se
quem pediu a mecânica não entendeu jogando, ninguém ia entender.

**Os números da explicação são lidos do próprio código** — `A.rocada`,
`A.rocadaRente`, `A.multMax`, a tabela `ATOS` e a lista de personagens. Texto
parado vira texto errado: mexer no ajuste não pode deixar a explicação
mentindo.

A frase de cada roupa mora no campo `diz`, em `personagens.js`, ao lado do
`mov` que ela descreve. Trocou o movimento, troque a frase na mesma linha.

## A corrente, no rodapé

O multiplicador da roçada aparece na **faixa do chão**, à esquerda, enquanto
a corrente está viva. Ali embaixo nada passa por cima dele, e ele fica longe
do placar — que mora na faixa do teto. Antes ele era uma palavra miúda na
linha do recorde, e se perdia.
