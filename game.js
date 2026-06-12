const screens = { menu: document.getElementById('menu'), game: document.getElementById('game') };
const world = document.getElementById('world');
const player = document.getElementById('player');
const npcDavid = document.getElementById('npcDavid');
const npcDavidImg = document.getElementById('npcDavidImg');
const npcBubble = document.getElementById('npcBubble');
const hint = document.getElementById('hint');
const phoneItem = document.getElementById('phoneItem');
const phoneChat = document.getElementById('phoneChat');
const messages = document.getElementById('messages');
const options = document.getElementById('options');
const timerEl = document.getElementById('timer');
const letterBush = document.getElementById('letterBush');
const bookGlow = document.getElementById('bookGlow');
const pressTip = document.getElementById('pressTip');
const dialog = document.getElementById('dialog');
const dialogName = document.getElementById('dialogName');
const dialogText = document.getElementById('dialogText');
const dialogOptions = document.getElementById('dialogOptions');
const nextDialog = document.getElementById('nextDialog');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalAction = document.getElementById('modalAction');
const modalExtraActions = document.getElementById('modalExtraActions');
const letterModalImg = document.getElementById('letterModalImg');
const memoryCall = document.getElementById('memoryCall');
const achievement = document.getElementById('achievement');
const sceneFade = document.getElementById('sceneFade');
const sceneFadeText = document.getElementById('sceneFadeText');

let scene = 'room';
let playerPos = { x: 760, y: 455 };
let keys = {};
let nearPhone = false;
let nearLetter = false;
let phoneFound = false;
let timer = 180;
let timerInterval = null;
let lastDir = 'down';
let gameStarted = false;
let isTransitioning = false;
let letterFound = false;
let heartRoomUnlocked = false;
let nearNpc = false;
let npcIntroDone = false;
let npcIntroPlaying = false;
let npcDialogIndex = 0;
let npcIntroTimers = [];
let npcPos = { x: 0, y: 0 };
let npcConversationActive = false;
let davidFollowing = false;
let playerWasMoving = false;
let npcQuestionState = {};
let currentNpcSequence = [];
let currentNpcSequenceIndex = 0;
let npcDialogMode = 'choices';
let sceneSequence = null;
let parkIntroDone = false;
let parkInsideUnlocked = false;
let parkInsideIntroDone = false;
let parkCarouselReached = false;
let carouselSceneActive = false;
let carouselAnimationTimer = null;
let carouselFrameIndex = 0;
let badPhaseUnlocked = false;
let badPhaseConversationDone = false;
let badPhaseBookReady = false;
let badPhaseBookGlowShown = false;
let badPhaseBookTimer = null;
let badPhaseTransitionTimer = null;
let nearBadDavid = false;
let nearBadBook = false;
let badPhaseManuscriptOpen = false;
let postPuzzlePhoneReady = false;
let crystalExitReady = false;
let postPuzzlePhoneStep = 0;
let crystalIntroStarted = false;
let crystalDeparturePlaying = false;
let crystalReptilianIntroDone = false;
let crystalPortalReady = false;
let crystalEndingTriggered = false;
let awakeningSequenceStarted = false;
let awakeningPortalReady = false;
let awakeningFrameIndex = 0;
let awakeningMusicStarted = false;

const sprites = {
  down: 'assets/agda_down.png', up: 'assets/agda_up.png',
  left: 'assets/agda_left.png', right: 'assets/agda_right.png'
};

const davidSprites = {
  down: 'assets/david_down.png', up: 'assets/david_up.png',
  left: 'assets/david_left.png', right: 'assets/david_right.png'
};

const carouselFrames = [
  'assets/carousel_frame_1.png',
  'assets/carousel_frame_2.png',
  'assets/carousel_frame_3.png',
  'assets/carousel_frame_4.png',
  'assets/carousel_frame_5.png',
];

const crystalDepartureFrames = [
  'assets/crystal_departure_1.png',
  'assets/crystal_departure_2.png',
  'assets/crystal_departure_3.png',
  'assets/crystal_departure_4.png',
  'assets/crystal_departure_5.png',
  'assets/crystal_departure_6.png',
  'assets/crystal_departure_7.png',
];

const crystalPortalFrames = [
  'assets/portal_1.png',
  'assets/portal_2.png',
];

const awakeningFrames = [
  'assets/despertar_bg.png',
  'assets/despertar2_bg.png',
  'assets/despertar3_bg.png',
];

const awakeningMusic = new Audio('assets/music.m4a');
awakeningMusic.loop = true;
awakeningMusic.volume = 0.55;

const chatSteps = [
  { from:'unknown', text:'Oii, agora sim ksks. A gente pode conversar melhor por aqui ^^', options:['Também acho kkk, não uso tanto o ig', 'É bom pq eu gosto de mandar figurinha de humor negro, tava em abstinência já 😢'] },
  { from:'unknown', text:'Sei que é muito cedo, mas tenho uma surpresa pra você.', options:['Qual surpresa? Você me conheceu agora e já está fazendo essas coisas'] },
  { from:'unknown', text:'Como assim agora? eu te conheço faz tempo Ag.', options:[] },
  { from:'unknown', text:'Você se esqueceu sobre nós? Vamos fazer assim, eu deixei uma carta escondida pra você.', options:['Ei espera, você invadiu meu quarto ou algo assim?'] },
  { from:'unknown', text:'Eu não preciso disso, já vivo dentro do seu coração e habito sua mente todos os dias.', options:['???'] },
  { from:'unknown', text:'Não temos tempo, vá depressa e procure aos arredores de sua casa.', options:[], end:true }
];
let chatIndex = 0;
const npcOpeningLines = [
  'Finalmente você chegou, já estava achando que não viria KK.',
  'Acho que tem muitas dúvidas certo?'
];
const npcQuestions = {
  q1: {
    question: 'Espere, isso é tão lindo... mas, me diga o que você está fazendo aqui?',
    answer: [
      'Eu não sou exatamente o David, apenas um fragmento dele que você criou na cabeça.',
      'Estou aqui para te ajudar com seus dilemas. Sou tudo aquilo que ele representa pra você.'
    ]
  },
  q2: {
    question: 'E que lugar é esse? É um sonho? Onde está a casa?',
    answer: [
      'Quantas perguntas garota kk.',
      'Sempre foi assim né, curiosa sobre tudo. Uma das qualidades que eu mais amo em você.',
      'Isso é só sua mente Ag, e bom.. a nossa mente possui muitas salas.',
      'Estamos em uma sala muito boa por sinal, sabe... Existem lugares obscuros habitando nos humanos.'
    ]
  },
  q3: {
    question: 'Como eu vim parar aqui?',
    answer: ['Hmmm.. eu não sei dizer direito, mas só você pode descobrir.']
  },
  q4: {
    question: 'Vamos sim, você vem comigo?',
    answer: ['Até onde seu coração me permitir ir, eu sempre estarei com você.'],
    final: true
  }
};

function showScreen(name){ Object.values(screens).forEach(s=>s.classList.remove('active')); screens[name].classList.add('active'); }
function setPlayer(x,y){ playerPos.x=x; playerPos.y=y; player.style.left=x+'px'; player.style.top=y+'px'; }
function distance(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
function worldSize(){ return { w: world.clientWidth, h: world.clientHeight }; }
function updatePlayerAppearance(){
  player.classList.toggle('outdoor', scene === 'village' || scene === 'park' || scene === 'parkInside' || scene === 'crystal');
}
function clearWorldInlineBackground(){
  world.style.backgroundImage = '';
  world.style.backgroundSize = '';
  world.style.backgroundPosition = '';
  world.style.backgroundRepeat = '';
}
function stopCarouselAnimation(){
  if(carouselAnimationTimer){
    clearInterval(carouselAnimationTimer);
    carouselAnimationTimer = null;
  }
  carouselSceneActive = false;
  carouselFrameIndex = 0;
}
function setCarouselFrame(index){
  const frame = carouselFrames[index % carouselFrames.length];
  world.style.backgroundImage = `url("${frame}")`;
  world.style.backgroundSize = 'cover';
  world.style.backgroundPosition = 'center';
  world.style.backgroundRepeat = 'no-repeat';
}
function startCarouselAnimation(){
  stopCarouselAnimation();
  carouselSceneActive = true;
  setCarouselFrame(0);
  carouselAnimationTimer = setInterval(() => {
    carouselFrameIndex = (carouselFrameIndex + 1) % carouselFrames.length;
    setCarouselFrame(carouselFrameIndex);
  }, 240);
}
function applyRoomBackground(){
  stopCarouselAnimation();
  clearWorldInlineBackground();
  world.className = heartRoomUnlocked ? 'world room-world heartroom-world fade-in' : 'world room-world fade-in';
}
function applyParkBackground(){
  stopCarouselAnimation();
  clearWorldInlineBackground();
  world.className = 'world park-world fade-in';
}
function applyParkInsideBackground(){
  stopCarouselAnimation();
  clearWorldInlineBackground();
  world.className = 'world parkinside-world fade-in';
}
function applyCarouselSceneBackground(){
  world.className = 'world carousel-world fade-in';
  startCarouselAnimation();
}
function applyBadPhaseBackground(which = 1){
  stopCarouselAnimation();
  world.className = 'world badphase-world fade-in';
  world.style.backgroundImage = `url("assets/bad_phase_${which}.png")`;
  world.style.backgroundSize = 'cover';
  world.style.backgroundPosition = 'center';
  world.style.backgroundRepeat = 'no-repeat';
}
function applyCrystalBackground(){
  stopCarouselAnimation();
  clearWorldInlineBackground();
  world.className = 'world crystal-world fade-in';
}
function setCrystalWorldFrame(frame){
  world.className = 'world crystal-world';
  world.style.backgroundImage = `url("${frame}")`;
  world.style.backgroundSize = 'cover';
  world.style.backgroundPosition = 'center';
  world.style.backgroundRepeat = 'no-repeat';
}
function applyAwakeningBackground(){
  stopCarouselAnimation();
  clearWorldInlineBackground();
  world.className = 'world awakening-world fade-in';
}
function setAwakeningWorldFrame(frame){
  world.className = 'world awakening-world';
  world.style.backgroundImage = `url("${frame}")`;
  world.style.backgroundSize = 'cover';
  world.style.backgroundPosition = 'center';
  world.style.backgroundRepeat = 'no-repeat';
}
function crossfadeWorldFrame(frame, className = 'world awakening-world', duration = 1000){
  const layer = document.createElement('div');
  layer.className = 'world-crossfade-layer';
  layer.style.backgroundImage = `url("${frame}")`;
  world.appendChild(layer);
  requestAnimationFrame(() => {
    layer.style.opacity = '1';
  });
  setTimeout(() => {
    world.className = `${className} fade-in`;
    world.style.backgroundImage = `url("${frame}")`;
    world.style.backgroundSize = 'cover';
    world.style.backgroundPosition = 'center';
    world.style.backgroundRepeat = 'no-repeat';
    layer.remove();
  }, duration);
}
function stopAwakeningMusic(){
  awakeningMusic.pause();
  awakeningMusic.currentTime = 0;
  awakeningMusicStarted = false;
}
function startAwakeningMusic(){
  if(awakeningMusicStarted) return;
  awakeningMusicStarted = true;
  awakeningMusic.currentTime = 0;
  const playAttempt = awakeningMusic.play();
  if(playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {});
}
function hideSceneFadeMessage(){
  if(!sceneFadeText) return;
  sceneFadeText.textContent = '';
  sceneFadeText.classList.add('hidden');
}
function showSceneFadeMessage(text){
  if(!sceneFadeText) return;
  sceneFadeText.textContent = text;
  sceneFadeText.classList.remove('hidden');
}
function clearBadPhaseTimers(){
  if(badPhaseBookTimer){ clearTimeout(badPhaseBookTimer); badPhaseBookTimer = null; }
  if(badPhaseTransitionTimer){ clearTimeout(badPhaseTransitionTimer); badPhaseTransitionTimer = null; }
}
function hideModalExtraActions(){
  modalExtraActions.innerHTML = '';
  modalExtraActions.classList.add('hidden');
}
function clearNpcIntroTimers(){
  npcIntroTimers.forEach(id => clearTimeout(id));
  npcIntroTimers = [];
}
function setNpc(x, y){
  npcPos.x = x;
  npcPos.y = y;
  npcDavid.style.left = x + 'px';
  npcDavid.style.top = y + 'px';
}
function setNpcSprite(dir){
  if(davidSprites[dir]) npcDavidImg.src = davidSprites[dir];
}
function showNpc(visible){
  npcDavid.classList.toggle('hidden', !visible);
  if(visible && (!npcPos.x || !npcPos.y)) setNpc(world.clientWidth * 0.52, world.clientHeight * 0.285);
  if(!visible) npcBubble.classList.add('hidden');
}
function showNpcBubble(text){
  npcBubble.textContent = text;
  npcBubble.classList.remove('hidden');
}
function hideNpcBubble(){
  npcBubble.classList.add('hidden');
}

function startSceneSequence(lines, onComplete){
  sceneSequence = { lines: lines.slice(), index: 0, onComplete };
  dialog.classList.remove('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.remove('hidden');
  pressTip.classList.add('hidden');
  renderSceneSequence();
}
function renderSceneSequence(){
  if(!sceneSequence) return;
  const current = sceneSequence.lines[sceneSequence.index];
  dialogName.textContent = current.name;
  dialogText.textContent = current.text;
  dialogOptions.classList.add('hidden');
  nextDialog.classList.remove('hidden');
  nextDialog.textContent = sceneSequence.index < sceneSequence.lines.length - 1 ? 'Continuar' : 'Continuar';
}
function advanceSceneSequence(){
  if(!sceneSequence) return;
  sceneSequence.index++;
  if(sceneSequence.index < sceneSequence.lines.length){
    renderSceneSequence();
    return;
  }
  const done = sceneSequence.onComplete;
  sceneSequence = null;
  dialog.classList.add('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.add('hidden');
  if(typeof done === 'function') done();
}
function resetNpcConversation(){
  npcQuestionState = { q1:false, q2:false, q3:false, q4:false };
  npcConversationActive = false;
  currentNpcSequence = [];
  currentNpcSequenceIndex = 0;
  npcDialogMode = 'choices';
  davidFollowing = false;
  sceneSequence = null;
}
function startDavidDialog(){
  if(!heartRoomUnlocked || npcIntroPlaying || davidFollowing) return;
  npcConversationActive = true;
  dialogName.textContent = 'David';
  dialog.classList.remove('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.remove('hidden');
  pressTip.classList.add('hidden');
  npcDialogMode = 'opening';
  currentNpcSequence = npcOpeningLines.slice();
  currentNpcSequenceIndex = 0;
  renderNpcOpeningLine();
}
function renderNpcOpeningLine(){
  dialogName.textContent = 'David';
  dialogText.textContent = currentNpcSequence[currentNpcSequenceIndex];
  nextDialog.textContent = currentNpcSequenceIndex < currentNpcSequence.length - 1 ? 'Continuar' : 'Ver perguntas';
  dialogOptions.classList.add('hidden');
  nextDialog.classList.remove('hidden');
}
function availableNpcQuestions(){
  const options = [];
  if(!npcQuestionState.q1) options.push('q1');
  if(!npcQuestionState.q2) options.push('q2');
  if(!npcQuestionState.q3) options.push('q3');
  if(npcQuestionState.q1 && npcQuestionState.q2 && npcQuestionState.q3 && !npcQuestionState.q4) options.push('q4');
  return options;
}
function renderNpcChoices(){
  dialogName.textContent = 'Hora do Quiz';
  dialogText.textContent = 'Perguntar para David:';
  dialogOptions.innerHTML = '';
  const options = availableNpcQuestions();
  options.forEach(id => {
    const btn = document.createElement('button');
    btn.textContent = npcQuestions[id].question;
    btn.onclick = () => selectNpcQuestion(id);
    dialogOptions.appendChild(btn);
  });
  nextDialog.classList.add('hidden');
  dialogOptions.classList.remove('hidden');
}
function selectNpcQuestion(id){
  npcQuestionState[id] = true;
  npcDialogMode = 'answer';
  currentNpcSequence = npcQuestions[id].answer.slice();
  currentNpcSequenceIndex = 0;
  dialogOptions.classList.add('hidden');
  nextDialog.classList.remove('hidden');
  renderNpcAnswerLine(id);
}
function renderNpcAnswerLine(){
  dialogName.textContent = 'David';
  dialogText.textContent = currentNpcSequence[currentNpcSequenceIndex];
  nextDialog.textContent = currentNpcSequenceIndex < currentNpcSequence.length - 1 ? 'Continuar' : 'Continuar';
}
function advanceDavidDialog(){
  if(!npcConversationActive) return;
  currentNpcSequenceIndex++;

  if(npcDialogMode === 'opening'){
    if(currentNpcSequenceIndex < currentNpcSequence.length){
      renderNpcOpeningLine();
      return;
    }
    npcDialogMode = 'choices';
    renderNpcChoices();
    return;
  }

  if(npcDialogMode === 'answer'){
    if(currentNpcSequenceIndex < currentNpcSequence.length){
      renderNpcAnswerLine();
      return;
    }
    if(npcQuestionState.q4){
      finishDavidConversation();
      return;
    }
    npcDialogMode = 'choices';
    renderNpcChoices();
  }
}
function finishDavidConversation(){
  dialog.classList.add('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.add('hidden');
  npcConversationActive = false;
  showAchievement('Você encontrou seu amado perdido.');
  setTimeout(() => {
    hint.textContent = 'Guie David para fora desse lugar.';
    davidFollowing = true;
  }, 3500);
}
function showAchievement(text){
  achievement.querySelector('.achievement-text').textContent = text;
  achievement.classList.remove('hidden');
  setTimeout(() => achievement.classList.add('hidden'), 3200);
}
function runHeartRoomIntro(){
  clearNpcIntroTimers();
  showNpc(true);
  setNpc(world.clientWidth * 0.52, world.clientHeight * 0.285);
  setNpcSprite('down');
  hideNpcBubble();
  npcIntroPlaying = true;
  hint.textContent = 'Você voltou... mas agora tudo parece diferente.';
  pressTip.classList.add('hidden');
  npcIntroTimers.push(setTimeout(() => {
    npcIntroPlaying = false;
    npcIntroDone = true;
    hint.textContent = 'Aproxime-se de David e pressione E para falar com ele.';
  }, 5000));
}
function updateDepth(){
  if(npcDavid.classList.contains('hidden')) return;
  const playerFeet = getFeetPoint().y;
  const npcFeet = getNpcFeetPoint().y;
  if(npcFeet < playerFeet){
    npcDavid.style.zIndex = 9;
    player.style.zIndex = 12;
  } else {
    npcDavid.style.zIndex = 13;
    player.style.zIndex = 10;
  }
}
function updateDavidFollower(playerMoved){
  if(!davidFollowing || npcDavid.classList.contains('hidden')) return;
  if(!playerMoved) return;
  const target = { x: playerPos.x + (player.offsetWidth || 82) / 2, y: playerPos.y + (player.offsetHeight || 118) * 0.75 };
  const dx = target.x - npcPos.x;
  const dy = target.y - npcPos.y;
  const dist = Math.hypot(dx, dy);
  const desired = 95;
  if(dist <= desired) return;
  const step = Math.min(2.6, dist - desired);
  const nx = npcPos.x + (dx / dist) * step;
  const ny = npcPos.y + (dy / dist) * step;
  setNpc(nx, ny);
  if(Math.abs(dx) > Math.abs(dy)) setNpcSprite(dx > 0 ? 'right' : 'left');
  else setNpcSprite(dy > 0 ? 'down' : 'up');
}

const villageRects = [

  { name: 'Casa da Agda', x: 0.555, y: 0.045, w: 0.345, h: 0.315 },

  { name: 'Casa pequena superior', x: 0.210, y: 0.070, w: 0.165, h: 0.235 },
  { name: 'Casa inferior esquerda', x: 0.000, y: 0.440, w: 0.175, h: 0.240 },
  { name: 'Casa inferior direita', x: 0.815, y: 0.445, w: 0.185, h: 0.230 }
];

const homeDoorArea = { x: 0.660, y: 0.280, w: 0.095, h: 0.125 };

const roomRects = [
  { name: 'Guarda-roupa', x: 0.132, y: 0.045, w: 0.175, h: 0.285 },
  { name: 'Mesa esquerda', x: 0.000, y: 0.395, w: 0.115, h: 0.265 },
  { name: 'Cadeira e banco', x: 0.105, y: 0.340, w: 0.095, h: 0.280 },
  { name: 'Cesto inferior esquerdo', x: 0.000, y: 0.790, w: 0.155, h: 0.210 },
  { name: 'Planta', x: 0.705, y: 0.215, w: 0.110, h: 0.145 },
  { name: 'Parede da janela', x: 0.365, y: 0.205, w: 0.325, h: 0.070 },
  { name: 'Estante', x: 0.795, y: 0.050, w: 0.165, h: 0.250 },
  { name: 'Cama e criado-mudo', x: 0.790, y: 0.350, w: 0.210, h: 0.650 }
];

const roomBounds = { minX: 0.040, maxX: 0.955, minY: 0.205, maxY: 0.960 };

const roomExitArea = { x: 0.320, y: 0.780, w: 0.260, h: 0.125 };

const heartRoomWalkPolygon = [
  { x: 0.144, y: 0.998 },
  { x: 0.273, y: 0.407 },
  { x: 0.399, y: 0.425 },
  { x: 0.421, y: 0.311 },
  { x: 0.579, y: 0.311 },
  { x: 0.592, y: 0.404 },
  { x: 0.710, y: 0.393 },
  { x: 0.846, y: 0.998 }
];

const parkWalkPolygon = [
  { x: 0.178, y: 0.994 },
  { x: 0.178, y: 0.742 },
  { x: 0.285, y: 0.605 },
  { x: 0.452, y: 0.616 },
  { x: 0.495, y: 0.552 },
  { x: 0.572, y: 0.552 },
  { x: 0.616, y: 0.629 },
  { x: 0.731, y: 0.669 },
  { x: 0.731, y: 0.900 },
  { x: 0.777, y: 0.994 }
];
const parkExitArea = { x: 0.478, y: 0.530, w: 0.086, h: 0.040 };
const parkSpawnPlayer = { x: 0.408, y: 0.874 };
const parkSpawnDavid = { x: 0.507, y: 0.874 };
const parkInsideCarouselTrigger = { x: 0.745, y: 0.035, w: 0.255, h: 0.640 };
const parkInsideDialogPlayerPos = { x: 0.580, y: 0.635 };
const parkInsideDialogDavidPos = { x: 0.485, y: 0.635 };

const badPhaseSpawn = { x: 0.465, y: 0.738 };

const badPhaseDavidArea = { x: 0.385, y: 0.515, w: 0.235, h: 0.230 };
const badPhaseBookArea = { x: 0.785, y: 0.555, w: 0.130, h: 0.185 };
const badPhaseCollisionRects = [
  { name: 'Parede superior', x: 0.000, y: 0.000, w: 1.000, h: 0.215 },
  { name: 'Prateleira esquerda', x: 0.000, y: 0.225, w: 0.230, h: 0.775 },
  { name: 'Prateleira direita', x: 0.770, y: 0.225, w: 0.230, h: 0.775 },
  { name: 'Altar superior', x: 0.405, y: 0.208, w: 0.195, h: 0.138 },

  { name: 'David sentado', x: 0.445, y: 0.370, w: 0.105, h: 0.185 }
];

const crystalPortalArea = { x: 0.595, y: 0.645, w: 0.140, h: 0.255 };

const awakeningWalkBounds = { minX: 0.030, maxX: 0.972, minY: 0.555, maxY: 0.975 };
const awakeningPortalArea = { x: 0.735, y: 0.690, w: 0.150, h: 0.245 };
const awakeningCollisionRects = [
  { name: 'Estante esquerda', x: 0.000, y: 0.000, w: 0.120, h: 0.760 },
  { name: 'Poltrona e sofá', x: 0.075, y: 0.615, w: 0.285, h: 0.300 },
  { name: 'Mesa de centro', x: 0.355, y: 0.655, w: 0.215, h: 0.155 },
  { name: 'TV e rack', x: 0.600, y: 0.455, w: 0.325, h: 0.275 },
  { name: 'Estante direita', x: 0.930, y: 0.100, w: 0.070, h: 0.820 },
  { name: 'Cantinho inferior direito', x: 0.845, y: 0.850, w: 0.155, h: 0.150 },
  { name: 'Objeto inferior esquerdo', x: 0.000, y: 0.820, w: 0.105, h: 0.180 }
];

function toWorldRect(rect){
  const size = worldSize();
  return { x: rect.x * size.w, y: rect.y * size.h, w: rect.w * size.w, h: rect.h * size.h };
}
function rectsOverlap(a,b){
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function pointInsideRect(p, r){
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}
function pointInPolygon(point, polygon){
  let inside = false;
  for(let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / ((yj - yi) || 0.00001) + xi);
    if(intersect) inside = !inside;
  }
  return inside;
}
function getPlayerSize(){
  return { w: player.offsetWidth || 82, h: player.offsetHeight || 118 };
}
function getFeetRect(x = playerPos.x, y = playerPos.y){
  const { w: pw, h: ph } = getPlayerSize();
  return { x: x + pw * 0.24, y: y + ph * 0.72, w: pw * 0.52, h: ph * 0.22 };
}
function getFeetPoint(x = playerPos.x, y = playerPos.y){
  const feet = getFeetRect(x, y);
  return { x: feet.x + feet.w / 2, y: feet.y + feet.h / 2 };
}
function isOutsideRoomBounds(x, y){
  if(scene !== 'room') return false;
  const size = worldSize();
  const feetPoint = getFeetPoint(x, y);
  const bounds = {
    minX: roomBounds.minX * size.w,
    maxX: roomBounds.maxX * size.w,
    minY: roomBounds.minY * size.h,
    maxY: roomBounds.maxY * size.h
  };
  return feetPoint.x < bounds.minX || feetPoint.x > bounds.maxX || feetPoint.y < bounds.minY || feetPoint.y > bounds.maxY;
}
function isOutsideHeartRoomWalkArea(x, y){
  if(scene !== 'room' || !heartRoomUnlocked) return false;
  const size = worldSize();
  const feetPoint = getFeetPoint(x, y);
  const polygon = heartRoomWalkPolygon.map(point => ({
    x: point.x * size.w,
    y: point.y * size.h
  }));
  return !pointInPolygon(feetPoint, polygon);
}

function isOutsideParkWalkArea(x, y){
  if(scene !== 'park') return false;
  const size = worldSize();
  const feetPoint = getFeetPoint(x, y);
  const polygon = parkWalkPolygon.map(point => ({ x: point.x * size.w, y: point.y * size.h }));
  return !pointInPolygon(feetPoint, polygon);
}
function isBlockedByParkObject(x, y){
  if(scene !== 'park') return false;
  if(isAtParkExit(x, y)) return false;
  return isOutsideParkWalkArea(x, y);
}
function isBlockedByRoomObject(x, y){
  if(scene !== 'room') return false;

  if(isAtRoomExit(x, y)) return false;

  if(heartRoomUnlocked){
    return isOutsideHeartRoomWalkArea(x, y);
  }

  if(isOutsideRoomBounds(x, y)) return true;
  const feet = getFeetRect(x, y);
  return roomRects.some(rect => rectsOverlap(feet, toWorldRect(rect)));
}
function isBlockedByVillageObject(x, y){
  if(scene !== 'village') return false;
  const feet = getFeetRect(x, y);
  const door = toWorldRect(homeDoorArea);
  const feetPoint = getFeetPoint(x, y);

  if(pointInsideRect(feetPoint, door)) return false;

  return villageRects.some(rect => rectsOverlap(feet, toWorldRect(rect)));
}
function isBlockedByBadPhaseObject(x, y){
  if(!(scene === 'badroom1' || scene === 'badroom2')) return false;
  const feet = getFeetRect(x, y);
  const size = worldSize();
  const bounds = { minX: size.w * 0.060, maxX: size.w * 0.940, minY: size.h * 0.235, maxY: size.h * 0.935 };
  const feetPoint = getFeetPoint(x, y);
  if(feetPoint.x < bounds.minX || feetPoint.x > bounds.maxX || feetPoint.y < bounds.minY || feetPoint.y > bounds.maxY) return true;
  return badPhaseCollisionRects.some(rect => rectsOverlap(feet, toWorldRect(rect)));
}
function isBlockedByAwakeningObject(x, y){
  if(scene !== 'awakening') return false;
  const feet = getFeetRect(x, y);
  const feetPoint = getFeetPoint(x, y);
  const size = worldSize();
  const bounds = {
    minX: awakeningWalkBounds.minX * size.w,
    maxX: awakeningWalkBounds.maxX * size.w,
    minY: awakeningWalkBounds.minY * size.h,
    maxY: awakeningWalkBounds.maxY * size.h
  };
  if(feetPoint.x < bounds.minX || feetPoint.x > bounds.maxX || feetPoint.y < bounds.minY || feetPoint.y > bounds.maxY) return true;
  if(isAtAwakeningPortal(x, y)) return false;
  return awakeningCollisionRects.some(rect => rectsOverlap(feet, toWorldRect(rect)));
}
function canMoveTo(x, y){
  if(scene === 'room') return !isBlockedByRoomObject(x, y) && !isBlockedByNpc(x, y);
  if(scene === 'village') return !isBlockedByVillageObject(x, y);
  if(scene === 'park') return !isBlockedByParkObject(x, y) && !isBlockedByNpc(x, y);
  if(scene === 'parkInside') return !isBlockedByNpc(x, y);
  if(scene === 'badroom1' || scene === 'badroom2') return !isBlockedByBadPhaseObject(x, y);
  if(scene === 'badbattle') return false;
  if(scene === 'crystal') return !crystalEndingTriggered;
  if(scene === 'awakening') return !isBlockedByAwakeningObject(x, y);
  if(scene === 'carousel') return false;
  return true;
}
function isAtHomeDoor(x = playerPos.x, y = playerPos.y){
  if(scene !== 'village') return false;
  return pointInsideRect(getFeetPoint(x, y), toWorldRect(homeDoorArea));
}
function isAtRoomExit(x = playerPos.x, y = playerPos.y){
  if(scene !== 'room') return false;
  return pointInsideRect(getFeetPoint(x, y), toWorldRect(roomExitArea));
}
function isAtParkExit(x = playerPos.x, y = playerPos.y){
  if(scene !== 'park') return false;
  return pointInsideRect(getFeetPoint(x, y), toWorldRect(parkExitArea));
}
function isAtParkInsideCarouselTrigger(x = playerPos.x, y = playerPos.y){
  if(scene !== 'parkInside') return false;
  return pointInsideRect(getFeetPoint(x, y), toWorldRect(parkInsideCarouselTrigger));
}
function enterHome(){
  if(isTransitioning || scene !== 'village') return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  hint.textContent = 'Agda entrou em casa...';
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');

  setTimeout(() => {
    scene = 'room';
    applyRoomBackground();
    player.classList.remove('hidden');
    showNpc(false);
    phoneItem.classList.add('hidden');
    letterBush.classList.add('hidden');
    timerEl.classList.add('hidden');
    phoneChat.classList.add('hidden');
    modal.classList.add('hidden');
    memoryCall.classList.add('hidden');
    setPlayer(world.clientWidth * 0.55, world.clientHeight * 0.54);
    player.src = sprites.down;
    lastDir = 'down';
    updatePlayerAppearance();
    if(heartRoomUnlocked){
      showNpc(true);
      if(!npcIntroDone) runHeartRoomIntro();
      else {
        hideNpcBubble();
        hint.textContent = 'Aproxime-se de David e pressione E para falar com ele.';
      }
    } else {
      showNpc(false);
      hint.textContent = 'Você voltou para dentro de casa.';
    }
  }, 650);

  setTimeout(() => {
    sceneFade.classList.remove('show');
  }, 1050);

  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
  }, 1350);
}

function leaveHome(){
  if(isTransitioning || scene !== 'room') return;

  if(crystalExitReady){
    goToCrystalWorld();
    return;
  }

  if(heartRoomUnlocked && davidFollowing){
    goToPark();
    return;
  }

  if(!phoneFound){
    hint.textContent = 'Antes de sair, Agda precisa encontrar o celular.';
    return;
  }

  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  dialog.classList.add('hidden');
  hideNpcBubble();
  showNpc(false);
  hint.textContent = 'Agda saiu de casa...';
  stopAwakeningMusic();
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');

  setTimeout(() => {
    scene = 'village';
    stopCarouselAnimation();
    clearWorldInlineBackground();
    world.className = 'world village-world fade-in';
    player.classList.remove('hidden');
    showNpc(false);
    phoneItem.classList.add('hidden');
    phoneChat.classList.add('hidden');
    modal.classList.add('hidden');
    memoryCall.classList.add('hidden');
    if(!letterFound){
      letterBush.classList.remove('hidden');
      timerEl.classList.remove('hidden');
      hint.textContent = 'Você saiu de casa. Procure a carta escondida no arbusto.';
      updateTimer();
    } else {
      letterBush.classList.add('hidden');
      timerEl.classList.add('hidden');
      hint.textContent = 'As memórias a chamam de volta para dentro da casa.';
    }
    setPlayer(world.clientWidth * 0.70, world.clientHeight * 0.38);
    player.src = sprites.down;
    lastDir = 'down';
    updatePlayerAppearance();
  }, 650);

  setTimeout(() => {
    sceneFade.classList.remove('show');
  }, 1050);

  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
  }, 1350);
}

function enterParkScene(){
  scene = 'park';
  applyParkBackground();
  player.classList.remove('hidden');
  npcDavid.classList.remove('hidden');
  phoneItem.classList.add('hidden');
  letterBush.classList.add('hidden');
  timerEl.classList.add('hidden');
  phoneChat.classList.add('hidden');
  modal.classList.add('hidden');
  memoryCall.classList.add('hidden');
  dialog.classList.add('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.add('hidden');
  setPlayer(world.clientWidth * parkSpawnPlayer.x, world.clientHeight * parkSpawnPlayer.y);
  setNpc(world.clientWidth * parkSpawnDavid.x, world.clientHeight * parkSpawnDavid.y);
  player.src = sprites.right;
  lastDir = 'right';
  setNpcSprite('left');
  showNpc(true);
  updatePlayerAppearance();
  davidFollowing = false;
  hint.textContent = 'Um novo lugar se abriu dentro das memórias de Agda...';
  startSceneSequence([
    { name: 'Você', text: 'QUEEEE, a gente não estava um segundo em outro lugar?' },
    { name: 'David', text: 'Eu disse, a sua cabecinha tem muitas portas.' },
    { name: 'Você', text: 'E sua cabeça é desse jeito? haha' },
    { name: 'David', text: 'Há portas que nem eu mesmo imagino que existam.' },
    { name: 'Você', text: 'Então vamos nos divertir por enquanto. Vem comigo bebê' }
  ], () => {
    parkIntroDone = true;
    davidFollowing = true;
    hint.textContent = 'Guie David para dentro do parque de diversões.';
  });
}

function goToPark(){
  if(isTransitioning) return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  dialog.classList.add('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.add('hidden');
  hideNpcBubble();
  hint.textContent = 'As memórias mudam mais uma vez...';
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');

  setTimeout(() => {
    enterParkScene();
  }, 650);

  setTimeout(() => {
    sceneFade.classList.remove('show');
  }, 1050);

  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
  }, 1450);
}

function goToParkInside(){
  if(isTransitioning) return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  hint.textContent = 'Entrando mais fundo no parque...';
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');

  setTimeout(() => {
    scene = 'parkInside';
    parkInsideUnlocked = true;
    parkInsideIntroDone = false;
    parkCarouselReached = false;
    applyParkInsideBackground();
    player.classList.remove('hidden');
    npcDavid.classList.remove('hidden');
    setPlayer(world.clientWidth * parkInsideDialogPlayerPos.x, world.clientHeight * parkInsideDialogPlayerPos.y);
    setNpc(world.clientWidth * parkInsideDialogDavidPos.x, world.clientHeight * parkInsideDialogDavidPos.y);
    player.src = sprites.left;
    lastDir = 'left';
    setNpcSprite('right');
    showNpc(true);
    updatePlayerAppearance();
    updateDepth();
    davidFollowing = false;
    hint.textContent = 'Agda e David chegaram ao interior do AGGIELAND.';
  }, 650);

  setTimeout(() => {
    sceneFade.classList.remove('show');
  }, 1100);

  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
    startCarouselDialogue();
  }, 1500);
}

function startCarouselDialogue(){
  showAchievement('Os relacionamentos são compostos de fases');
  startSceneSequence([
    { name: 'Agda', text: 'Nossa mô é mais lindo ainda por dentro.' },
    { name: 'David', text: 'Sabia que ia gostar.' },
    { name: 'Agda', text: 'E como sabia disso? ^^' },
    { name: 'David', text: 'Esqueceu? Eu vivi tudo isso com você.' },
    { name: 'Agda', text: 'Eu ainda não entendi bem esse conceito...' },
    { name: 'David', text: 'Não se preocupe, vai entender um dia. Que tal... Carrossel?' },
    { name: 'Agda', text: 'Acho uma boa, bora lá?' }
  ], () => {
    parkInsideIntroDone = true;
    davidFollowing = true;
    hint.textContent = 'Guie David até o Carrossel.';
  });
}

function reachCarouselMeetingPoint(){
  if(isTransitioning || scene !== 'parkInside' || parkCarouselReached || !parkInsideIntroDone) return;
  parkCarouselReached = true;
  davidFollowing = false;
  goToCarouselScene();
}

function goToCarouselScene(){
  if(isTransitioning) return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  dialog.classList.add('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.add('hidden');
  hint.textContent = 'O passeio de carrossel começa...';
  scene = 'carousel';
  applyCarouselSceneBackground();
  player.classList.add('hidden');
  npcDavid.classList.add('hidden');
  hideNpcBubble();
  clearBadPhaseTimers();
  setTimeout(() => {
    hint.textContent = 'Agda e David aproveitam diversas fases do amor juntos.';
    isTransitioning = false;
    badPhaseTransitionTimer = setTimeout(() => {
      if(scene === 'carousel') startBadPhase();
    }, 5200);
  }, 300);
}

function startBadPhase(){
  if(isTransitioning) return;
  clearBadPhaseTimers();
  badPhaseUnlocked = true;
  badPhaseConversationDone = false;
  badPhaseBookReady = false;
  badPhaseBookGlowShown = false;
  badPhaseManuscriptOpen = false;
  nearBadDavid = false;
  nearBadBook = false;
  showAchievement('Você desbloqueou a Bad Phase.');
  isTransitioning = true;
  keys = {};
  hint.textContent = '...';
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');
  setTimeout(() => {
    scene = 'badroom1';
    applyBadPhaseBackground(1);
    player.classList.remove('hidden');
    npcDavid.classList.add('hidden');
    phoneItem.classList.add('hidden');
    letterBush.classList.add('hidden');
    timerEl.classList.add('hidden');
    phoneChat.classList.add('hidden');
    modal.classList.add('hidden');
    hideModalExtraActions();
    bookGlow.classList.add('hidden');
    setPlayer(world.clientWidth * badPhaseSpawn.x, world.clientHeight * badPhaseSpawn.y);
    player.src = sprites.up;
    lastDir = 'up';
    updatePlayerAppearance();
    hint.textContent = 'ENTÃO TUDO MUDOU...';
  }, 700);
  setTimeout(() => { sceneFade.classList.remove('show'); }, 1120);
  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
    hint.textContent = 'Vá até seu namorado David, ele parece mal.';
  }, 1450);
}

function isAtBadDavid(x = playerPos.x, y = playerPos.y){
  if(scene !== 'badroom1' || badPhaseConversationDone) return false;
  return pointInsideRect(getFeetPoint(x, y), toWorldRect(badPhaseDavidArea));
}
function isAtBadBook(x = playerPos.x, y = playerPos.y){
  if(scene !== 'badroom2' || !badPhaseBookGlowShown) return false;
  const size = worldSize();
  const p = getFeetPoint(x, y);
  const area = toWorldRect(badPhaseBookArea);
  const expanded = { x: area.x - size.w * 0.055, y: area.y - size.h * 0.025, w: area.w + size.w * 0.070, h: area.h + size.h * 0.070 };
  return pointInsideRect(p, expanded);
}
function startBadDavidConversation(){
  if(scene !== 'badroom1' || badPhaseConversationDone || isTransitioning) return;
  startSceneSequence([
    { name: 'Agda', text: 'Amor? tá tudo bem?' },
    { name: 'David', text: '...' },
    { name: 'Agda', text: 'O que está acontecendo?' },
    { name: 'David', text: '...' },
    { name: 'Aprendizado', text: 'O que torna os casais fortes, não são os momentos bons. Mas a capacidade de passar pelos momentos ruins, destruir a si mesmo e se reconstruir melhores.' },
    { name: 'Agda', text: 'Nós tivemos uma fase ruim assim não é?' },
    { name: 'Agda', text: 'Sabemos como foi dificil, a maioria não aguentaria.' },
    { name: 'Agda', text: 'Relacionamento a distância nunca é fácil.' },
    { name: 'David', text: '...' },
    { name: 'David', text: 'Eu acho que preciso ir agora, me desculpe.' },
    { name: 'Insegurança', text: 'Mas... nem sempre as pessoas estão dispostas a lidar com isso.' }
  ], () => {
    badPhaseConversationDone = true;
    transitionToBadPhaseEmptyRoom();
  });
}
function transitionToBadPhaseEmptyRoom(){
  if(isTransitioning) return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');
  setTimeout(() => {
    scene = 'badroom2';
    applyBadPhaseBackground(2);
    bookGlow.classList.add('hidden');
    hint.textContent = '...';
  }, 340);
  setTimeout(() => { sceneFade.classList.remove('show'); }, 690);
  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
    startSceneSequence([
      { name: 'Agda', text: '...' },
      { name: 'Agda', text: 'Eu fiquei... sozinha?' },
      { name: 'Abandono', text: 'Tente buscar uma saída.' }
    ], () => {
      hint.textContent = 'Tente buscar uma saída.';
      scheduleBadPhaseBookGlow();
    });
  }, 950);
}
function scheduleBadPhaseBookGlow(){
  clearBadPhaseTimers();
  badPhaseBookReady = false;
  badPhaseBookGlowShown = false;
  bookGlow.classList.add('hidden');
  badPhaseBookTimer = setTimeout(() => {
    if(scene !== 'badroom2') return;
    badPhaseBookReady = true;
    badPhaseBookGlowShown = true;
    bookGlow.classList.remove('hidden');
    hint.textContent = 'Algo está brilhando em uma das prateleiras.';
  }, 40000);
}
let dimensionalPuzzleTimer = null;
let dimensionalPuzzleStarted = false;
let draggedPuzzlePiece = null;

function openBadPhaseManuscript(){
  if(scene !== 'badroom2' || !badPhaseBookGlowShown) return;
  badPhaseManuscriptOpen = true;
  dimensionalPuzzleStarted = false;
  clearTimeout(dimensionalPuzzleTimer);

  letterModalImg.src = 'assets/heart.png';
  letterModalImg.classList.add('dimensional-heart');
  modalTitle.textContent = 'Quebra-cabeça dimensional';
  modalText.textContent = 'Aggie, meu amor. Você foi arrastada para uma parte negativa da sua mente\n\nMas não se preocupe, nesses momentos será minha função te trazer de volta\n\nVocê só precisa resolver um quebra-cabeça dimensional, vamos lá!\n\nVai ser fácil, basta organizar as peças da pessoa mais importante da minha vida.';

  modal.classList.remove('hidden');
  modalAction.classList.add('hidden');
  modalAction.textContent = 'BORA COMEÇAR!';
  modalAction.onclick = startDimensionalPuzzle;
  modalExtraActions.classList.add('hidden');
  modalExtraActions.innerHTML = '<div class="magic-wait">O botão mágico está se formando...</div>';

  dimensionalPuzzleTimer = setTimeout(() => {
    if(modal.classList.contains('hidden') || dimensionalPuzzleStarted) return;
    modalAction.classList.remove('hidden');
    modalAction.textContent = 'BORA COMEÇAR!';
    modalAction.onclick = startDimensionalPuzzle;
    modalExtraActions.classList.remove('hidden');
    modalExtraActions.innerHTML = '<div class="magic-ready">O coração abriu uma passagem mágica.</div>';
  }, 10000);
}

function startDimensionalPuzzle(){
  dimensionalPuzzleStarted = true;
  clearTimeout(dimensionalPuzzleTimer);
  letterModalImg.src = 'assets/heart.png';
  letterModalImg.classList.add('dimensional-heart');
  modalTitle.textContent = 'Organize as peças';
  modalText.textContent = 'Arraste uma peça sobre a outra para trocar de lugar. Quando a imagem ficar correta, o coração vai reconhecer.';
  modalAction.classList.add('hidden');
  modalExtraActions.classList.remove('hidden');
  modalExtraActions.innerHTML = '';

  const puzzleWrap = document.createElement('div');
  puzzleWrap.className = 'dimensional-puzzle-wrap';
  const grid = document.createElement('div');
  grid.className = 'dimensional-puzzle-grid';

  const correctOrder = Array.from({length: 9}, (_, i) => i);
  let shuffled = [3, 0, 5, 7, 1, 8, 2, 6, 4];

  shuffled.forEach((pieceId, slotIndex) => {
    const piece = document.createElement('button');
    piece.type = 'button';
    piece.className = 'puzzle-piece';
    piece.draggable = true;
    piece.dataset.id = String(pieceId);
    piece.dataset.slot = String(slotIndex);
    const col = pieceId % 3;
    const row = Math.floor(pieceId / 3);
    piece.style.backgroundImage = 'url("assets/dimensional_puzzle.png")';
    piece.style.backgroundSize = '300% 300%';
    piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
    piece.addEventListener('dragstart', handlePuzzleDragStart);
    piece.addEventListener('dragover', handlePuzzleDragOver);
    piece.addEventListener('drop', handlePuzzleDrop);
    piece.addEventListener('dragend', handlePuzzleDragEnd);
    grid.appendChild(piece);
  });

  const tip = document.createElement('div');
  tip.className = 'puzzle-tip';
  tip.textContent = 'Monte a imagem correta da princesa.';
  puzzleWrap.appendChild(grid);
  puzzleWrap.appendChild(tip);
  modalExtraActions.appendChild(puzzleWrap);
}

function handlePuzzleDragStart(e){
  draggedPuzzlePiece = e.currentTarget;
  e.currentTarget.classList.add('dragging');
  if(e.dataTransfer){
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id);
  }
}
function handlePuzzleDragOver(e){
  e.preventDefault();
  if(e.dataTransfer) e.dataTransfer.dropEffect = 'move';
}
function handlePuzzleDrop(e){
  e.preventDefault();
  const target = e.currentTarget;
  if(!draggedPuzzlePiece || draggedPuzzlePiece === target) return;
  swapPuzzlePieces(draggedPuzzlePiece, target);
  checkDimensionalPuzzleSolved();
}
function handlePuzzleDragEnd(e){
  e.currentTarget.classList.remove('dragging');
  draggedPuzzlePiece = null;
}
function swapPuzzlePieces(a, b){
  const aId = a.dataset.id;
  const aBg = a.style.backgroundPosition;
  b.classList.add('piece-pop');
  a.classList.add('piece-pop');
  a.dataset.id = b.dataset.id;
  a.style.backgroundPosition = b.style.backgroundPosition;
  b.dataset.id = aId;
  b.style.backgroundPosition = aBg;
  setTimeout(()=>{ a.classList.remove('piece-pop'); b.classList.remove('piece-pop'); }, 250);
}
function checkDimensionalPuzzleSolved(){
  const pieces = Array.from(modalExtraActions.querySelectorAll('.puzzle-piece'));
  const solved = pieces.every((piece, index) => Number(piece.dataset.id) === index);
  if(!solved) return;
  setTimeout(showDimensionalPuzzleSuccess, 400);
}
function showDimensionalPuzzleSuccess(){
  hideModalExtraActions();
  letterModalImg.src = 'assets/heart.png';
  modalTitle.textContent = 'Parabéns!';
  modalText.textContent = 'Você é demais princesa. Sabia que conseguiria! ^^';
  modalAction.classList.remove('hidden');
  modalAction.textContent = 'Continuar';
  modalAction.onclick = returnFromDimensionalPuzzleToRoom;
}
function returnFromDimensionalPuzzleToRoom(){
  modal.classList.add('hidden');
  hideModalExtraActions();
  badPhaseManuscriptOpen = false;
  badPhaseBookGlowShown = false;
  badPhaseBookReady = false;
  bookGlow.classList.add('hidden');
  pressTip.classList.add('hidden');
  isTransitioning = true;
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');
  setTimeout(() => {
    scene = 'room';

    heartRoomUnlocked = false;
    davidFollowing = false;
    nearNpc = false;
    showNpc(false);
    stopCarouselAnimation();
    clearWorldInlineBackground();
    world.className = 'world room-world fade-in';

    setPlayer(world.clientWidth * .58, world.clientHeight * .58);
    player.src = sprites.down;
    player.classList.remove('hidden');

    
    npcDavid.classList.add('hidden');
    npcBubble.classList.add('hidden');

    phoneItem.classList.remove('hidden');
    letterBush.classList.add('hidden');
    messages.innerHTML = '';
    options.innerHTML = '';
    phoneFound = false;
    postPuzzlePhoneReady = true;
    crystalExitReady = false;
    postPuzzlePhoneStep = 0;
    crystalIntroStarted = false;
    crystalDeparturePlaying = false;
    crystalReptilianIntroDone = false;
    crystalPortalReady = false;
    crystalEndingTriggered = false;
    hint.textContent = 'Vasculhe o quarto atrás do seu telefone.';
  }, 450);
  setTimeout(() => { sceneFade.classList.remove('show'); }, 1000);
  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
  }, 1300);
}
function showBadPhaseRetry(){
  hideModalExtraActions();
  modalTitle.textContent = 'Aviso';
  modalText.textContent = 'Você não é fraca, eu sei que você pode. Tente novamente.';
  modalAction.textContent = 'Voltar ao manuscrito';
  modalAction.classList.remove('hidden');
  modalAction.onclick = () => openBadPhaseManuscript();
}

function resetDefaultModalAction(){
  modalAction.classList.remove('hidden');
  modalAction.textContent = 'Continuar';
  hideModalExtraActions();
  modalAction.onclick = ()=>{
    if(letterFound && !heartRoomUnlocked){
      showMemoryCallSequence();
    } else {
      startGame();
    }
  };
}

function startGame(){
  showScreen('game');
  scene='room'; gameStarted=true; isTransitioning=false; phoneFound=false; letterFound=false; heartRoomUnlocked=false; parkIntroDone=false; parkInsideUnlocked=false; parkInsideIntroDone=false; parkCarouselReached=false; chatIndex=0; timer=180; clearInterval(timerInterval); stopCarouselAnimation(); clearBadPhaseTimers();
  badPhaseUnlocked=false; badPhaseConversationDone=false; badPhaseBookReady=false; badPhaseBookGlowShown=false; badPhaseManuscriptOpen=false; postPuzzlePhoneReady=false; crystalExitReady=false; postPuzzlePhoneStep=0; crystalIntroStarted=false; crystalDeparturePlaying=false; crystalReptilianIntroDone=false; crystalPortalReady=false; crystalEndingTriggered=false; awakeningSequenceStarted=false; awakeningPortalReady=false; awakeningFrameIndex=0; stopAwakeningMusic();
  keys={}; nearPhone=false; nearLetter=false; nearNpc=false; nearBadDavid=false; nearBadBook=false; npcIntroDone=false; npcIntroPlaying=false; resetNpcConversation(); clearNpcIntroTimers();
  applyRoomBackground();
  setPlayer(world.clientWidth*0.73, world.clientHeight*0.56);
  player.src=sprites.down; lastDir='down';
  updatePlayerAppearance();
  player.classList.remove('hidden'); npcDavid.classList.remove('hidden'); phoneItem.classList.remove('hidden'); letterBush.classList.add('hidden'); bookGlow.classList.add('hidden'); timerEl.classList.add('hidden'); modal.classList.add('hidden'); resetDefaultModalAction(); memoryCall.classList.add('hidden'); dialog.classList.add('hidden'); dialogOptions.classList.add('hidden'); nextDialog.classList.remove('hidden'); achievement.classList.add('hidden'); showNpc(false); hideSceneFadeMessage();
  hint.textContent='Onde está seu celular, Agda? Use WASD ou setas para andar.';
  messages.innerHTML=''; options.innerHTML=''; phoneChat.classList.add('hidden'); sceneFade.classList.add('hidden'); sceneFade.classList.remove('show');
}

function addMsg(from,text){
  const div=document.createElement('div'); div.className='msg '+(from==='agda'?'agda':'unknown'); div.textContent=text; messages.appendChild(div); messages.scrollTop=messages.scrollHeight;
}

function addPostPuzzleOption(text, handler){
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.onclick = handler;
  options.appendChild(btn);
}
function addDavidLines(lines, onComplete, delay = 650){
  let i = 0;
  function next(){
    if(i >= lines.length){ if(onComplete) onComplete(); return; }
    addMsg('unknown', lines[i]);
    i++;
    setTimeout(next, delay);
  }
  next();
}
function openPostPuzzlePhone(){
  phoneFound = true;
  postPuzzlePhoneReady = false;
  phoneItem.classList.add('hidden');
  phoneChat.classList.remove('hidden');
  messages.innerHTML = '';
  options.innerHTML = '';
  hint.textContent = 'Responda as mensagens do David.';
  addMsg('unknown', `Você escapou minha vida <33\nTem pessoas que não conseguem escapar desses pensamentos.`);
  addPostPuzzleOption('Que pesadelo horrível, como você fez isso?', () => {
    addMsg('agda', 'Que pesadelo horrível, como você fez isso?');
    options.innerHTML = '';
    addDavidLines([
      'Eu conheço bastante você hihi',
      'Não foi dificil imaginar onde você estaria na sua cabecinha',
      'Pra te livrar daquele lugar, eu só precisei muda o padrão dos seus pensamentos.',
      'Ou melhor... você mudou! xD'
    ], () => {
      addPostPuzzleOption('Obrigada D, eu queria tanto te ver agora...', () => {
        addMsg('agda', 'Obrigada D, eu queria tanto te ver agora...');
        options.innerHTML = '';
        addPostPuzzleOption('Onde você está docinho?', () => {
          addMsg('agda', 'Onde você está docinho?');
          options.innerHTML = '';
          addDavidLines([
            'Eu estou bem próximo, um andar acima nos seus pensamentos.',
            'Porque você não sai pra fora e descobre?'
          ], () => {
            addPostPuzzleOption('Estou indo amor.', () => {
              addMsg('agda', 'Estou indo amor.');
              options.innerHTML = '';
              setTimeout(() => {
                phoneChat.classList.add('hidden');
                phoneItem.classList.add('hidden');
                crystalExitReady = true;
                phoneFound = true;
                hint.textContent = 'Saia para fora de casa.';
              }, 650);
            });
          });
        });
      });
    });
  });
}

function startCrystalConversation(){
  if(crystalIntroStarted || scene !== 'crystal') return;
  crystalIntroStarted = true;
  keys = {};
  pressTip.classList.add('hidden');
  hint.textContent = 'David está olhando para o horizonte...';
  player.src = sprites.up;
  lastDir = 'up';

  startSceneSequence([
    { name:'Agda', text:'Como você tá gigante assim kk. Que lugar é esse?' },
    { name:'Agda', text:'É extremamente lindo *-*' },
    { name:'David', text:'Quando nada nesse mundo está me preocupando.' },
    { name:'David', text:'Meus pensamentos sempre vem para esse cenário.' },
    { name:'David', text:'Eu tenho o visto de diversas formas em meus sonhos há muito tempo.' },
    { name:'David', text:'Eu quis compartilhar essa visão com você.' },
    { name:'Agda', text:'Porque você não olha para mim?' },
    { name:'David', text:'Eu simplesmente não consigo desviar o olhar.' },
    { name:'Agda', text:'Espera, se esse é meu sonho. Eu estar vendo isso...' },
    { name:'David', text:'Significa que você já viu, e de algum jeito lembrou que era importante.' },
    { name:'David', text:'Obrigado por isso...' },
    { name:'David', text:'Mas receio que chegou minha hora Aggie...' },
    { name:'Agda', text:'O que isso significa amor?' },
    { name:'David', text:'Daqui pra frente você deverá seguir sua jornada sozinha.' },
    { name:'David', text:'Já chegaram, eu preciso partir.' },
    { name:'David', text:'Boa sorte, minha doce Bonnie' }
  ], playCrystalDepartureSequence);
}

function playCrystalDepartureSequence(){
  if(crystalDeparturePlaying) return;
  crystalDeparturePlaying = true;
  keys = {};
  pressTip.classList.add('hidden');
  hint.textContent = 'Um objeto se aproxima no horizonte...';
  dialog.classList.add('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.add('hidden');
  player.classList.remove('hidden');
  player.src = sprites.up;
  lastDir = 'up';
  updatePlayerAppearance();
  phoneItem.classList.add('hidden');
  letterBush.classList.add('hidden');
  bookGlow.classList.add('hidden');
  crystalDepartureFrames.forEach((frame, index) => {
    setTimeout(() => {
      if(scene !== 'crystal') return;
      setCrystalWorldFrame(frame);
      if(index === crystalDepartureFrames.length - 1){
        hint.textContent = 'Sem olhar pra trás, David partiu...';
        setTimeout(startReptilianConversation, 900);
      }
    }, index * 1000);
  });
}

function startReptilianConversation(){
  if(scene !== 'crystal' || crystalReptilianIntroDone) return;
  crystalReptilianIntroDone = true;
  crystalDeparturePlaying = false;

  startSceneSequence([
    { name:'Reptiliano', text:'O que está fazendo parada?' },
    { name:'Reptiliano', text:'Seu lar está te chamando, chegou a hora de voltar.' },
    { name:'Reptiliano', text:'Você está há muito tempo presa nesse mundo de sonhos.' },
    { name:'Agda', text:'Do que está falando?' },
    { name:'Agda', text:'Eu não consigo me lembrar de muitas coisas desde que acordei aqui' },
    { name:'Reptiliano', text:'Isso é esperado, o inesperado é algum humano saber quem realmente é.' },
    { name:'Reptiliano', text:'Ainda tens um longo caminho a descobrir.' },
    { name:'Reptiliano', text:'Eu vou te ajudar abrindo um portal para que saia desse sub-pensamento.' },
    { name:'Reptiliano', text:'Continue seguindo as dicas, serão valiosas para acordar no mundo real.' }
  ], revealCrystalPortal);
}

function revealCrystalPortal(){
  if(scene !== 'crystal') return;
  crystalPortalReady = false;
  hint.textContent = 'Algo está se abrindo no horizonte...';
  setCrystalWorldFrame(crystalPortalFrames[0]);
  setTimeout(() => {
    if(scene !== 'crystal') return;
    setCrystalWorldFrame(crystalPortalFrames[1]);
    crystalPortalReady = true;
    hint.textContent = 'Entre no portal para continuar sua jornada.';
  }, 1000);
}

function isAtCrystalPortal(x = playerPos.x, y = playerPos.y){
  if(scene !== 'crystal' || !crystalPortalReady || crystalEndingTriggered) return false;
  return pointInsideRect(getFeetPoint(x, y), toWorldRect(crystalPortalArea));
}

function isAtAwakeningPortal(x = playerPos.x, y = playerPos.y){
  if(scene !== 'awakening' || !awakeningPortalReady || isTransitioning) return false;
  return pointInsideRect(getFeetPoint(x, y), toWorldRect(awakeningPortalArea));
}

function triggerCrystalPortalEnding(){
  if(scene !== 'crystal' || !crystalPortalReady || crystalEndingTriggered || isTransitioning) return;
  crystalEndingTriggered = true;
  goToAwakeningScene();
}

function runAwakeningSequence(){
  if(scene !== 'awakening' || awakeningSequenceStarted) return;
  awakeningSequenceStarted = true;
  awakeningFrameIndex = 0;
  awakeningPortalReady = false;
  startAwakeningMusic();
  hint.textContent = 'Foi aqui que você conheceu o trabalho do Marcelo Marins.';
  setTimeout(() => {
    if(scene !== 'awakening') return;
    crossfadeWorldFrame(awakeningFrames[1], 'world awakening-world', 1000);
    awakeningFrameIndex = 1;
    hint.textContent = 'Memórias são desbloqueadas.';
  }, 5000);
  setTimeout(() => {
    if(scene !== 'awakening') return;
    crossfadeWorldFrame(awakeningFrames[2], 'world awakening-world', 1000);
    awakeningFrameIndex = 2;
    showAchievement('Tudo começa a fazer sentido');
  }, 7200);
  setTimeout(() => {
    if(scene !== 'awakening') return;
    awakeningPortalReady = true;
    hint.textContent = 'Apenas continue andando.';
  }, 9000);
}

function triggerAwakeningPortalEnding(){
  if(scene !== 'awakening' || !awakeningPortalReady || isTransitioning) return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  hint.textContent = 'Agda atravessa o portal...';
  sceneFade.classList.remove('hidden');
  showSceneFadeMessage('');
  sceneFade.classList.add('show');
  stopAwakeningMusic();
  setTimeout(() => {
    showSceneFadeMessage('CONTINUA NA PRÓXIMA ATUALIZAÇÃO');
    hint.textContent = 'Fim da atualização.';
  }, 1200);
}

function goToAwakeningScene(){
  if(isTransitioning) return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  dialog.classList.add('hidden');
  dialogOptions.classList.add('hidden');
  nextDialog.classList.add('hidden');
  phoneChat.classList.add('hidden');
  modal.classList.add('hidden');
  hideNpcBubble();
  showNpc(false);
  hint.textContent = 'As memórias mudam mais uma vez...';
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');
  setTimeout(() => {
    scene = 'awakening';
    awakeningSequenceStarted = false;
    awakeningPortalReady = false;
    awakeningFrameIndex = 0;
    hideSceneFadeMessage();
    applyAwakeningBackground();
    setAwakeningWorldFrame(awakeningFrames[0]);
    player.classList.remove('hidden');
    npcDavid.classList.add('hidden');
    phoneItem.classList.add('hidden');
    letterBush.classList.add('hidden');
    bookGlow.classList.add('hidden');
    timerEl.classList.add('hidden');
    setPlayer(world.clientWidth * 0.555, world.clientHeight * 0.825);
    player.src = sprites.left;
    lastDir = 'left';
    updatePlayerAppearance();
  }, 650);
  setTimeout(() => { sceneFade.classList.remove('show'); }, 1050);
  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
    runAwakeningSequence();
  }, 1350);
}

function goToCrystalWorld(){
  if(isTransitioning) return;
  isTransitioning = true;
  keys = {};
  pressTip.classList.add('hidden');
  dialog.classList.add('hidden');
  phoneChat.classList.add('hidden');
  modal.classList.add('hidden');
  hideNpcBubble();
  showNpc(false);
  hint.textContent = 'Agda saiu de casa...';
  sceneFade.classList.remove('hidden');
  sceneFade.classList.add('show');
  setTimeout(() => {
    scene = 'crystal';
    crystalIntroStarted = false;
    crystalDeparturePlaying = false;
    crystalReptilianIntroDone = false;
    crystalPortalReady = false;
    crystalEndingTriggered = false;
    hideSceneFadeMessage();
    applyCrystalBackground();
    player.classList.remove('hidden');
    npcDavid.classList.add('hidden');
    phoneItem.classList.add('hidden');
    letterBush.classList.add('hidden');
    bookGlow.classList.add('hidden');
    timerEl.classList.add('hidden');
    setPlayer(world.clientWidth * 0.145, world.clientHeight * 0.690);
    player.src = sprites.up;
    lastDir = 'up';
    updatePlayerAppearance();
    hint.textContent = 'Um andar acima nos pensamentos...';
  }, 650);
  setTimeout(() => { sceneFade.classList.remove('show'); }, 1050);
  setTimeout(() => {
    sceneFade.classList.add('hidden');
    isTransitioning = false;
    startCrystalConversation();
  }, 1350);
}

function renderChatStep(){
  const step=chatSteps[chatIndex];
  addMsg(step.from, step.text);
  options.innerHTML='';
  if(step.options.length){
    step.options.forEach(opt=>{
      const btn=document.createElement('button'); btn.textContent=opt;
      btn.onclick=()=>{ addMsg('agda', opt); chatIndex++; setTimeout(renderChatStep,650); };
      options.appendChild(btn);
    });
  }else{
    const btn=document.createElement('button'); btn.textContent=step.end?'Sair para procurar a carta':'Continuar';
    btn.onclick=()=>{ if(step.end){ phoneChat.classList.add('hidden'); goVillage(); } else { chatIndex++; renderChatStep(); } };
    options.appendChild(btn);
  }
}
function openPhone(){
  if(postPuzzlePhoneReady) return openPostPuzzlePhone();
  if(phoneFound) return;
  phoneFound=true; phoneItem.classList.add('hidden'); phoneChat.classList.remove('hidden');
  hint.textContent='Responda as mensagens do número desconhecido.';
  renderChatStep();
}
function goVillage(){
  scene='village'; stopCarouselAnimation(); clearWorldInlineBackground(); world.className='world village-world fade-in'; player.classList.remove('hidden'); showNpc(false);
  updatePlayerAppearance();
  setPlayer(world.clientWidth*0.50, world.clientHeight*0.50);
  letterBush.classList.remove('hidden');
  timerEl.classList.remove('hidden');
  hint.textContent='Procure a carta escondida em um arbusto perto da casa. O tempo começou!';
  startTimer();
}
function startTimer(){
  clearInterval(timerInterval); updateTimer();
  timerInterval=setInterval(()=>{timer--; updateTimer(); if(timer<=0){clearInterval(timerInterval); hint.textContent='O tempo acabou! Tente novamente.';}},1000);
}
function updateTimer(){
  const m=String(Math.floor(timer/60)).padStart(2,'0'); const s=String(timer%60).padStart(2,'0');
  timerEl.textContent=`${m}:${s}`;
}
function findLetter(){
  if(scene!=='village' || letterFound) return;
  showNpc(false);
  letterFound = true;
  clearInterval(timerInterval);
  letterBush.classList.add('hidden');
  hint.textContent='A carta parece carregada de memórias...';
  showLetterModal();
}

function showLetterModal(){
  resetDefaultModalAction();
  modalTitle.textContent = 'A carta se abre lentamente...';
  modalText.textContent = 'Desde o momento que eu te encontrei, eu entendi ali que dedicaríamos nossa vida um ao outro.\n\nSeriamos como um só, vivendo em nosso próprio mundo e buscando nossos sonhos.\n\nMe diga, você consegue se lembrar? O que nós sentíamos pelo outro?';
  modalAction.textContent = 'Continuar';
  letterModalImg.src = 'assets/letter_open.png';
  modal.classList.remove('hidden');
}

function showMemoryCallSequence(){
  modal.classList.add('hidden');
  isTransitioning = true;
  memoryCall.classList.remove('hidden');
  hint.textContent = 'As palavras ecoam dentro do coração de Agda...';
  setTimeout(() => {
    memoryCall.classList.add('hidden');
    heartRoomUnlocked = true;
    isTransitioning = false;
    hint.textContent = 'Você deve voltar para aquele momento. Volte para casa.';
  }, 3600);
}
function rectCenter(el){ const r=el.getBoundingClientRect(), wr=world.getBoundingClientRect(); return {x:r.left-wr.left+r.width/2, y:r.top-wr.top+r.height/2}; }
function getNpcFeetPoint(){
  const r = npcDavid.getBoundingClientRect();
  const wr = world.getBoundingClientRect();
  return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height * 0.84 };
}
function getNpcCollisionRect(){
  if(npcDavid.classList.contains('hidden')) return null;
  const r = npcDavid.getBoundingClientRect();
  const wr = world.getBoundingClientRect();
  return {
    x: r.left - wr.left + r.width * 0.05,
    y: r.top - wr.top + r.height * 0.08,
    w: r.width * 0.90,
    h: r.height * 0.86
  };
}
function isBlockedByNpc(x, y){
  if(npcDavid.classList.contains('hidden')) return false;
  if(!(scene === 'room' || scene === 'park' || scene === 'parkInside')) return false;
  if(scene === 'room' && !heartRoomUnlocked) return false;
  const feet = getFeetRect(x, y);
  const npcRect = getNpcCollisionRect();
  return npcRect ? rectsOverlap(feet, npcRect) : false;
}
function loop(){
  if(gameStarted && !phoneChat.classList.contains('hidden')===false){ }
  if(gameStarted && scene !== 'carousel' && !isTransitioning && !npcIntroPlaying && screens.game.classList.contains('active') && phoneChat.classList.contains('hidden') && modal.classList.contains('hidden') && memoryCall.classList.contains('hidden')){
    let speed=3.2, dx=0, dy=0;
    if(keys.ArrowLeft||keys.a) dx-=speed;
    if(keys.ArrowRight||keys.d) dx+=speed;
    if(keys.ArrowUp||keys.w) dy-=speed;
    if(keys.ArrowDown||keys.s) dy+=speed;
    if(dx||dy){
      if(Math.abs(dx)>Math.abs(dy)) lastDir=dx>0?'right':'left'; else lastDir=dy>0?'down':'up';
      player.src=sprites[lastDir]; player.classList.add('walking');
    } else player.classList.remove('walking');
    const size=worldSize();
    const { w: playerW, h: playerH } = getPlayerSize();
    const minX = 8;
    const maxX = size.w - playerW - 8;
    const minY = 8;
    const maxY = size.h - playerH - 8;
    const proposedX = Math.max(minX, Math.min(maxX, playerPos.x+dx));
    const proposedY = Math.max(minY, Math.min(maxY, playerPos.y+dy));

    let playerMovedThisFrame = false;
    if(scene === 'village' && isAtHomeDoor(proposedX, proposedY)){
      setPlayer(proposedX, proposedY);
      playerMovedThisFrame = true;
      enterHome();
    } else if(scene === 'room' && isAtRoomExit(proposedX, proposedY)){
      setPlayer(proposedX, proposedY);
      playerMovedThisFrame = true;
      leaveHome();
    } else if(scene === 'park' && isAtParkExit(proposedX, proposedY) && davidFollowing){
      setPlayer(proposedX, proposedY);
      playerMovedThisFrame = true;
      goToParkInside();
    } else if(scene === 'parkInside' && isAtParkInsideCarouselTrigger(proposedX, proposedY) && davidFollowing && parkInsideIntroDone && !parkCarouselReached){
      setPlayer(proposedX, proposedY);
      playerMovedThisFrame = true;
      reachCarouselMeetingPoint();
    } else if(scene === 'crystal' && isAtCrystalPortal(proposedX, proposedY)){
      setPlayer(proposedX, proposedY);
      playerMovedThisFrame = true;
      triggerCrystalPortalEnding();
    } else if(scene === 'awakening' && isAtAwakeningPortal(proposedX, proposedY)){
      setPlayer(proposedX, proposedY);
      playerMovedThisFrame = true;
      triggerAwakeningPortalEnding();
    } else if(canMoveTo(proposedX, proposedY)){
      playerMovedThisFrame = proposedX !== playerPos.x || proposedY !== playerPos.y;
      setPlayer(proposedX, proposedY);
    } else {
      
      if(canMoveTo(proposedX, playerPos.y)) { setPlayer(proposedX, playerPos.y); playerMovedThisFrame = true; }
      else if(canMoveTo(playerPos.x, proposedY)) { setPlayer(playerPos.x, proposedY); playerMovedThisFrame = true; }
    }
    updateDavidFollower(playerMovedThisFrame);
    updateDepth();

    nearPhone = !phoneItem.classList.contains('hidden') && distance({x:playerPos.x+40,y:playerPos.y+60}, rectCenter(phoneItem)) < 95;
    nearLetter = !letterBush.classList.contains('hidden') && distance({x:playerPos.x+40,y:playerPos.y+60}, rectCenter(letterBush)) < 115;
    nearNpc = scene === 'room' && heartRoomUnlocked && !davidFollowing && !npcDavid.classList.contains('hidden') && distance({x:playerPos.x+40,y:playerPos.y+60}, rectCenter(npcDavid)) < 110;
    nearBadDavid = isAtBadDavid();
    nearBadBook = isAtBadBook();
    const nearHomeDoor = isAtHomeDoor();
    const nearRoomExit = isAtRoomExit();
    const nearParkExit = isAtParkExit();
    const nearCarouselTrigger = isAtParkInsideCarouselTrigger();
    const nearCrystalPortal = isAtCrystalPortal();
    const nearAwakeningPortal = isAtAwakeningPortal();
    if(nearHomeDoor){
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+15)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
      pressTip.innerHTML = 'Entrando...';
    } else if(nearRoomExit){
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+15)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
      pressTip.innerHTML = heartRoomUnlocked && davidFollowing ? 'Seguindo para o próximo lugar...' : (phoneFound ? 'Saindo...' : 'Encontre o celular primeiro');
    } else if(nearParkExit && davidFollowing){
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+15)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
      pressTip.innerHTML = 'Entrando no parque...';
    } else if(nearCarouselTrigger && davidFollowing && scene === 'parkInside' && parkInsideIntroDone && !parkCarouselReached){
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+15)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
      pressTip.innerHTML = 'Ir ao carrossel';
    } else if(nearCrystalPortal){
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+15)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
      pressTip.innerHTML = 'Entrar no portal';
    } else if(nearAwakeningPortal){
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+15)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
      pressTip.innerHTML = 'Continuar';
    } else if(nearNpc || nearBadDavid){
      pressTip.innerHTML = 'Pressione <b>E</b> para conversar';
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+5)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
    } else if(nearBadBook){
      pressTip.innerHTML = 'Pressione <b>E</b> para ler';
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+5)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
    } else if(nearPhone || nearLetter){
      pressTip.innerHTML = 'Pressione <b>E</b>';
      pressTip.classList.remove('hidden'); pressTip.style.left=(playerPos.x+15)+'px'; pressTip.style.top=(playerPos.y-36)+'px';
    } else pressTip.classList.add('hidden');
  }
  requestAnimationFrame(loop);
}

const btnStart = document.getElementById('btnStart');
const menuStage = document.getElementById('menuStage');
function handleStartClick(e){
  if(e){ e.preventDefault(); }
  startGame();
}
if (btnStart) {
  ['click','pointerup','touchend'].forEach(eventName=>{
    btnStart.addEventListener(eventName, handleStartClick);
  });
}
if (menuStage) {
  menuStage.addEventListener('click', handleStartClick);
}

document.getElementById('closeChat').onclick=()=>phoneChat.classList.add('hidden');
nextDialog.onclick = () => { if(sceneSequence) advanceSceneSequence(); else advanceDavidDialog(); };
resetDefaultModalAction();
phoneItem.onclick=openPhone; letterBush.onclick=findLetter;
window.addEventListener('keydown',e=>{ keys[e.key]=true; keys[e.key.toLowerCase()]=true; if(e.key.toLowerCase()==='e'){ if(nearNpc && dialog.classList.contains('hidden')) startDavidDialog(); else if(nearBadDavid && dialog.classList.contains('hidden')) startBadDavidConversation(); else if(nearBadBook && modal.classList.contains('hidden')) openBadPhaseManuscript(); else if(nearPhone) openPhone(); else if(nearLetter) findLetter(); else if(isAtHomeDoor()) enterHome(); else if(isAtRoomExit()) leaveHome(); else if(isAtParkExit() && davidFollowing) goToParkInside(); else if(isAtParkInsideCarouselTrigger() && davidFollowing && parkInsideIntroDone && !parkCarouselReached) reachCarouselMeetingPoint(); else if(isAtCrystalPortal()) triggerCrystalPortalEnding(); else if(isAtAwakeningPortal()) triggerAwakeningPortalEnding(); } });
window.addEventListener('keyup',e=>{ keys[e.key]=false; keys[e.key.toLowerCase()]=false; });
window.addEventListener('resize',()=>{ if(scene==='room' && !gameStarted) setPlayer(world.clientWidth*.73, world.clientHeight*.56); });
loop();
