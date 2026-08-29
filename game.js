(function(){
  const COLS = 7, ROWS = 8;

  const POS = {1:[25,25],2:[50,25],3:[75,25],4:[25,50],5:[50,50],6:[75,50],7:[25,75],8:[50,75],9:[75,75]};

  const STD_DICE   = [[5],[1,9],[1,5,9],[1,3,7,9],[1,3,5,7,9],[1,3,4,6,7,9]];
  const PIP4_A     = [[1,3,7,9],[1,3,4,6],[4,6,7,9],[1,4,7,9],[2,4,6,8],[1,3,5,9]];
  const PIP4_B     = [[1,2,4,5],[2,3,5,6],[4,5,7,8],[5,6,8,9],[1,3,4,9],[3,7,4,9]];
  const PIP3       = [[1,5,9],[3,5,7],[1,4,7],[3,6,9],[2,5,8],[1,5,7]];
  const PIP5       = [[1,3,5,7,9],[1,2,4,5,7],[2,3,5,6,9],[1,4,5,6,9],[1,2,5,8,9],[3,4,5,6,7]];

  const DOT_WIDE   = [1,3,7,9,5,2];
  const DOT_CLOSE  = [1,2,3,6,9];
  const DOT_ALL9   = [1,2,3,4,5,6,7,8,9];

  const DIR4 = [0,90,180,270];
  const DIR6 = [0,60,120,180,240,300];
  const DIR8 = [0,45,90,135,180,225,270,315];

  const TRIGRAM4 = ['☰','☷','☵','☲'];
  const SUIT_SET = ['♠','♥','♦','♣'];
  const TRIGRAM8 = ['☰','☱','☲','☳','☴','☵','☶','☷'];

  const FACE_EASY = [
    { brow:0,   mouth:'M28,60 Q50,82 72,60' },
    { brow:0,   mouth:'M28,72 Q50,48 72,72' },
    { brow:14,  mouth:'M28,66 Q50,66 72,66' },
    { brow:-14, mouth:'M28,66 Q50,66 72,66' }
  ];
  const FACE_HARD = [
    { brow:0,  mouth:'M30,65 Q50,65 70,65' },
    { brow:0,  mouth:'M30,63 Q50,74 70,63' },
    { brow:0,  mouth:'M30,68 Q50,58 70,68' },
    { brow:6,  mouth:'M30,65 Q50,65 70,65' },
    { brow:6,  mouth:'M30,63 Q50,74 70,63' },
    { brow:-6, mouth:'M30,68 Q50,58 70,68' }
  ];
  const FACE_MIXED = FACE_EASY.concat(FACE_HARD);

  const STAGE_POOL = [
    { name:'표준 주사위',      type:'dice-std' },
    { name:'점 하나',          type:'dot',     positions:DOT_WIDE },
    { name:'화살표 4방향',      type:'arrow',   dirs:DIR4 },
    { name:'씨앗 위치',        type:'seed',    positions:[1,3,5,6,7,8] },
    { name:'건곤감리',          type:'trigram', set:TRIGRAM4 },
    { name:'표정 (뚜렷하게)',   type:'face',    set:FACE_EASY },
    { name:'클로버',            type:'clover' },
    { name:'물방울',            type:'drop',    positions:[1,2,3,4,5,6] },
    { name:'점 4개 배치 A',     type:'pips',    combos:PIP4_A },
    { name:'화살표 6방향',      type:'arrow',   dirs:DIR6 },
    { name:'종',                type:'bell',    positions:[1,2,3,4] },
    { name:'팔괘 전체',         type:'trigram', set:TRIGRAM8 },
    { name:'표정 (미세하게)',   type:'img6',    prefix:'face' },
    { name:'씨앗 위치 (좁게)',   type:'seed',    positions:[1,2,3,4] },
    { name:'퍼즐 조각',         type:'puzzle',  positions:[1,2,3,4] },
    { name:'점 3개 배치',       type:'pips',    combos:PIP3 },
    { name:'점 5개 배치',       type:'pips',    combos:PIP5 },
    { name:'점 하나 (좁게)',    type:'dot',     positions:DOT_CLOSE },
    { name:'화살표 8방향',      type:'arrow',   dirs:DIR8 },
    { name:'점 4개 배치 B',     type:'pips',    combos:PIP4_B },
    { name:'점 위치 (9칸 전체)', type:'dot',    positions:DOT_ALL9 },
    { name:'표정 (섞어서)',     type:'face',    set:FACE_MIXED },
    { name:'시계 바늘',         type:'clock',   dirs:DIR6 },
    { name:'카드 무늬',         type:'trigram', set:SUIT_SET },
    { name:'단추 구멍',         type:'button',  positions:[1,2,3,4] },
    { name:'신호등',            type:'traffic' }
  ];

  // 풀을 순환시키면서 스테이지 번호가 올라갈수록 목표점수/이동횟수를 자동으로 늘려서
  // 총 TOTAL_STAGES개의 스테이지를 생성 (하나하나 손으로 안 만듦)
  const TOTAL_STAGES = 1000;
  function buildStages(total){
    const arr = [];
    for(let i=0;i<total;i++){
      const base = STAGE_POOL[i % STAGE_POOL.length];
      arr.push(Object.assign({}, base, { target: 250 + Math.round(300*Math.sqrt(i)) }));
    }
    return arr;
  }
  const STAGES = buildStages(TOTAL_STAGES);

  function svgFaceCfg(cfg){
    return '<svg viewBox="0 0 100 100" width="86%" height="86%">'
      + '<circle cx="50" cy="50" r="42" fill="#f4c98a" stroke="#8a5a2b" stroke-width="3"/>'
      + '<circle cx="35" cy="46" r="4" fill="#2b2118"/>'
      + '<circle cx="65" cy="46" r="4" fill="#2b2118"/>'
      + '<line x1="27" y1="'+(33-cfg.brow)+'" x2="42" y2="'+(33+cfg.brow)+'" stroke="#2b2118" stroke-width="3" stroke-linecap="round"/>'
      + '<line x1="58" y1="'+(33+cfg.brow)+'" x2="73" y2="'+(33-cfg.brow)+'" stroke="#2b2118" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="'+cfg.mouth+'" stroke="#8a3b2b" stroke-width="3" fill="none" stroke-linecap="round"/>'
      + '</svg>';
  }
  function svgDotAt(posNum){
    const p = POS[posNum];
    return '<svg viewBox="0 0 100 100" width="86%" height="86%">'
      + '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="10" fill="#1f2a44"/>'
      + '</svg>';
  }
  function svgPipsCombo(combo){
    let dots = combo.map(function(p){ const c=POS[p]; return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="9" fill="#1f2a44"/>'; }).join('');
    return '<svg viewBox="0 0 100 100" width="86%" height="86%">'
      + dots + '</svg>';
  }
  function svgArrow(deg){
    return '<svg viewBox="0 0 100 100" width="74%" height="74%">'
      + '<g transform="rotate('+deg+' 50 50)">'
      + '<polygon points="50,15 76,68 50,54 24,68" fill="#1f2a44"/>'
      + '</g></svg>';
  }
  const SEED_SPOTS = { 1:[50,38],2:[36,50],3:[64,50],4:[50,58],5:[30,68],6:[70,68],7:[42,78],8:[58,78] };
  function svgSeedAt(spotNum){
    const p = SEED_SPOTS[spotNum];
    return '<svg viewBox="0 0 100 100" width="82%" height="82%">'
      + '<path d="M50,18 C32,18 18,36 18,56 C18,78 34,92 50,92 C66,92 82,78 82,56 C82,36 68,18 50,18 Z" fill="#e5484d" stroke="#8a1f24" stroke-width="4"/>'
      + '<path d="M38,20 L46,10 L50,20 L54,10 L62,20 Z" fill="#4caf50" stroke="#2e6b31" stroke-width="2"/>'
      + '<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="5" ry="7" fill="#f7d84a" stroke="#8a6a12" stroke-width="1.5"/>'
      + '</svg>';
  }
  const CLOVER_POS = { 1:[50,30],2:[70,50],3:[50,70],4:[30,50] };
  function svgCloverAt(leafNum){
    const p = CLOVER_POS[leafNum];
    const leaves = [[50,30],[70,50],[50,70],[30,50]].map(function(c){
      return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="19" fill="#5fbf5f" stroke="#2e6b31" stroke-width="3"/>';
    }).join('');
    return '<svg viewBox="0 0 100 100" width="82%" height="82%">'
      + '<line x1="50" y1="58" x2="50" y2="88" stroke="#2e6b31" stroke-width="5" stroke-linecap="round"/>'
      + leaves
      + '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#2e6b31"/>'
      + '</svg>';
  }
  const DROP_SPOTS = { 1:[40,35],2:[58,32],3:[35,55],4:[62,55],5:[45,70],6:[58,68] };
  function svgDropAt(spotNum){
    const p = DROP_SPOTS[spotNum];
    return '<svg viewBox="0 0 100 100" width="76%" height="82%">'
      + '<path d="M50,12 C62,32 78,52 78,68 C78,85 65,94 50,94 C35,94 22,85 22,68 C22,52 38,32 50,12 Z" fill="#4aa8e8" stroke="#1f5f8f" stroke-width="4"/>'
      + '<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="6" ry="8" fill="#ffffff" opacity="0.85"/>'
      + '</svg>';
  }
  const BELL_SPOTS = { 1:[50,45],2:[38,55],3:[62,55],4:[50,62] };
  function svgBellAt(spotNum){
    const p = BELL_SPOTS[spotNum];
    return '<svg viewBox="0 0 100 100" width="80%" height="80%">'
      + '<path d="M50,15 C56,15 60,19 60,24 C72,28 78,40 78,55 L82,72 L18,72 L22,55 C22,40 28,28 40,24 C40,19 44,15 50,15 Z" fill="#f2b73b" stroke="#8a611a" stroke-width="4"/>'
      + '<circle cx="50" cy="82" r="7" fill="#f2b73b" stroke="#8a611a" stroke-width="3"/>'
      + '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#8a3b2b"/>'
      + '</svg>';
  }
  const PUZZLE_SPOTS = { 1:[38,38],2:[62,38],3:[38,62],4:[62,62] };
  function svgPuzzleAt(spotNum){
    const p = PUZZLE_SPOTS[spotNum];
    return '<svg viewBox="0 0 100 100" width="80%" height="80%">'
      + '<path d="M25,25 H45 C45,18 55,18 55,25 H75 V45 C82,45 82,55 75,55 V75 H55 C55,82 45,82 45,75 H25 V55 C18,55 18,45 25,45 Z" fill="#6ec06e" stroke="#2e6b31" stroke-width="4"/>'
      + '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#2e6b31"/>'
      + '</svg>';
  }
  function svgClockAt(deg){
    let ticks = '';
    for(let i=0;i<12;i++){
      const a = i*30*Math.PI/180;
      const x1=50+Math.sin(a)*36, y1=50-Math.cos(a)*36;
      const x2=50+Math.sin(a)*30, y2=50-Math.cos(a)*30;
      ticks += '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#8a5a2b" stroke-width="2.5"/>';
    }
    return '<svg viewBox="0 0 100 100" width="80%" height="80%">'
      + '<circle cx="50" cy="50" r="40" fill="#fffdf7" stroke="#8a5a2b" stroke-width="4"/>'
      + ticks
      + '<g transform="rotate('+deg+' 50 50)"><line x1="50" y1="50" x2="50" y2="20" stroke="#1f2a44" stroke-width="5" stroke-linecap="round"/></g>'
      + '<line x1="50" y1="50" x2="68" y2="50" stroke="#1f2a44" stroke-width="4" stroke-linecap="round"/>'
      + '<circle cx="50" cy="50" r="4" fill="#1f2a44"/>'
      + '</svg>';
  }
  function svgTrafficAt(lit){
    const colors = ['#e5484d','#f2c14e','#4caf50'];
    const dim    = ['#7a3a3c','#7a6a3a','#3a5a3c'];
    const circles = [1,2,3].map(function(n){
      const on = n===lit;
      const c = on ? colors[n-1] : dim[n-1];
      const glow = on ? ' filter="drop-shadow(0 0 4px '+colors[n-1]+')"' : '';
      return '<circle cx="50" cy="'+(28+n*22)+'" r="12" fill="'+c+'"'+glow+'/>';
    }).join('');
    return '<svg viewBox="0 0 100 100" width="62%" height="90%">'
      + '<rect x="28" y="10" width="44" height="82" rx="14" fill="#2b2118" stroke="#000" stroke-width="2"/>'
      + circles
      + '</svg>';
  }
  const BUTTON_SPOTS = { 1:[38,38],2:[62,38],3:[38,62],4:[62,62] };
  function svgButtonAt(holeNum){
    const holes = [1,2,3,4].map(function(n){
      const p = BUTTON_SPOTS[n];
      const active = n===holeNum;
      return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="'+(active?'#c94f6b':'#8a7a5a')+'"/>';
    }).join('');
    return '<svg viewBox="0 0 100 100" width="80%" height="80%">'
      + '<circle cx="50" cy="50" r="42" fill="#f2e6c9" stroke="#8a7a5a" stroke-width="4"/>'
      + holes
      + '</svg>';
  }
  function renderSymbolHTML(stage, v){
    switch(stage.type){
      case 'dice-std': return svgPipsCombo(STD_DICE[v]);
      case 'img6':     return '<img src="assets/images/'+stage.prefix+'_'+(v+1)+'.png" style="width:100%;height:100%;object-fit:contain;">';
      case 'dot':      return svgDotAt(stage.positions[v]);
      case 'seed':     return svgSeedAt(stage.positions[v]);
      case 'clover':   return svgCloverAt(v+1);
      case 'drop':     return svgDropAt(stage.positions[v]);
      case 'bell':     return svgBellAt(stage.positions[v]);
      case 'puzzle':   return svgPuzzleAt(stage.positions[v]);
      case 'clock':    return svgClockAt(stage.dirs[v]);
      case 'traffic':  return svgTrafficAt(v+1);
      case 'button':   return svgButtonAt(stage.positions[v]);
      case 'arrow':    return svgArrow(stage.dirs[v]);
      case 'trigram':  return stage.set[v];
      case 'face':     return svgFaceCfg(stage.set[v]);
      case 'pips':     return svgPipsCombo(stage.combos[v]);
      default: return '?';
    }
  }
  function stageSize(stage){
    switch(stage.type){
      case 'dice-std': return STD_DICE.length;
      case 'img6':     return 6;
      case 'dot':      return stage.positions.length;
      case 'seed':     return stage.positions.length;
      case 'clover':   return 4;
      case 'drop':     return stage.positions.length;
      case 'bell':     return stage.positions.length;
      case 'puzzle':   return stage.positions.length;
      case 'clock':    return stage.dirs.length;
      case 'traffic':  return 3;
      case 'button':   return stage.positions.length;
      case 'arrow':    return stage.dirs.length;
      case 'trigram':  return stage.set.length;
      case 'face':     return stage.set.length;
      case 'pips':     return stage.combos.length;
      default: return 6;
    }
  }

  const gridEl = document.getElementById('grid');
  const lineLayer = document.getElementById('lineLayer');
  const targetValEl = document.getElementById('targetVal');
  const progressFillEl = document.getElementById('progressFill');
  const barStarEl = document.getElementById('barStar');
  const stageNumEl = document.getElementById('stageNum');
  const stageNameLblEl = document.getElementById('stageNameLbl');
  const movesValEl = document.getElementById('movesVal');
  const movesStarsEl = document.getElementById('movesStars');
  const movesScoreEchoEl = document.getElementById('movesScoreEcho');
  const heartsValEl = document.getElementById('heartsVal');
  const coinsValEl = document.getElementById('coinsVal');
  const starsValEl = document.getElementById('starsVal');
  const clearBestLineEl = document.getElementById('clearBestLine');
  const toastEl = document.getElementById('toast');
  const popEffectEl = document.getElementById('popEffect');
  const popTextEl = document.getElementById('popText');
  const popParticlesEl = document.getElementById('popParticles');
  const clearOverlay = document.getElementById('clearOverlay');
  const clearDescEl = document.getElementById('clearDesc');
  const clearStarsEl = document.getElementById('clearStars');
  const failOverlay = document.getElementById('failOverlay');
  const failDescEl = document.getElementById('failDesc');

  function fmt(n){ return n.toLocaleString('ko-KR'); }

  const HEART_MAX = 5;
  const HEART_REGEN_MS = 60*1000; // 1분당 1개

  let board = [];
  let cellEls = [];
  let stageIndex = 0;
  let stageScore = 0;
  let movesLeft = 0;
  let hearts = parseInt(localStorage.getItem('sp_hearts'), 10);
  if(isNaN(hearts)) hearts = HEART_MAX;
  let heartRegenAt = parseInt(localStorage.getItem('sp_heart_regen_at'), 10);
  if(isNaN(heartRegenAt)) heartRegenAt = 0;
  let coins = parseInt(localStorage.getItem('sp_coins')||'0',10);
  let totalStars = parseInt(localStorage.getItem('sp_stars')||'0',10);
  let stageBests = JSON.parse(localStorage.getItem('sp_stage_bests')||'[]');
  let chain = [];
  let dragging = false;
  let powerCounts = { candy:3, bomb:2, shuffle:2, rainbow:2 };

  coinsValEl.textContent = fmt(coins);
  starsValEl.textContent = totalStars;

  function saveHearts(){
    localStorage.setItem('sp_hearts', hearts);
    localStorage.setItem('sp_heart_regen_at', heartRegenAt);
  }

  function spendHeart(){
    if(hearts>=HEART_MAX && !heartRegenAt){
      heartRegenAt = Date.now() + HEART_REGEN_MS;
    }
    hearts = Math.max(0, hearts-1);
    saveHearts();
  }

  function tickHeartRegen(){
    if(hearts>=HEART_MAX){ heartRegenAt = 0; saveHearts(); return; }
    if(!heartRegenAt) return;
    const now = Date.now();
    if(now >= heartRegenAt){
      const gained = Math.floor((now-heartRegenAt)/HEART_REGEN_MS) + 1;
      hearts = Math.min(HEART_MAX, hearts+gained);
      heartRegenAt = hearts>=HEART_MAX ? 0 : heartRegenAt + gained*HEART_REGEN_MS;
      saveHearts();
    }
    updateHeartTimerDisplay();
  }

  function updateHeartTimerDisplay(){
    const timerEl = document.getElementById('heartTimer');
    if(!timerEl) return;
    if(hearts>=HEART_MAX || !heartRegenAt){
      timerEl.textContent = 'MAX';
    } else {
      const remain = Math.max(0, heartRegenAt - Date.now());
      const s = Math.ceil(remain/1000);
      const mm = Math.floor(s/60);
      const ss = String(s%60).padStart(2,'0');
      timerEl.textContent = mm+':'+ss;
    }
  }

  function currentStage(){ return STAGES[stageIndex % STAGES.length]; }
  function stageSlot(){ return stageIndex % STAGES.length; }
  function randSymbolIdx(){ return Math.floor(Math.random()*stageSize(currentStage())); }
  function movesBudget(){ return 16 + Math.min(30, Math.floor(stageIndex/15)); }

  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toastEl.classList.remove('show'), 1000);
  }

  function triggerPopEffect(count, gained){
    let tier = '';
    if(count>=9) tier = '<div class="line0">AMAZING!</div>';
    else if(count>=5) tier = '<div class="line0">GREAT!</div>';
    popTextEl.innerHTML = tier+'<div class="line1">연결 '+count+'개!</div><div class="line2">+'+fmt(gained)+'</div>';
    popParticlesEl.innerHTML = '';
    const symbols = ['⭐','✨','🌟'];
    const n = Math.min(18, 8 + count);
    for(let i=0;i<n;i++){
      const s = document.createElement('span');
      s.textContent = symbols[Math.floor(Math.random()*symbols.length)];
      const angle = Math.random()*Math.PI*2;
      const dist = 50 + Math.random()*90;
      s.style.setProperty('--dx', Math.cos(angle)*dist+'px');
      s.style.setProperty('--dy', Math.sin(angle)*dist+'px');
      s.style.animationDelay = Math.floor(Math.random()*120)+'ms';
      popParticlesEl.appendChild(s);
    }
    popEffectEl.classList.remove('show');
    void popEffectEl.offsetWidth;
    popEffectEl.classList.add('show');
  }

  function buildGrid(){
    gridEl.innerHTML = '';
    cellEls = [];
    for(let r=0;r<ROWS;r++){
      cellEls.push([]);
      for(let c=0;c<COLS;c++){
        const die = document.createElement('div');
        die.className = 'die';
        die.dataset.r = r; die.dataset.c = c;
        gridEl.appendChild(die);
        cellEls[r][c] = die;
      }
    }
  }

  function newStageBoard(){
    stageScore = 0;
    movesLeft = movesBudget();
    board = [];
    for(let r=0;r<ROWS;r++){
      const row=[];
      for(let c=0;c<COLS;c++) row.push(randSymbolIdx());
      board.push(row);
    }
    updateHud();
    render();
    checkNoMoves();
  }

  function updateHud(){
    const st = currentStage();
    stageNumEl.textContent = String(stageSlot()+1).padStart(2,'0');
    stageNameLblEl.textContent = st.name;
    targetValEl.textContent = fmt(st.target);
    const pct = Math.min(100, (stageScore/st.target)*100);
    progressFillEl.style.width = pct+'%';
    barStarEl.style.left = pct+'%';
    movesValEl.textContent = movesLeft;
    const ratio = stageScore / st.target;
    const liveStars = ratio>=2 ? 3 : (ratio>=1.4 ? 2 : (ratio>=1 ? 1 : 0));
    movesStarsEl.textContent = '⭐'.repeat(liveStars) + '☆'.repeat(3-liveStars);
    movesScoreEchoEl.textContent = fmt(stageScore);
    heartsValEl.textContent = hearts;
    updateHeartTimerDisplay();
    document.getElementById('cntCandy').textContent = powerCounts.candy;
    document.getElementById('cntBomb').textContent = powerCounts.bomb;
    document.getElementById('cntShuffle').textContent = powerCounts.shuffle;
    document.getElementById('cntRainbow').textContent = powerCounts.rainbow;
  }

  function render(){
    const stage = currentStage();
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        const v = board[r][c];
        const el = cellEls[r][c];
        if(v===null){ el.style.visibility='hidden'; }
        else { el.style.visibility='visible'; el.dataset.v=v; el.innerHTML = renderSymbolHTML(stage, v); }
        el.classList.remove('selected','popping');
        el.classList.toggle('imgTile', stage.type==='img6' && stage.prefix==='face');
      }
    }
  }

  function cellCenter(r,c){
    const rect = cellEls[r][c].getBoundingClientRect();
    const wrapRect = document.getElementById('boardWrap').getBoundingClientRect();
    return { x: rect.left+rect.width/2-wrapRect.left, y: rect.top+rect.height/2-wrapRect.top };
  }

  function drawChainLine(){
    lineLayer.innerHTML='';
    if(chain.length<2) return;
    const pts = chain.map(p=>cellCenter(p.r,p.c));
    const poly = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    poly.setAttribute('points', pts.map(p=>p.x+','+p.y).join(' '));
    poly.setAttribute('stroke', '#f2a93b');
    poly.setAttribute('stroke-width', '6');
    poly.setAttribute('stroke-linecap','round');
    poly.setAttribute('stroke-linejoin','round');
    poly.setAttribute('fill','none');
    poly.setAttribute('opacity','0.9');
    lineLayer.appendChild(poly);
  }

  function inChain(r,c){ return chain.some(p=>p.r===r && p.c===c); }
  function isAdjacent(a,b){ return Math.abs(a.r-b.r)<=1 && Math.abs(a.c-b.c)<=1 && !(a.r===b.r && a.c===b.c); }

  function cellFromPoint(x,y){
    const el = document.elementFromPoint(x,y);
    if(!el) return null;
    const die = el.closest('.die');
    if(!die) return null;
    const r = parseInt(die.dataset.r,10), c = parseInt(die.dataset.c,10);
    if(board[r][c]===null) return null;
    return {r,c};
  }

  function startChain(r,c){
    if(movesLeft<=0) return;
    chain = [{r,c}];
    cellEls[r][c].classList.add('selected');
    drawChainLine();
  }

  function extendChain(r,c){
    const value = board[chain[0].r][chain[0].c];
    if(board[r][c] !== value) return;
    const last = chain[chain.length-1];
    if(chain.length>=2){
      const prev = chain[chain.length-2];
      if(prev.r===r && prev.c===c){
        cellEls[last.r][last.c].classList.remove('selected');
        chain.pop();
        drawChainLine();
        return;
      }
    }
    if(inChain(r,c)) return;
    if(!isAdjacent(last,{r,c})) return;
    chain.push({r,c});
    cellEls[r][c].classList.add('selected');
    drawChainLine();
  }

  function endChain(){
    lineLayer.innerHTML='';
    if(chain.length>=2){ popChain(chain.slice()); }
    else if(chain.length===1){ cellEls[chain[0].r][chain[0].c].classList.remove('selected'); }
    chain=[];
  }

  function awardCoins(n){
    coins += n;
    localStorage.setItem('sp_coins', coins);
    coinsValEl.textContent = fmt(coins);
  }

  function popCells(cells, isBonus){
    const gained = isBonus ? cells.length*15 : cells.length*cells.length*10;
    stageScore += gained;
    let coinGain = Math.max(1, Math.floor(gained/20));
    if(cells.length>=9) coinGain += 15;
    else if(cells.length>=5) coinGain += 5;
    awardCoins(coinGain);
    triggerPopEffect(cells.length, gained);
    cells.forEach(({r,c})=>{
      cellEls[r][c].classList.add('popping');
      board[r][c] = null;
    });
    setTimeout(()=>{
      applyGravity();
      render();
      updateHud();
      if(stageScore >= currentStage().target){ showStageClear(); }
      else if(movesLeft<=0){ showStageFail(); }
      else { checkNoMoves(); }
    }, 180);
  }

  function popChain(cells){
    movesLeft = Math.max(0, movesLeft-1);
    popCells(cells, false);
  }

  function applyGravity(){
    for(let c=0;c<COLS;c++){
      const colVals = [];
      for(let r=0;r<ROWS;r++){ if(board[r][c]!==null) colVals.push(board[r][c]); }
      const missing = ROWS - colVals.length;
      const newCol = [];
      for(let i=0;i<missing;i++) newCol.push(randSymbolIdx());
      for(const v of colVals) newCol.push(v);
      for(let r=0;r<ROWS;r++) board[r][c] = newCol[r];
    }
  }

  function hasAnyMove(){
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        const v = board[r][c];
        for(let dr=-1;dr<=1;dr++){
          for(let dc=-1;dc<=1;dc++){
            if(dr===0&&dc===0) continue;
            const nr=r+dr, nc=c+dc;
            if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS && board[nr][nc]===v) return true;
          }
        }
      }
    }
    return false;
  }

  function checkNoMoves(){
    if(!hasAnyMove()){
      showToast('연결 가능한 조합이 없어 다시 섞습니다');
      setTimeout(()=>{ reshuffleInPlace(); render(); checkNoMoves(); }, 500);
    }
  }

  function reshuffleInPlace(){
    const flat = [];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) flat.push(board[r][c]);
    for(let i=flat.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [flat[i],flat[j]]=[flat[j],flat[i]];
    }
    let idx=0;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) board[r][c]=flat[idx++];
  }

  function showStageClear(){
    const st = currentStage();
    const ratio = stageScore / st.target;
    const stars = ratio>=2 ? 3 : (ratio>=1.4 ? 2 : 1);
    clearStarsEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3-stars);
    const slot = stageSlot();
    const prevBest = stageBests[slot]||0;
    if(stageScore > prevBest){
      stageBests[slot] = stageScore;
      localStorage.setItem('sp_stage_bests', JSON.stringify(stageBests));
      clearBestLineEl.textContent = prevBest>0
        ? '신기록! '+fmt(prevBest)+' → '+fmt(stageScore)
        : '이 스테이지 첫 기록: '+fmt(stageScore);
    } else {
      clearBestLineEl.textContent = '최고 기록 '+fmt(prevBest)+' (이번 '+fmt(stageScore)+')';
    }
    totalStars += stars;
    localStorage.setItem('sp_stars', totalStars);
    starsValEl.textContent = totalStars;
    awardCoins(30*stars + Math.floor(stageIndex/20));
    clearDescEl.textContent = st.name+' 스테이지 완료! 다음은 "'+STAGES[(stageIndex+1)%STAGES.length].name+'" 테마입니다.';
    clearOverlay.classList.add('show');
  }

  function showStageFail(){
    failDescEl.textContent = '목표 점수까지 '+(currentStage().target-stageScore)+'점 남았어요. 하트를 사용해서 이 스테이지를 다시 도전할까요?';
    failOverlay.classList.add('show');
  }

  document.getElementById('nextStageBtn').addEventListener('click', ()=>{
    clearOverlay.classList.remove('show');
    stageIndex++;
    newStageBoard();
  });
  document.getElementById('retryBtn').addEventListener('click', ()=>{
    if(hearts<=0){ showToast('하트가 부족해요! 상단 + 버튼으로 충전해보세요'); return; }
    spendHeart();
    updateHud();
    failOverlay.classList.remove('show');
    newStageBoard();
  });
  document.getElementById('giveUpBtn').addEventListener('click', ()=>{
    failOverlay.classList.remove('show');
    stageIndex = 0;
    newStageBoard();
  });

  gridEl.addEventListener('pointerdown', (e)=>{
    const cell = cellFromPoint(e.clientX,e.clientY);
    if(!cell) return;
    dragging = true;
    startChain(cell.r,cell.c);
    e.preventDefault();
  });
  window.addEventListener('pointermove',(e)=>{
    if(!dragging) return;
    const cell = cellFromPoint(e.clientX,e.clientY);
    if(cell) extendChain(cell.r,cell.c);
  });
  window.addEventListener('pointerup',()=>{
    if(!dragging) return;
    dragging=false;
    endChain();
  });

  // ---- power-ups ----
  document.getElementById('btnCandy').addEventListener('click', ()=>{
    if(powerCounts.candy<=0){ showToast('사탕 개수가 없어요'); return; }
    powerCounts.candy--;
    movesLeft += 3;
    updateHud();
    showToast('사탕 사용! 이동 횟수 +3');
  });
  document.getElementById('btnBomb').addEventListener('click', ()=>{
    if(powerCounts.bomb<=0){ showToast('폭탄 개수가 없어요'); return; }
    const candidates=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r][c]!==null) candidates.push({r,c});
    if(!candidates.length) return;
    const center = candidates[Math.floor(Math.random()*candidates.length)];
    const cells=[];
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      const r=center.r+dr, c=center.c+dc;
      if(r>=0&&r<ROWS&&c>=0&&c<COLS&&board[r][c]!==null) cells.push({r,c});
    }
    powerCounts.bomb--;
    updateHud();
    popCells(cells, true);
  });
  document.getElementById('btnShuffle').addEventListener('click', ()=>{
    if(powerCounts.shuffle<=0){ showToast('셔플 개수가 없어요'); return; }
    powerCounts.shuffle--;
    updateHud();
    reshuffleInPlace();
    render();
    checkNoMoves();
    showToast('보드를 섞었습니다');
  });
  document.getElementById('btnRainbow').addEventListener('click', ()=>{
    if(powerCounts.rainbow<=0){ showToast('무지개 개수가 없어요'); return; }
    const candidates=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r][c]!==null) candidates.push({r,c});
    if(!candidates.length) return;
    const pick = candidates[Math.floor(Math.random()*candidates.length)];
    const value = board[pick.r][pick.c];
    const cells=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r][c]===value) cells.push({r,c});
    powerCounts.rainbow--;
    updateHud();
    popCells(cells, true);
  });

  // ---- top bar / bottom nav stubs ----
  document.getElementById('heartPlus').addEventListener('click', ()=>{ hearts=HEART_MAX; heartRegenAt=0; saveHearts(); updateHud(); showToast('하트를 채웠습니다 (데모)'); });
  document.getElementById('coinPlus').addEventListener('click', ()=> showToast('상점은 준비 중이에요'));
  document.getElementById('gearBtn').addEventListener('click', ()=> showToast('설정은 준비 중이에요'));
  ['navShop','navRank','navAchieve'].forEach(id=>{
    document.getElementById(id).addEventListener('click', ()=> showToast('준비 중인 기능이에요'));
  });
  document.getElementById('navHome').addEventListener('click', ()=> showToast('현재 화면이 홈이에요'));

  buildGrid();
  tickHeartRegen();
  newStageBoard();
  window.addEventListener('resize', drawChainLine);
  setInterval(()=>{ tickHeartRegen(); heartsValEl.textContent = hearts; }, 1000);
})();
