(function(){
  const COLS = 6, ROWS = 8;

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
  const TRIGRAM_LINES = {
    '☰':[1,1,1], '☱':[1,1,0], '☲':[1,0,1], '☳':[1,0,0],
    '☴':[0,1,1], '☵':[0,1,0], '☶':[0,0,1], '☷':[0,0,0]
  };
  function svgTrigramAt(ch){
    const lines = TRIGRAM_LINES[ch];
    const ys = [28,50,72];
    const bars = lines.map(function(solid,i){
      const y = ys[i];
      if(solid) return '<rect x="18" y="'+(y-5)+'" width="64" height="10" rx="3" fill="#1f2a44"/>';
      return '<rect x="18" y="'+(y-5)+'" width="26" height="10" rx="3" fill="#1f2a44"/><rect x="56" y="'+(y-5)+'" width="26" height="10" rx="3" fill="#1f2a44"/>';
    }).join('');
    return '<svg viewBox="0 0 100 100" width="80%" height="80%">'+bars+'</svg>';
  }

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

  const CHICK_STAGE = { name:'병아리 마을 · Easy', type:'chick', setId:'easy', difficulty:1 };
  const STRAWBERRY_EASY = { name:'딸기 정원 · Easy', type:'chick', setId:'strawberry', difficulty:1 };
  const DOG_EASY = { name:'강아지 마을 · Easy', type:'chick', setId:'dog', difficulty:1 };
  const FLOWER_EASY = { name:'꽃 정원 · Easy', type:'chick', setId:'flower', difficulty:1 };
  const RABBIT_EASY = { name:'토끼 마을 · Easy', type:'chick', setId:'rabbit', difficulty:1 };
  const CAT_EASY = { name:'고양이 마을 · Easy', type:'chick', setId:'cat', difficulty:1 };
  const BEAR_EASY = { name:'곰돌이 마을 · Easy', type:'chick', setId:'bear', difficulty:1 };
  const PIG_EASY = { name:'아기돼지 마을 · Easy', type:'chick', setId:'pig', difficulty:1 };
  const TEST_THEME_ROTATION = [CHICK_STAGE, STRAWBERRY_EASY, DOG_EASY, FLOWER_EASY, RABBIT_EASY, CAT_EASY, BEAR_EASY, PIG_EASY];
  const CHICK_NORMAL = { name:'병아리 마을 · Normal', type:'chick', setId:'normal', difficulty:3 };
  const CHICK_HARD = { name:'병아리 마을 · Hard', type:'chick', setId:'hard', difficulty:5 };
  const CHICK_OBSERVE = { name:'병아리 마을 · 관찰 미션', type:'chick', setId:'hard', difficulty:5 };
  const CHICK_CHALLENGES = [
    { name:'두뇌 도전 · 건곤감리', type:'trigram', set:TRIGRAM4, difficulty:5 },
    { name:'두뇌 도전 · 점 배열', type:'pips', combos:PIP4_A, difficulty:5 },
    { name:'두뇌 도전 · 방향', type:'arrow', dirs:DIR6, difficulty:5 },
    { name:'두뇌 도전 · 점 위치', type:'dot', positions:DOT_WIDE, difficulty:5 },
    { name:'두뇌 도전 · 팔괘', type:'trigram', set:TRIGRAM8, difficulty:6 }
  ];

  const STAGE_POOL = [
    // difficulty: 1(가장 쉬움, 색깔/한눈에 구분) ~ 6(가장 어려움, 개수를 세거나 자세히 봐야 함)
    { name:'신호등',            type:'traffic', difficulty:1 },
    { name:'색깔 풍선',        type:'balloon', difficulty:1 },
    { name:'카드 무늬',         type:'trigram', set:SUIT_SET, difficulty:2 },
    { name:'건곤감리',          type:'trigram', set:TRIGRAM4, difficulty:2 },
    { name:'클로버',            type:'clover', difficulty:2 },
    { name:'표정 (뚜렷하게)',   type:'face',    set:FACE_EASY, difficulty:2 },
    { name:'점 하나',          type:'dot',     positions:DOT_WIDE, difficulty:3 },
    { name:'물방울',            type:'drop',    positions:[1,2,3,4,5,6], difficulty:3 },
    { name:'종',                type:'bell',    positions:[1,2,3,4], difficulty:3 },
    { name:'씨앗 위치',        type:'seed',    positions:[1,3,5,6,7,8], difficulty:3 },
    { name:'화살표 4방향',      type:'arrow',   dirs:DIR4, difficulty:4 },
    { name:'씨앗 위치 (좁게)',   type:'seed',    positions:[1,2,3,4], difficulty:4 },
    { name:'퍼즐 조각',         type:'puzzle',  positions:[1,2,3,4], difficulty:4 },
    { name:'단추 구멍',         type:'button',  positions:[1,2,3,4], difficulty:4 },
    { name:'점 하나 (좁게)',    type:'dot',     positions:DOT_CLOSE, difficulty:4 },
    { name:'화살표 6방향',      type:'arrow',   dirs:DIR6, difficulty:5 },
    { name:'시계 바늘',         type:'clock',   dirs:DIR6, difficulty:5 },
    { name:'팔괘 전체',         type:'trigram', set:TRIGRAM8, difficulty:5 },
    { name:'점 4개 배치 A',     type:'pips',    combos:PIP4_A, difficulty:5 },
    { name:'점 4개 배치 B',     type:'pips',    combos:PIP4_B, difficulty:5 },
    { name:'점 3개 배치',       type:'pips',    combos:PIP3, difficulty:5 },
    { name:'표준 주사위',      type:'dice-std', difficulty:6 },
    { name:'점 5개 배치',       type:'pips',    combos:PIP5, difficulty:6 },
    { name:'화살표 8방향',      type:'arrow',   dirs:DIR8, difficulty:6 },
    { name:'점 위치 (9칸 전체)', type:'dot',    positions:DOT_ALL9, difficulty:6 },
    { name:'표정 (섞어서)',     type:'face',    set:FACE_MIXED, difficulty:6 }
  ];

  // 풀을 순환시키면서 스테이지 번호가 올라갈수록 목표점수/이동횟수를 자동으로 늘려서
  // 총 TOTAL_STAGES개의 스테이지를 생성 (하나하나 손으로 안 만듦)
  const TOTAL_STAGES = 1000;

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
  const BELL_SPOTS = { 1:[50,32],2:[30,52],3:[70,52],4:[50,66] };
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
  const BALLOON_COLORS = ['#e5484d','#4a90d9','#f2c14e','#4caf50','#9b59b6','#f2914e'];
  function svgBalloonAt(idx){
    const c = BALLOON_COLORS[idx];
    return '<svg viewBox="0 0 100 100" width="76%" height="90%">'
      + '<ellipse cx="50" cy="42" rx="27" ry="33" fill="'+c+'" stroke="rgba(0,0,0,0.28)" stroke-width="2.5"/>'
      + '<ellipse cx="39" cy="27" rx="8" ry="13" fill="#ffffff" opacity="0.4"/>'
      + '<polygon points="46,73 54,73 50,81" fill="'+c+'" stroke="rgba(0,0,0,0.28)" stroke-width="1.5"/>'
      + '<path d="M50,81 C47,87 53,91 50,98" stroke="#6b5842" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      + '</svg>';
  }
  function renderSymbolHTML(stage, v){
    switch(stage.type){
      case 'chick': {
        const isStrawberry = stage.setId === 'strawberry';
        const isDog = stage.setId === 'dog';
        const isFlower = stage.setId === 'flower';
        const isRabbit = stage.setId === 'rabbit';
        const isCat = stage.setId === 'cat';
        const isBear = stage.setId === 'bear';
        const isPig = stage.setId === 'pig';
        const rabbitNames = ['happy','wink','laugh','surprise','grumpy','sleepy'];
        const filename = isPig ? 'pig_easy_'+(v+1) : isBear ? 'bear_easy_'+(v+1) : isCat ? 'cat_easy_'+(v+1) : isRabbit ? 'rabbit_'+String(v+1).padStart(2,'0')+'_'+rabbitNames[v] : (isStrawberry ? 'strawberry_easy_' : isDog ? 'dog_easy_' : isFlower ? 'flower_easy_' : 'chick_'+(stage.setId && stage.setId !== 'easy' ? stage.setId+'_' : ''))+(v+1);
        return '<img class="chickSymbol" draggable="false" src="assets/images/'+filename+'.png" alt="'+(isPig ? '아기돼지' : isBear ? '곰돌이' : isCat ? '고양이' : isRabbit ? '토끼' : isStrawberry ? '딸기' : isDog ? '강아지' : isFlower ? '꽃' : '병아리')+'">';
      }
      case 'dice-std': return svgPipsCombo(STD_DICE[v]);
      case 'img6':     return '<img src="assets/images/'+stage.prefix+'_'+(v+1)+'.png" style="width:108%;height:108%;object-fit:contain;">';
      case 'dot':      return svgDotAt(stage.positions[v]);
      case 'seed':     return svgSeedAt(stage.positions[v]);
      case 'clover':   return svgCloverAt(v+1);
      case 'drop':     return svgDropAt(stage.positions[v]);
      case 'bell':     return svgBellAt(stage.positions[v]);
      case 'puzzle':   return svgPuzzleAt(stage.positions[v]);
      case 'clock':    return svgClockAt(stage.dirs[v]);
      case 'traffic':  return svgTrafficAt(v+1);
      case 'button':   return svgButtonAt(stage.positions[v]);
      case 'balloon':  return svgBalloonAt(v);
      case 'arrow':    return svgArrow(stage.dirs[v]);
      case 'trigram':  return TRIGRAM_LINES[stage.set[v]] ? svgTrigramAt(stage.set[v]) : stage.set[v];
      case 'face':     return svgFaceCfg(stage.set[v]);
      case 'pips':     return svgPipsCombo(stage.combos[v]);
      default: return '?';
    }
  }
  function stageSize(stage){
    switch(stage.type){
      case 'chick': return 6;
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
      case 'balloon':  return BALLOON_COLORS.length;
      case 'arrow':    return stage.dirs.length;
      case 'trigram':  return stage.set.length;
      case 'face':     return stage.set.length;
      case 'pips':     return stage.combos.length;
      default: return 6;
    }
  }

  // 난이도 밴드: 패턴을 헷갈리는 정도(심볼 개수) 기준 오름차순 정렬해두고,
  // 스테이지 구간이 올라갈수록 사용 가능한 패턴 개수를 늘려서
  // "새로운 + 더 어려운" 패턴이 구간마다 순차적으로 등장하게 함.
  // 목표점수 배율도 구간마다 같이 올려서, 뒤로 갈수록 이동 1회당 필요한 점수 부담이 커짐.
  const POOL_SORTED = STAGE_POOL.slice().sort(function(a,b){
    if(a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
    return stageSize(a) - stageSize(b); // 같은 난이도면 심볼 개수로 세부 정렬
  });
  const DIFFICULTY_BANDS = [
    { from:0,   unlock:6,                  targetMul:1.00, timeLimit:null },
    { from:10,  unlock:10,                 targetMul:1.10, timeLimit:null },
    { from:20,  unlock:14,                 targetMul:1.25, timeLimit:90 },
    { from:35,  unlock:18,                 targetMul:1.45, timeLimit:80 },
    { from:60,  unlock:21,                 targetMul:1.70, timeLimit:70 },
    { from:90,  unlock:24,                 targetMul:2.00, timeLimit:65 },
    { from:130, unlock:POOL_SORTED.length, targetMul:2.35, timeLimit:60 },
    { from:220, unlock:POOL_SORTED.length, targetMul:2.80, timeLimit:55 },
    { from:350, unlock:POOL_SORTED.length, targetMul:3.30, timeLimit:50 },
    { from:550, unlock:POOL_SORTED.length, targetMul:3.90, timeLimit:45 }
  ];

    // V41: Stage-specific theme and difficulty; no 8-theme fixed rotation.
    const v41Themes=["chick","chick","chick","strawberry","strawberry","rabbit","flower","flower","flower","dog","dog","chick","cat","cat","cat","bear","bear","pig","pig","pig","strawberry","strawberry","rabbit","rabbit","rabbit","flower","flower","cat","cat","chick"];
    const v41Map={chick:CHICK_STAGE,strawberry:STRAWBERRY_EASY,dog:DOG_EASY,flower:FLOWER_EASY,rabbit:RABBIT_EASY,cat:CAT_EASY,bear:BEAR_EASY,pig:PIG_EASY};
    const v41Specials=[[], [], [], [], [], ["star"], [], [], [], ["stone"], ["stone"], ["star"], ["bomb"], ["bomb"], ["bomb", "star"], ["stone", "bomb"], ["stone"], ["ice"], ["ice"], ["stone", "ice"], ["gift"], ["gift", "star"], ["bomb", "gift"], ["stone", "bomb"], ["ice", "star"], ["rainbow"], ["rainbow", "star"], ["stone", "ice", "rainbow"], ["bomb", "gift", "rainbow"], ["stone", "bomb", "star", "ice", "gift", "rainbow"]];
    // V42 objective missions: zero-based stage slots, score target AND mission required.
    // V58: curated stages 31–50; zero-based stage indices.
  // Replays have the same challenge definition, while tile layouts remain varied.
  const V58_STAGES = [
    ['rabbit', 2100, 18, []],                      // 31 — cooldown
    ['rabbit', 2220, 18, ['star']],                // 32
    ['flower', 2350, 18, ['star']],                // 33
    ['flower', 2250, 18, ['ice']],                 // 34 — ice mission
    ['flower', 2420, 19, ['ice','star']],          // 35
    ['cat', 2500, 19, ['bomb']],                   // 36
    ['cat', 2350, 19, ['bomb','stone']],           // 37 — stone mission
    ['pig', 2600, 19, ['star','bomb']],            // 38
    ['pig', 2450, 18, ['gift']],                   // 39
    ['bear', 2650, 19, ['gift','star']],           // 40 — gift mission
    ['bear', 2570, 19, ['stone','bomb']],          // 41
    ['strawberry', 2780, 20, ['ice','star']],      // 42
    ['strawberry', 2680, 19, ['ice','star']],      // 43 — ice mission
    ['strawberry', 2870, 20, ['bomb','gift']],     // 44
    ['dog', 2950, 20, ['bomb','stone']],           // 45
    ['dog', 2800, 20, ['stone','bomb']],           // 46 — stone mission
    ['chick', 3050, 21, ['star','gift']],          // 47
    ['chick', 2920, 20, ['star','bomb']],          // 48 — star mission
    ['rabbit', 3080, 21, ['rainbow','ice']],       // 49
    ['rabbit', 3000, 21, ['rainbow','star']],      // 50 — rainbow mission
  ];
  const V58_MISSIONS = {
    33:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
    36:{kind:'bombStone',need:1,label:'💥 돌멩이 1개 제거'},
    39:{kind:'gift',need:1,label:'🎁 선물 1개 열기'},
    42:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
    45:{kind:'bombStone',need:1,label:'💥 돌멩이 1개 제거'},
    47:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'},
    49:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}
  };
  // V59: deliberate 51-100 content; zero-based index 50-99.
  const V59_STAGES = [
    ['cat', 2870, 22, []], // 51
    ['cat', 3110, 21, ['star']], // 52
    ['cat', 3170, 21, ['star']], // 53
    ['flower', 3220, 21, ['ice']], // 54
    ['flower', 3280, 21, ['ice']], // 55
    ['bear', 3330, 21, ['ice']], // 56
    ['bear', 3200, 21, ['bomb']], // 57
    ['bear', 3250, 21, ['bomb']], // 58
    ['strawberry', 3310, 21, ['bomb']], // 59
    ['strawberry', 3370, 21, ['bomb', 'gift']], // 60
    ['dog', 3240, 22, []], // 61
    ['dog', 3480, 21, ['gift']], // 62
    ['dog', 3340, 21, ['stone', 'bomb']], // 63
    ['rabbit', 3400, 21, ['stone', 'bomb']], // 64
    ['rabbit', 3450, 21, ['gift', 'stone', 'bomb']], // 65
    ['pig', 3510, 21, ['rainbow']], // 66
    ['pig', 3570, 22, ['rainbow']], // 67
    ['pig', 3620, 22, ['rainbow']], // 68
    ['chick', 3490, 22, ['ice', 'star']], // 69
    ['chick', 3540, 22, ['stone', 'bomb', 'ice', 'star']], // 70
    ['flower', 3420, 23, []], // 71
    ['flower', 3650, 22, ['gift', 'bomb']], // 72
    ['flower', 3710, 22, ['gift', 'bomb']], // 73
    ['cat', 3770, 22, ['gift', 'bomb']], // 74
    ['cat', 3630, 22, ['rainbow', 'stone', 'bomb']], // 75
    ['strawberry', 3690, 22, ['stone', 'bomb']], // 76
    ['strawberry', 3740, 22, ['stone', 'bomb']], // 77
    ['strawberry', 3800, 22, ['rainbow', 'star']], // 78
    ['bear', 3850, 22, ['rainbow', 'star']], // 79
    ['bear', 3910, 22, ['star', 'rainbow']], // 80
    ['dog', 3590, 23, []], // 81
    ['dog', 3830, 22, ['star']], // 82
    ['dog', 3890, 23, ['star']], // 83
    ['pig', 3940, 23, ['ice']], // 84
    ['pig', 4000, 23, ['ice']], // 85
    ['rabbit', 4050, 23, ['ice']], // 86
    ['rabbit', 3920, 23, ['bomb']], // 87
    ['rabbit', 3970, 23, ['bomb']], // 88
    ['chick', 4030, 23, ['bomb']], // 89
    ['chick', 4090, 23, ['stone', 'bomb', 'gift']], // 90
    ['flower', 3960, 24, []], // 91
    ['flower', 4200, 23, ['gift']], // 92
    ['flower', 4060, 23, ['stone', 'bomb']], // 93
    ['strawberry', 4120, 23, ['stone', 'bomb']], // 94
    ['strawberry', 4170, 23, ['gift', 'stone', 'bomb']], // 95
    ['cat', 4230, 23, ['rainbow']], // 96
    ['cat', 4290, 23, ['rainbow']], // 97
    ['cat', 4340, 23, ['rainbow']], // 98
    ['bear', 4210, 24, ['ice', 'star']], // 99
    ['bear', 4260, 24, ['rainbow', 'ice', 'star']], // 100
  ];
  const V59_MISSIONS={
    54:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
    59:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'},
    64:{kind:'gift',need:1,label:'🎁 선물 1개 열기'},
    69:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'},
    74:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'},
    79:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'},
    84:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
    89:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'},
    94:{kind:'gift',need:1,label:'🎁 선물 1개 열기'},
    99:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'},
  };
  // V60: curated 101–200 stages. Each entry: theme, target, moves, special tiles.
  const V60_STAGES = [
    ['pig', 3950, 25, []], // 101
    ['pig', 3970, 25, ['star']], // 102
    ['rabbit', 4240, 24, ['star']], // 103
    ['rabbit', 4260, 24, ['ice']], // 104
    ['dog', 4280, 24, ['ice']], // 105
    ['dog', 4300, 24, ['ice']], // 106
    ['strawberry', 4330, 24, ['bomb']], // 107
    ['strawberry', 4520, 24, ['bomb']], // 108
    ['flower', 4540, 24, ['bomb']], // 109
    ['cat', 4390, 25, ['bomb','gift']], // 110
    ['bear', 4160, 25, []], // 111
    ['bear', 4180, 25, ['stone','bomb']], // 112
    ['chick', 4450, 24, ['rainbow']], // 113
    ['chick', 4470, 24, ['rainbow']], // 114
    ['rabbit', 4490, 24, ['gift','rainbow']], // 115
    ['rabbit', 4520, 24, ['star','ice']], // 116
    ['flower', 4540, 24, ['star','ice']], // 117
    ['flower', 4730, 24, ['star','ice']], // 118
    ['dog', 4750, 24, ['gift','bomb']], // 119
    ['dog', 4600, 25, ['stone','bomb','gift']], // 120
    ['cat', 4370, 25, []], // 121
    ['cat', 4390, 25, ['stone','bomb','gift']], // 122
    ['pig', 4660, 24, ['stone','bomb','gift']], // 123
    ['pig', 4680, 24, ['stone','bomb','gift']], // 124
    ['strawberry', 4700, 24, ['rainbow','ice','bomb']], // 125
    ['strawberry', 4720, 24, ['ice','bomb']], // 126
    ['chick', 4750, 24, ['ice','bomb']], // 127
    ['bear', 4940, 24, ['rainbow','ice']], // 128
    ['strawberry', 4960, 24, ['rainbow','ice']], // 129
    ['strawberry', 4810, 25, ['star','rainbow','ice']], // 130
    ['rabbit', 4580, 26, []], // 131
    ['rabbit', 4600, 26, ['ice']], // 132
    ['cat', 4870, 25, ['ice']], // 133
    ['cat', 4890, 25, ['bomb']], // 134
    ['flower', 4910, 25, ['ice','bomb']], // 135
    ['flower', 4940, 25, ['bomb']], // 136
    ['pig', 4960, 25, ['gift']], // 137
    ['pig', 5150, 25, ['gift']], // 138
    ['chick', 5170, 25, ['gift']], // 139
    ['chick', 5020, 26, ['gift','stone','bomb']], // 140
    ['flower', 4790, 26, []], // 141
    ['flower', 4810, 26, ['rainbow']], // 142
    ['rabbit', 5080, 25, ['star','ice']], // 143
    ['rabbit', 5100, 25, ['star','ice']], // 144
    ['strawberry', 5120, 25, ['stone','bomb','star','ice']], // 145
    ['bear', 5140, 25, ['gift','bomb']], // 146
    ['cat', 5170, 25, ['gift','bomb']], // 147
    ['cat', 5360, 25, ['gift','bomb']], // 148
    ['dog', 5380, 25, ['rainbow','star']], // 149
    ['dog', 5230, 26, ['rainbow','star']], // 150
    ['chick', 5000, 26, []], // 151
    ['chick', 5020, 26, ['ice','bomb']], // 152
    ['pig', 5290, 25, ['ice','bomb']], // 153
    ['pig', 5310, 25, ['ice','bomb']], // 154
    ['bear', 5330, 25, ['bomb','rainbow','ice']], // 155
    ['bear', 5360, 25, ['rainbow','ice']], // 156
    ['rabbit', 5380, 25, ['rainbow','ice']], // 157
    ['rabbit', 5570, 25, ['star']], // 158
    ['flower', 5590, 25, ['star']], // 159
    ['flower', 5440, 26, ['star']], // 160
    ['dog', 5210, 27, []], // 161
    ['dog', 5230, 27, ['bomb']], // 162
    ['strawberry', 5500, 26, ['bomb']], // 163
    ['pig', 5520, 26, ['gift']], // 164
    ['chick', 5540, 26, ['ice','gift']], // 165
    ['chick', 5560, 26, ['gift']], // 166
    ['pig', 5590, 26, ['stone','bomb']], // 167
    ['pig', 5780, 26, ['stone','bomb']], // 168
    ['rabbit', 5800, 26, ['stone','bomb']], // 169
    ['rabbit', 5650, 27, ['gift','rainbow']], // 170
    ['dog', 5420, 27, []], // 171
    ['dog', 5440, 27, ['star','ice']], // 172
    ['flower', 5710, 26, ['gift','bomb']], // 173
    ['flower', 5730, 26, ['gift','bomb']], // 174
    ['cat', 5750, 26, ['stone','bomb','gift']], // 175
    ['cat', 5780, 26, ['rainbow','star']], // 176
    ['bear', 5800, 26, ['rainbow','star']], // 177
    ['bear', 5990, 26, ['rainbow','star']], // 178
    ['chick', 6010, 26, ['stone','bomb','gift']], // 179
    ['chick', 5860, 27, ['rainbow','stone','bomb','gift']], // 180
    ['rabbit', 5630, 27, []], // 181
    ['flower', 5650, 27, ['rainbow','ice']], // 182
    ['bear', 5920, 26, ['rainbow','ice']], // 183
    ['bear', 5940, 26, ['rainbow','ice']], // 184
    ['dog', 5960, 26, ['star']], // 185
    ['dog', 5980, 26, ['star']], // 186
    ['cat', 6010, 26, ['star']], // 187
    ['cat', 6200, 26, ['ice']], // 188
    ['pig', 6220, 26, ['ice']], // 189
    ['pig', 6070, 27, ['bomb','ice']], // 190
    ['chick', 5840, 28, []], // 191
    ['chick', 5860, 28, ['gift']], // 192
    ['bear', 6130, 27, ['gift']], // 193
    ['bear', 6150, 27, ['stone','bomb']], // 194
    ['strawberry', 6170, 27, ['ice','stone','bomb']], // 195
    ['strawberry', 6200, 27, ['stone','bomb']], // 196
    ['rabbit', 6220, 27, ['rainbow']], // 197
    ['rabbit', 6410, 27, ['rainbow']], // 198
    ['cat', 6430, 27, ['rainbow']], // 199
    ['flower', 6280, 28, ['rainbow','star','ice']], // 200
  ];
  const V60_MISSIONS = {
    104:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 105
    109:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 110
    114:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 115
    119:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 120
    124:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 125
    129:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 130
    134:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 135
    139:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 140
    144:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 145
    149:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 150
    154:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 155
    159:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 160
    164:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 165
    169:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 170
    174:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 175
    179:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 180
    184:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 185
    189:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 190
    194:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 195
    199:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 200
  };
  // V61: individually configured stage challenges 201–300.
  const V61_STAGES = [
    ['cat',6070,28,['ice','star']], // 201
    ['cat',6090,27,['ice','star']], // 202
    ['flower',6300,27,['ice','star']], // 203
    ['flower',6320,27,['bomb','gift']], // 204
    ['pig',6350,27,['ice','bomb','gift']], // 205
    ['pig',6370,27,['bomb','gift']], // 206
    ['rabbit',6390,27,['stone','bomb']], // 207
    ['rabbit',6600,27,['stone','bomb']], // 208
    ['dog',6620,27,['stone','bomb']], // 209
    ['dog',6470,28,['stone','bomb','rainbow','star']], // 210
    ['bear',6310,28,['rainbow','star']], // 211
    ['strawberry',6330,27,['rainbow','star']], // 212
    ['chick',6540,27,['gift','ice']], // 213
    ['chick',6560,27,['gift','ice']], // 214
    ['rabbit',6590,27,['gift','ice']], // 215
    ['rabbit',6610,27,['rainbow','bomb']], // 216
    ['pig',6630,27,['rainbow','bomb']], // 217
    ['pig',6840,27,['rainbow','bomb']], // 218
    ['flower',6860,27,['stone','bomb','star']], // 219
    ['flower',6710,28,['rainbow','stone','bomb','star']], // 220
    ['cat',6550,28,['ice','rainbow']], // 221
    ['cat',6570,27,['star','gift']], // 222
    ['bear',6780,27,['star','gift']], // 223
    ['bear',6800,27,['star','gift']], // 224
    ['dog',6830,27,['star','ice']], // 225
    ['dog',6850,27,['ice','star']], // 226
    ['chick',6870,27,['ice','star']], // 227
    ['chick',7080,27,['bomb','gift']], // 228
    ['cat',7100,27,['bomb','gift']], // 229
    ['cat',6950,28,['bomb','gift']], // 230
    ['flower',6790,29,['stone','bomb']], // 231
    ['flower',6810,28,['stone','bomb']], // 232
    ['pig',7020,28,['stone','bomb']], // 233
    ['rabbit',7040,28,['rainbow','star']], // 234
    ['dog',7070,28,['ice','rainbow','star']], // 235
    ['dog',7090,28,['rainbow','star']], // 236
    ['bear',7110,28,['gift','ice']], // 237
    ['bear',7320,28,['gift','ice']], // 238
    ['strawberry',7340,28,['gift','ice']], // 239
    ['strawberry',7190,29,['gift','rainbow','bomb']], // 240
    ['chick',7030,29,['stone','bomb','star']], // 241
    ['chick',7050,28,['stone','bomb','star']], // 242
    ['rabbit',7260,28,['ice','rainbow']], // 243
    ['rabbit',7280,28,['ice','rainbow']], // 244
    ['flower',7310,28,['stone','bomb','ice','rainbow']], // 245
    ['flower',7330,28,['star','gift']], // 246
    ['cat',7350,28,['star','gift']], // 247
    ['cat',7560,28,['star','gift']], // 248
    ['strawberry',7580,28,['ice','star']], // 249
    ['strawberry',7430,29,['rainbow','ice','star']], // 250
    ['bear',7270,29,['ice','star']], // 251
    ['bear',7290,28,['bomb','gift']], // 252
    ['dog',7500,28,['bomb','gift']], // 253
    ['dog',7520,28,['bomb','gift']], // 254
    ['chick',7550,28,['star','stone','bomb']], // 255
    ['cat',7570,28,['stone','bomb']], // 256
    ['flower',7590,28,['stone','bomb']], // 257
    ['flower',7800,28,['rainbow','star']], // 258
    ['pig',7820,28,['rainbow','star']], // 259
    ['pig',7670,29,['ice','rainbow','star']], // 260
    ['rabbit',7510,30,['rainbow','bomb']], // 261
    ['rabbit',7530,29,['rainbow','bomb']], // 262
    ['dog',7740,29,['rainbow','bomb']], // 263
    ['dog',7760,29,['stone','bomb','star']], // 264
    ['bear',7790,29,['bomb','stone','star']], // 265
    ['bear',7810,29,['stone','bomb','star']], // 266
    ['chick',7830,29,['ice','rainbow']], // 267
    ['chick',8040,29,['ice','rainbow']], // 268
    ['rabbit',8060,29,['ice','rainbow']], // 269
    ['rabbit',7910,30,['gift','star']], // 270
    ['pig',7750,30,['star','gift']], // 271
    ['pig',7770,29,['star','gift']], // 272
    ['flower',7980,29,['ice','star']], // 273
    ['flower',8000,29,['ice','star']], // 274
    ['cat',8030,29,['stone','bomb','ice','star']], // 275
    ['cat',8050,29,['bomb','gift']], // 276
    ['strawberry',8070,29,['bomb','gift']], // 277
    ['bear',8280,29,['bomb','gift']], // 278
    ['dog',8300,29,['stone','bomb']], // 279
    ['dog',8150,30,['rainbow','stone','bomb']], // 280
    ['chick',7990,30,['rainbow','star']], // 281
    ['chick',8010,29,['gift','ice']], // 282
    ['cat',8220,29,['gift','ice']], // 283
    ['cat',8240,29,['gift','ice']], // 284
    ['flower',8270,29,['ice','rainbow','bomb']], // 285
    ['flower',8290,29,['rainbow','bomb']], // 286
    ['pig',8310,29,['rainbow','bomb']], // 287
    ['pig',8520,29,['stone','bomb','star']], // 288
    ['dog',8540,29,['stone','bomb','star']], // 289
    ['dog',8390,30,['star','stone','bomb']], // 290
    ['bear',8230,31,['ice','rainbow']], // 291
    ['bear',8250,30,['ice','rainbow']], // 292
    ['strawberry',8460,30,['ice','rainbow']], // 293
    ['strawberry',8480,30,['star','gift']], // 294
    ['chick',8510,30,['stone','bomb','star','gift']], // 295
    ['chick',8530,30,['star','gift']], // 296
    ['rabbit',8550,30,['ice','star']], // 297
    ['rabbit',8760,30,['ice','star']], // 298
    ['pig',8780,30,['ice','star']], // 299
    ['flower',8630,31,['rainbow','bomb','gift']], // 300
  ];
  const V61_MISSIONS = {
    204:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 205
    209:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 210
    214:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 215
    219:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 220
    224:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 225
    229:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 230
    234:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 235
    239:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 240
    244:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 245
    249:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 250
    254:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 255
    259:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 260
    264:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 265
    269:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 270
    274:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 275
    279:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 280
    284:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 285
    289:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 290
    294:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 295
    299:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 300
  };
  // V62: 301-400 hand-configured stage profiles (theme / score / moves / available special types).
  const V62_STAGES = [
    ['rabbit', 6300, 29, []], // 301
    ['rabbit', 6320, 29, ['star','ice']], // 302
    ['dog', 6540, 28, ['star','ice']], // 303
    ['dog', 6550, 28, ['bomb','gift']], // 304
    ['cat', 6570, 28, ['ice','bomb','gift']], // 305
    ['cat', 6590, 28, ['bomb','gift']], // 306
    ['flower', 6610, 28, ['rainbow','star']], // 307
    ['flower', 6730, 28, ['rainbow','star']], // 308
    ['pig', 6740, 28, ['rainbow','star']], // 309
    ['pig', 6660, 29, ['stone','bomb']], // 310
    ['strawberry', 6480, 29, []], // 311
    ['bear', 6500, 29, ['stone','bomb']], // 312
    ['chick', 6720, 28, ['ice','bomb']], // 313
    ['chick', 6730, 28, ['ice','bomb']], // 314
    ['rabbit', 6750, 28, ['gift','ice','bomb']], // 315
    ['rabbit', 6770, 28, ['gift','rainbow']], // 316
    ['dog', 6790, 28, ['gift','rainbow']], // 317
    ['dog', 6910, 28, ['gift','rainbow']], // 318
    ['cat', 6920, 28, ['star','bomb']], // 319
    ['cat', 6840, 29, ['star','ice','gift']], // 320
    ['flower', 6660, 29, []], // 321
    ['flower', 6680, 29, ['star','ice']], // 322
    ['strawberry', 6900, 28, ['star','ice']], // 323
    ['strawberry', 6910, 28, ['star','ice']], // 324
    ['bear', 6930, 28, ['rainbow','bomb','gift']], // 325
    ['bear', 6950, 28, ['bomb','gift']], // 326
    ['chick', 6970, 28, ['bomb','gift']], // 327
    ['chick', 7090, 28, ['rainbow','star']], // 328
    ['rabbit', 7100, 28, ['rainbow','star']], // 329
    ['rabbit', 7020, 29, ['bomb','rainbow','star']], // 330
    ['dog', 6840, 29, []], // 331
    ['dog', 6860, 29, ['stone','bomb']], // 332
    ['cat', 7080, 28, ['stone','bomb']], // 333
    ['flower', 7090, 28, ['ice','bomb']], // 334
    ['pig', 7110, 28, ['ice','bomb']], // 335
    ['pig', 7130, 29, ['ice','bomb']], // 336
    ['strawberry', 7150, 29, ['gift','rainbow']], // 337
    ['strawberry', 7270, 29, ['gift','rainbow']], // 338
    ['bear', 7280, 29, ['star','bomb']], // 339
    ['bear', 7200, 30, ['rainbow','ice','gift']], // 340
    ['chick', 7020, 30, []], // 341
    ['chick', 7040, 30, ['ice','gift']], // 342
    ['rabbit', 7260, 29, ['star','ice']], // 343
    ['rabbit', 7270, 29, ['star','ice']], // 344
    ['cat', 7290, 29, ['stone','bomb','star','ice']], // 345
    ['cat', 7310, 29, ['bomb','gift']], // 346
    ['flower', 7330, 29, ['bomb','gift']], // 347
    ['flower', 7450, 29, ['bomb','gift']], // 348
    ['pig', 7460, 29, ['rainbow','star']], // 349
    ['pig', 7380, 30, ['gift','rainbow','star']], // 350
    ['strawberry', 7200, 30, []], // 351
    ['strawberry', 7220, 30, ['stone','bomb']], // 352
    ['bear', 7440, 29, ['stone','bomb']], // 353
    ['bear', 7450, 29, ['stone','bomb']], // 354
    ['chick', 7470, 29, ['star','ice','bomb']], // 355
    ['rabbit', 7490, 29, ['ice','bomb']], // 356
    ['dog', 7510, 29, ['ice','bomb']], // 357
    ['dog', 7630, 29, ['star','bomb']], // 358
    ['cat', 7640, 29, ['star','bomb']], // 359
    ['cat', 7560, 30, ['bomb','star']], // 360
    ['flower', 7380, 30, []], // 361
    ['flower', 7400, 30, ['ice','gift']], // 362
    ['pig', 7620, 29, ['ice','gift']], // 363
    ['pig', 7630, 29, ['star','ice']], // 364
    ['strawberry', 7650, 29, ['ice','star']], // 365
    ['strawberry', 7670, 29, ['star','ice']], // 366
    ['chick', 7690, 29, ['bomb','gift']], // 367
    ['chick', 7810, 29, ['bomb','gift']], // 368
    ['rabbit', 7820, 29, ['bomb','gift']], // 369
    ['rabbit', 7740, 30, ['stone','bomb','rainbow','star']], // 370
    ['dog', 7560, 31, []], // 371
    ['dog', 7580, 31, ['rainbow','star']], // 372
    ['cat', 7800, 30, ['stone','bomb']], // 373
    ['cat', 7810, 30, ['stone','bomb']], // 374
    ['flower', 7830, 30, ['rainbow','stone','bomb']], // 375
    ['flower', 7850, 30, ['ice','bomb']], // 376
    ['pig', 7870, 30, ['gift','rainbow']], // 377
    ['strawberry', 7990, 30, ['gift','rainbow']], // 378
    ['bear', 8000, 30, ['star','bomb']], // 379
    ['bear', 7920, 31, ['gift','star','bomb']], // 380
    ['chick', 7740, 31, []], // 381
    ['chick', 7760, 31, ['ice','gift']], // 382
    ['rabbit', 7980, 30, ['ice','gift']], // 383
    ['rabbit', 7990, 30, ['ice','gift']], // 384
    ['dog', 8010, 30, ['bomb','star','ice']], // 385
    ['dog', 8030, 30, ['star','ice']], // 386
    ['cat', 8050, 30, ['star','ice']], // 387
    ['cat', 8170, 30, ['bomb','gift']], // 388
    ['pig', 8180, 30, ['bomb','gift']], // 389
    ['pig', 8100, 31, ['star','bomb','gift']], // 390
    ['strawberry', 7920, 31, []], // 391
    ['strawberry', 7940, 31, ['rainbow','star']], // 392
    ['bear', 8160, 30, ['rainbow','star']], // 393
    ['bear', 8170, 30, ['stone','bomb']], // 394
    ['chick', 8190, 30, ['ice','stone','bomb']], // 395
    ['chick', 8210, 30, ['ice','bomb']], // 396
    ['rabbit', 8230, 30, ['gift','rainbow']], // 397
    ['rabbit', 8350, 30, ['gift','rainbow']], // 398
    ['dog', 8360, 30, ['gift','rainbow']], // 399
    ['cat', 8280, 31, ['rainbow','star','bomb']], // 400
  ];
  const V62_MISSIONS = {
    304:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 305
    309:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 310
    314:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 315
    319:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 320
    324:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 325
    329:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 330
    334:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 335
    339:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 340
    344:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 345
    349:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 350
    354:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 355
    359:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 360
    364:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 365
    369:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 370
    374:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 375
    379:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 380
    384:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 385
    389:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 390
    394:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 395
    399:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 400
  };
  // Ensure every curated mission has its required special types in its configured pool.
  for (const [key, mission] of Object.entries(V62_MISSIONS)) {
    const allowed = V62_STAGES[Number(key)-300]?.[3] || [];
    const required = mission.kind === 'bombStone' ? ['stone','bomb'] : [mission.kind];
    if (!required.every(type=>allowed.includes(type))) throw new Error("Stage mission configuration invalid: " + (Number(key)+1));
  }
  // V63: curated 401–500 stage profiles (theme, target, moves, special types).
  const V63_STAGES = [
    ['dog', 8070, 30, []], // 401
    ['dog', 8090, 29, ['star','ice']], // 402
    ['dog', 8290, 29, ['star','ice']], // 403
    ['flower', 8320, 29, ['bomb','stone']], // 404
    ['flower', 8340, 29, ['ice','bomb','stone']], // 405
    ['flower', 8360, 29, ['bomb','stone']], // 406
    ['rabbit', 8530, 29, ['gift','star']], // 407
    ['rabbit', 8550, 29, ['gift','star']], // 408
    ['rabbit', 8580, 29, ['gift','star']], // 409
    ['cat', 8450, 30, ['bomb','stone','rainbow','ice']], // 410
    ['cat', 8290, 30, []], // 411
    ['cat', 8310, 29, ['bomb','gift']], // 412
    ['pig', 8510, 29, ['stone','bomb','rainbow']], // 413
    ['pig', 8540, 29, ['stone','bomb','rainbow']], // 414
    ['pig', 8560, 29, ['star','stone','bomb','rainbow']], // 415
    ['strawberry', 8580, 29, ['ice','star','gift']], // 416
    ['strawberry', 8750, 29, ['ice','star','gift']], // 417
    ['strawberry', 8770, 29, ['ice','star','gift']], // 418
    ['bear', 8800, 29, ['rainbow','star']], // 419
    ['bear', 8670, 30, ['gift','rainbow','star']], // 420
    ['chick', 8510, 30, []], // 421
    ['dog', 8530, 29, ['gift','rainbow']], // 422
    ['dog', 8730, 29, ['gift','rainbow']], // 423
    ['dog', 8760, 29, ['gift','rainbow']], // 424
    ['flower', 8780, 29, ['rainbow','stone','bomb','ice']], // 425
    ['flower', 8800, 29, ['stone','bomb','ice']], // 426
    ['flower', 8970, 29, ['stone','bomb','ice']], // 427
    ['rabbit', 8990, 29, ['star','gift']], // 428
    ['rabbit', 9020, 29, ['star','gift']], // 429
    ['rabbit', 8890, 30, ['bomb','star','gift']], // 430
    ['cat', 8730, 31, []], // 431
    ['cat', 8750, 30, ['bomb','stone']], // 432
    ['cat', 8950, 30, ['bomb','stone']], // 433
    ['pig', 8980, 30, ['gift','star']], // 434
    ['pig', 9000, 30, ['ice','gift','star']], // 435
    ['pig', 9020, 30, ['gift','star']], // 436
    ['strawberry', 9190, 30, ['rainbow','ice']], // 437
    ['strawberry', 9210, 30, ['rainbow','ice']], // 438
    ['strawberry', 9240, 30, ['rainbow','ice']], // 439
    ['bear', 9110, 31, ['gift','bomb']], // 440
    ['chick', 8950, 31, []], // 441
    ['chick', 8970, 30, ['stone','bomb','rainbow']], // 442
    ['dog', 9170, 30, ['ice','star','gift']], // 443
    ['dog', 9200, 30, ['ice','star','gift']], // 444
    ['dog', 9220, 30, ['bomb','stone','ice','star']], // 445
    ['flower', 9240, 30, ['rainbow','star']], // 446
    ['flower', 9410, 30, ['rainbow','star']], // 447
    ['flower', 9430, 30, ['rainbow','star']], // 448
    ['rabbit', 9460, 30, ['bomb','ice']], // 449
    ['rabbit', 9330, 31, ['star','bomb','ice']], // 450
    ['rabbit', 9170, 31, []], // 451
    ['cat', 9190, 30, ['stone','bomb','ice']], // 452
    ['cat', 9390, 30, ['stone','bomb','ice']], // 453
    ['cat', 9420, 30, ['stone','bomb','ice']], // 454
    ['pig', 9440, 30, ['rainbow','star','gift']], // 455
    ['pig', 9460, 30, ['star','gift']], // 456
    ['pig', 9630, 30, ['star','gift']], // 457
    ['strawberry', 9650, 30, ['star','ice']], // 458
    ['strawberry', 9680, 30, ['star','ice']], // 459
    ['strawberry', 9550, 31, ['ice','star']], // 460
    ['chick', 9390, 32, []], // 461
    ['chick', 9410, 31, ['gift','star']], // 462
    ['chick', 9610, 31, ['gift','star']], // 463
    ['dog', 9640, 31, ['rainbow','ice']], // 464
    ['dog', 9660, 31, ['bomb','rainbow','ice']], // 465
    ['dog', 9680, 31, ['rainbow','ice']], // 466
    ['flower', 9850, 31, ['bomb','gift']], // 467
    ['flower', 9870, 31, ['bomb','gift']], // 468
    ['flower', 9900, 31, ['bomb','gift']], // 469
    ['rabbit', 9770, 32, ['gift','stone','bomb','rainbow']], // 470
    ['rabbit', 9610, 32, []], // 471
    ['rabbit', 9630, 31, ['ice','star','gift']], // 472
    ['cat', 9830, 31, ['rainbow','star']], // 473
    ['cat', 9860, 31, ['rainbow','star']], // 474
    ['cat', 9880, 31, ['star','rainbow']], // 475
    ['pig', 9900, 31, ['bomb','ice']], // 476
    ['pig', 10070, 31, ['bomb','ice']], // 477
    ['pig', 10090, 31, ['bomb','ice']], // 478
    ['strawberry', 10120, 31, ['gift','rainbow']], // 479
    ['strawberry', 9990, 32, ['bomb','stone','gift','rainbow']], // 480
    ['bear', 9830, 32, []], // 481
    ['chick', 9850, 31, ['star','gift']], // 482
    ['chick', 10050, 31, ['star','gift']], // 483
    ['chick', 10080, 31, ['star','gift']], // 484
    ['dog', 10100, 31, ['rainbow','star','ice']], // 485
    ['dog', 10120, 31, ['star','ice']], // 486
    ['dog', 10290, 31, ['star','ice']], // 487
    ['flower', 10310, 31, ['bomb','stone']], // 488
    ['flower', 10340, 31, ['bomb','stone']], // 489
    ['flower', 10210, 32, ['ice','bomb','stone']], // 490
    ['rabbit', 10050, 33, []], // 491
    ['rabbit', 10070, 32, ['rainbow','ice']], // 492
    ['rabbit', 10270, 32, ['rainbow','ice']], // 493
    ['cat', 10300, 32, ['bomb','gift']], // 494
    ['cat', 10320, 32, ['gift','bomb']], // 495
    ['cat', 10340, 32, ['bomb','gift']], // 496
    ['pig', 10510, 32, ['stone','bomb','rainbow']], // 497
    ['pig', 10530, 32, ['stone','bomb','rainbow']], // 498
    ['pig', 10560, 32, ['stone','bomb','rainbow']], // 499
    ['strawberry', 10430, 33, ['bomb','stone','ice','star']], // 500
  ];
  const V63_MISSIONS = {
    404:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 405
    409:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 410
    414:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 415
    419:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 420
    424:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 425
    429:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 430
    434:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 435
    439:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 440
    444:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 445
    449:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 450
    454:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 455
    459:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 460
    464:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}, // Stage 465
    469:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 470
    474:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'}, // Stage 475
    479:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 480
    484:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'}, // Stage 485
    489:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'}, // Stage 490
    494:{kind:'gift',need:1,label:'🎁 선물 1개 열기'}, // Stage 495
    499:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌 제거'}, // Stage 500
  };
  for (const [key, mission] of Object.entries(V63_MISSIONS)) {
    const allowed = V63_STAGES[Number(key)-400]?.[3] || [];
    const required = mission.kind === 'bombStone' ? ['stone','bomb'] : [mission.kind];
    if (!required.every(type=>allowed.includes(type))) throw new Error('Stage mission configuration invalid: ' + (Number(key)+1));
  }
  const v42Missions={
      5:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'},
      12:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'},
      17:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
      20:{kind:'gift',need:1,label:'🎁 선물상자 1개 열기'},
      25:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'},
      29:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌멩이 제거'},
      15:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌멩이 제거'},
      19:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
      23:{kind:'bombStone',need:1,label:'💥 폭탄으로 돌멩이 제거'},
      27:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
      ...V58_MISSIONS,
      ...V59_MISSIONS,
      ...V60_MISSIONS,
      ...V61_MISSIONS,
      ...V62_MISSIONS,
      ...V63_MISSIONS
    };
    let v42MissionCount=0;
    function v42Mission(){return v42Missions[stageSlot()]||null;}
    function v42MissionDone(){const m=v42Mission();return !m||v42MissionCount>=m.need;}
    function v42MissionUpdate(){
      // Mission belongs to the fixed-height score card; never insert above the board.
      const el=document.getElementById('dpV42Mission');
      if(!el)return;
      const m=v42Mission();
      el.hidden=!m;
      if(!m)return;
      const done=v42MissionDone();
      const label=el.querySelector('.dpMissionLabel');
      const count=el.querySelector('.dpMissionCount');
      if(label)label.textContent=m.label;
      if(count)count.textContent=Math.min(v42MissionCount,m.need)+'/'+m.need+(done?' ✓':'');
      el.classList.toggle('complete',done);
      el.setAttribute('aria-label','특별 미션 '+m.label+' '+Math.min(v42MissionCount,m.need)+'/'+m.need);
    }
    function v42MissionProgress(splash,originalCells){
      const m=v42Mission();if(!m||v42MissionDone())return;
      const count=m.kind==='star'?(splash.star?1:0):
        m.kind==='bomb'?splash.exploded:
        m.kind==='bombStone'?splash.stonesRemoved:
        m.kind==='ice'?splash.thawed:
        m.kind==='gift'?splash.giftCount:
        m.kind==='rainbow'?(originalCells.some(p=>specialAt(p.r,p.c)==='rainbow')?1:0):0;
      if(count>0){v42MissionCount=Math.min(m.need,v42MissionCount+count);v42MissionUpdate();}
    }
    // Ensure a required mission object remains obtainable until its objective is complete.
    // This operates on the actual board/specials model, never on overlay images.
    function v43RestoreMissionTile(){
      const m=v42Mission();
      if(!m || v42MissionDone() || (stageSlot()<50 && currentStage().type!=='chick'))return;
      const kind=m.kind==='bombStone'?'stone':m.kind;
      if(m.kind==='bombStone'){
        ensureStoneBombMissionPair();
        return;
      }
      for(const type of specials.values())if(type===kind)return;
      const positions=[];
      for(let r=1;r<ROWS-1;r++)for(let c=1;c<COLS-1;c++){
        if(board[r][c]===null || specialAt(r,c))continue;
        let free=false;
        for(const dc of [-1,1])if(!specialAt(r,c+dc) && board[r][c+dc]!==null)free=true;
        if(free)positions.push({r,c});
      }
      if(!positions.length)return;
      const p=positions[Math.floor(Math.random()*positions.length)];
      specials.set(skey(p.r,p.c),kind);
      if(kind==='star'||kind==='bomb'||kind==='gift'||kind==='rainbow'){
        const nc=!specialAt(p.r,p.c+1)?p.c+1:p.c-1;
        board[p.r][nc]=board[p.r][p.c];
      }
      if(!hasOpenPair())specials.delete(skey(p.r,p.c));
      render();
    }
    function v41Stage(i){
      if(i>=30 && i<50) return v41Map[V58_STAGES[i-30][0]];
      if(i>=50 && i<100) return v41Map[V59_STAGES[i-50][0]];
      if(i>=100 && i<200) return v41Map[V60_STAGES[i-100][0]];
      if(i>=200 && i<300) return v41Map[V61_STAGES[i-200][0]];
      if(i>=300 && i<400) return v41Map[V62_STAGES[i-300][0]];
      if(i>=400 && i<500) return v41Map[V63_STAGES[i-400][0]];
      const named=v41Themes[i];
      if(named) return v41Map[named];
      // Deterministic irregular 1-3 stage clusters, no random theme drift on retries.
      const groups=['rabbit','bear','flower','dog','cat','strawberry','pig','chick','flower','cat','rabbit','pig','bear','strawberry','dog','chick'];
      const cluster=Math.floor((i-30)/2);
      return v41Map[groups[(cluster+Math.floor(cluster/4))%groups.length]];
    }
    function v41StageTarget(i){
      if(i<3)return [450,520,620][i];
      if(i<30)return Math.round((680+(i-3)*57)/10)*10;
      if(i<50)return V58_STAGES[i-30][1];
      if(i<100)return V59_STAGES[i-50][1];
      if(i<200)return V60_STAGES[i-100][1];
      if(i<300)return V61_STAGES[i-200][1];
      if(i<400)return V62_STAGES[i-300][1];
      if(i<500)return V63_STAGES[i-400][1];
      return Math.round((2400+(i-30)*45)/10)*10;
    }
    function v41Moves(i){
      if(i<3)return 18;
      if(i<10)return 17;
      if(i<20)return 17;
      if(i<30)return 18;
      if(i<50)return V58_STAGES[i-30][2];
      if(i<100)return V59_STAGES[i-50][2];
      if(i<200)return V60_STAGES[i-100][2];
      if(i<300)return V61_STAGES[i-200][2];
      if(i<400)return V62_STAGES[i-300][2];
      if(i<500)return V63_STAGES[i-400][2];
      return 18+Math.min(6,Math.floor((i-30)/50));
    }
    function v41AllowedSpecials(i){
      if(i<30)return v41Specials[i];
      if(i<50)return V58_STAGES[i-30][3];
      if(i<100)return V59_STAGES[i-50][3];
      if(i<200)return V60_STAGES[i-100][3];
      if(i<300)return V61_STAGES[i-200][3];
      if(i<400)return V62_STAGES[i-300][3];
      if(i<500)return V63_STAGES[i-400][3];
      const unlocked=i<40?['stone','bomb','star','ice']:i<55?['stone','bomb','star','ice','gift']:SPECIAL_TYPES;
      // Beyond stage 30 progressively allow 1-3 specials, not six at once.
      return Array.from({length:Math.min(3,1+Math.floor((i-30)/15))},(_,n)=>unlocked[(i*3+n*2)%unlocked.length]);
    }
  
  function bandFor(i){
    let band = DIFFICULTY_BANDS[0];
    for(let k=0;k<DIFFICULTY_BANDS.length;k++){ if(i>=DIFFICULTY_BANDS[k].from) band = DIFFICULTY_BANDS[k]; }
    return band;
  }

  function buildStages(total){
    const arr = [];
    for(let i=0;i<total;i++){
      const band = bandFor(i);
      const pool = POOL_SORTED.slice(0, band.unlock);
      let base;
      // Test mode: one theme per stage (1 chick, 2 strawberry, 3 dog, 4 flower, 5 rabbit, 6 cat, 7 bear).
      // Stage 1–50 cycles all seven themes; existing stage progression is unchanged.
      base=v41Stage(i);
      const target = v41StageTarget(i);
      arr.push(Object.assign({}, base, { target: target, timeLimit: i<500 ? null : band.timeLimit }));
    }
    return arr;
  }
  const STAGES = buildStages(TOTAL_STAGES);

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
  const toastEl = document.getElementById('toast');
  const popEffectEl = document.getElementById('popEffect');
  const popTextEl = document.getElementById('popText');
  const popParticlesEl = document.getElementById('popParticles');
  const clearOverlay = document.getElementById('clearOverlay');
  const clearStarsRowEl = document.getElementById('clearStarsRow');
  const clearBestValEl = document.getElementById('clearBestVal');
  const clearScoreValEl = document.getElementById('clearScoreVal');
  const clearTargetValEl = document.getElementById('clearTargetVal');
  const clearCoinGainEl = document.getElementById('clearCoinGain');
  const clearStarGainEl = document.getElementById('clearStarGain');
  const failOverlay = document.getElementById('failOverlay');
  const failTargetValEl = document.getElementById('failTargetVal');
  const failStageNumEl = document.getElementById('failStageNum');
  const failBarFillEl = document.getElementById('failBarFill');

  function fmt(n){ return n.toLocaleString('ko-KR'); }

  const HEART_MAX = 5;
  const HEART_REGEN_MS = 2*60*1000; // 2분당 1개

  let board = [];
  let cellEls = [];
  let stageIndex = parseInt(localStorage.getItem('sp_stage_index'), 10);
  if(isNaN(stageIndex)) stageIndex = 0;
  let stageScore = 0;
  let movesLeft = 0;

  // ---- 스테이지 시간제한 (구간이 올라갈수록 도입) ----
  let stageTimeLeft = 0;
  let stageTimerHandle = null;
  let hearts = parseInt(localStorage.getItem('sp_hearts'), 10);
  if(isNaN(hearts)) hearts = HEART_MAX;
  let heartRegenAt = parseInt(localStorage.getItem('sp_heart_regen_at'), 10);
  if(isNaN(heartRegenAt)) heartRegenAt = 0;
  let coins = parseInt(localStorage.getItem('sp_coins')||'0',10);
  let totalStars = parseInt(localStorage.getItem('sp_stars')||'0',10);
  let noAdsOwned = localStorage.getItem('sp_no_ads') === '1';
  let heartPassUntil = parseInt(localStorage.getItem('sp_heart_pass_until')||'0',10);
  let stageBests = JSON.parse(localStorage.getItem('sp_stage_bests')||'[]');
  let chain = [];
  let chainPreviewBonus = 0;
  let dragging = false;
  let poppingInProgress = false;
  let powerCounts = Object.assign({ candy:3, bomb:2, shuffle:2, rainbow:2 }, JSON.parse(localStorage.getItem('sp_power_counts')||'{}'));
  function savePowerCounts(){ localStorage.setItem('sp_power_counts', JSON.stringify(powerCounts)); }

  // ---- 업적 추적용 데이터 ----
  let patternsCleared = JSON.parse(localStorage.getItem('sp_patterns_cleared')||'[]');
  let maxCombo = parseInt(localStorage.getItem('sp_max_combo')||'0',10);
  let perfectClears = parseInt(localStorage.getItem('sp_perfect_clears')||'0',10);
  let totalStagesCleared = parseInt(localStorage.getItem('sp_total_cleared')||'0',10);
  let totalCoinsEarned = parseInt(localStorage.getItem('sp_total_coins_earned')||'0',10);
  let loginStreak = parseInt(localStorage.getItem('sp_login_streak')||'0',10);
  let totalTilesRemoved = parseInt(localStorage.getItem('sp_total_tiles')||'0',10);
  let totalPops = parseInt(localStorage.getItem('sp_total_pops')||'0',10);
  let achievementsClaimed = JSON.parse(localStorage.getItem('sp_achievements_claimed')||'[]');

  function localDateStr(date){
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+d;
  }

  (function trackDailyLogin(){
    const today = localDateStr(new Date());
    const lastDate = localStorage.getItem('sp_last_login_date');
    if(lastDate === today) return; // 오늘 이미 기록됨
    if(lastDate){
      const diffDays = Math.round((new Date(today)-new Date(lastDate))/86400000);
      loginStreak = diffDays===1 ? loginStreak+1 : 1;
    } else {
      loginStreak = 1;
    }
    localStorage.setItem('sp_last_login_date', today);
    localStorage.setItem('sp_login_streak', loginStreak);
  })();

  function poolSlot(){ return stageIndex % STAGE_POOL.length; }

  coinsValEl.textContent = fmt(coins);
  starsValEl.textContent = totalStars;

  function saveHearts(){
    localStorage.setItem('sp_hearts', hearts);
    localStorage.setItem('sp_heart_regen_at', heartRegenAt);
  }

  function spendHeart(){
    if(Date.now() < heartPassUntil) return; // 하트 무제한 패스 활성 중
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

  function renderHeartsVal(){
    heartsValEl.textContent = Date.now() < heartPassUntil ? '∞' : hearts;
  }

  function updateHeartTimerDisplay(){
    const timerEl = document.getElementById('heartTimer');
    if(!timerEl) return;
    if(Date.now() < heartPassUntil){
      timerEl.textContent = '무제한';
      return;
    }
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

  // Optional theme preview: ?preview=chick|strawberry|dog|flower|rabbit|cat|bear.
  // No changes to saved progress, scores, or stage difficulty.
  const previewTheme = new URLSearchParams(window.location.search).get('preview');
  const previewStage = previewTheme === 'dog' ? DOG_EASY : previewTheme === 'strawberry' ? STRAWBERRY_EASY : previewTheme === 'flower' ? FLOWER_EASY : previewTheme === 'rabbit' ? RABBIT_EASY : previewTheme === 'cat' ? CAT_EASY : previewTheme === 'bear' ? BEAR_EASY : previewTheme === 'pig' ? PIG_EASY : previewTheme === 'chick' ? CHICK_STAGE : null;
  function currentStage(){
    const stage = STAGES[stageIndex % STAGES.length];
    return previewStage ? Object.assign({}, stage, previewStage, { target:stage.target, timeLimit:stage.timeLimit }) : stage;
  }
  function stageSlot(){ return stageIndex % STAGES.length; }
  function randSymbolIdx(){ return Math.floor(Math.random()*stageSize(currentStage())); }
  function movesBudget(){ return v41Moves(stageIndex); }

  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toastEl.classList.remove('show'), 1000);
  }

  function pulseHudScore(previewing){
    [movesScoreEchoEl, progressFillEl, barStarEl].forEach(function(el){
      if(!el) return;
      el.classList.remove('scorePop');
      void el.offsetWidth;
      el.classList.add('scorePop');
      el.classList.toggle('previewing', !!previewing);
    });
  }

  // V17: keep the board visible while dragging; celebrate the actual release.
  function triggerPopEffect(count, gained){
    if(document.getElementById('mainScreen').style.display==='none') return;
    popEffectEl.classList.remove('show', ...COMBO_TIER_KEYS,'v17-nice','v17-great','v17-amazing');
    if(count<5) return;
    const level=count>=8 ? 'amazing' : count===7 ? 'great' : 'nice';
    const title=level==='amazing' ? 'AMAZING!' : level==='great' ? 'GREAT!' : 'NICE!';
    popTextEl.innerHTML='<div class="v18ComboHalo"></div><div class="v17ComboWord" data-text="'+title+'">'+title+'</div><div class="v17ComboScore">+'+fmt(gained)+'</div>';
    popParticlesEl.innerHTML='';
    const symbols=['✦','✧','★'];
    const n=level==='amazing'?16:level==='great'?12:8;
    const dist=level==='amazing'?120:level==='great'?95:70;
    for(let i=0;i<n;i++){
      const spark=document.createElement('span');
      spark.textContent=symbols[i%symbols.length];
      const angle=2*Math.PI*i/n+(Math.random()-.5)*.25;
      const radius=dist*(.55+Math.random()*.5);
      spark.style.setProperty('--dx',Math.cos(angle)*radius+'px');
      spark.style.setProperty('--dy',Math.sin(angle)*radius+'px');
      spark.style.animationDelay=Math.round(Math.random()*75)+'ms';
      popParticlesEl.appendChild(spark);
    }
    if(count>=8){
      const flash=document.getElementById('boardFlash');
      flash.className='flash-amazing';
      void flash.offsetWidth;
      flash.classList.add('show');
    }
    popEffectEl.classList.add('v17-'+level);
    void popEffectEl.offsetWidth;
    popEffectEl.classList.add('show');
  }


  // 게임 화면을 벗어날 때(업적/상점 이동) 애니메이션이 중간에 멈췄다가
  // 다시 돌아왔을 때 처음부터 재생되며 "그레잇" 등 이펙트가 반복 재생되는 걸 막기 위한 정리
  function resetInFlightFX(){
    popEffectEl.classList.remove('show', ...COMBO_TIER_KEYS,'v17-nice','v17-great','v17-amazing');
    popEffectEl.style.animation='none';
    popTextEl.replaceChildren();
    popParticlesEl.replaceChildren();
    popEffectEl.getBoundingClientRect(); // Commit cancellation before another combo
    popEffectEl.style.removeProperty('animation');
    const flash=document.getElementById('boardFlash');
    if(flash){flash.className='';flash.style.animation='none';flash.getBoundingClientRect();flash.style.removeProperty('animation');}
    const wrap=document.getElementById('boardWrap');
    wrap.classList.remove('shaking','is-chaining');
    wrap.querySelectorAll('.chainFinalScore,.chickBurst').forEach(el=>el.remove());
    if(typeof hideChainScorePreview==='function')hideChainScorePreview();
    if(typeof clearChainPath==='function')clearChainPath();
    if(typeof chainTip!=='undefined'&&chainTip)chainTip.hidden=true;
  }

  // V17: replace intrusive center banner with unobtrusive floating hint.
  function injectFunUpgradeStyles(){
    if(document.getElementById('dalmpangFunUpgradeStyles')) return;
    const style=document.createElement('style');
    style.id='dalmpangFunUpgradeStyles';
    style.textContent = `
      #boardWrap .chickChainTip{position:absolute;z-index:45;pointer-events:none;transform:translateX(-50%);white-space:nowrap;padding:6px 12px;border-radius:999px;font-size:clamp(12px,3.2vw,14px);font-weight:900;line-height:1.2;color:white;border:1px solid rgba(255,255,255,.85);background:linear-gradient(180deg,rgba(255,173,66,.96),rgba(244,116,45,.95));box-shadow:0 3px 12px rgba(94,54,17,.24),inset 0 1px 0 rgba(255,255,255,.3);}
      #boardWrap .chickChainTip[hidden]{display:none!important;}
      #boardWrap .chickChainTip[data-tier="great"]{background:linear-gradient(180deg,rgba(169,123,255,.96),rgba(111,75,226,.95));box-shadow:0 3px 13px rgba(88,57,178,.27);}
      #boardWrap .chickChainTip.impact{animation:v17HintIn .22s ease-out both;}
      @keyframes v17HintIn{from{opacity:0;transform:translate(-50%,6px) scale(.82)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
      #boardWrap .chainLiveScore{position:absolute;z-index:44;pointer-events:none;transform:translate(-50%,-50%);min-width:0;white-space:nowrap;padding:4px 9px;border-radius:999px;font-size:clamp(13px,3.4vw,16px);font-weight:1000;color:#79471b;border:1px solid rgba(255,255,255,.95);background:rgba(255,246,215,.93);box-shadow:0 3px 11px rgba(64,45,28,.15);}
      #boardWrap .chainLiveScore.bonus{background:linear-gradient(180deg,#fff3bd,#ffd36e);border-color:#fff9dc;}
      #boardWrap .chainLiveScore.bump{animation:v17ScoreBump .18s ease-out;}
      @keyframes v17ScoreBump{0%{transform:translate(-50%,-50%) scale(.86)}75%{transform:translate(-50%,-50%) scale(1.08)}100%{transform:translate(-50%,-50%) scale(1)}}

      /* V20 tile indicators */
      /* V18: high-contrast arcade lettering; no opaque card over gameplay. */
      .popEffect.v17-nice,.popEffect.v17-great,.popEffect.v17-amazing{
        z-index:48;animation:v18ComboPunch .94s cubic-bezier(.16,.8,.28,1) both;
        isolation:isolate;
      }
      .popEffect.v17-nice .popText,.popEffect.v17-great .popText,.popEffect.v17-amazing .popText{
        position:relative;gap:1px;transform:translateY(-2%);
        overflow:visible;
      }
      .popEffect .v18ComboHalo{
        position:absolute;width:min(86vw,360px);height:140px;
        top:50%;left:50%;transform:translate(-50%,-58%);
        background:radial-gradient(ellipse,rgba(32,21,67,.48) 0%,rgba(44,24,62,.26) 33%,transparent 72%);
        filter:blur(10px);z-index:-1;pointer-events:none;
      }
      .popEffect .v17ComboWord{
        position:relative;display:block;white-space:nowrap;
        font-family:system-ui,-apple-system,"Arial Rounded MT Bold",sans-serif;
        font-size:clamp(53px,14.8vw,82px);
        line-height:1.1;font-weight:1000;letter-spacing:-.065em;
        -webkit-text-stroke:clamp(3px,.8vw,5px) #56330e;
        paint-order:stroke fill;
        text-shadow:0 3px 0 #fff6d4,0 7px 0 #743f18,0 10px 0 rgba(47,29,30,.75),0 16px 17px rgba(35,22,37,.65);
        filter:drop-shadow(0 0 7px rgba(255,255,255,.85));
      }
      .popEffect .v17ComboWord:after{
        content:attr(data-text);position:absolute;left:0;top:0;width:100%;
        color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.9);
        pointer-events:none;opacity:.9;
      }
      .popEffect.v17-nice .v17ComboWord{
        color:#ffcb32;-webkit-text-stroke-color:#90511d;
        text-shadow:0 3px 0 #fffbd7,0 7px 0 #b76a11,0 10px 0 #663811,0 15px 17px rgba(30,20,40,.62);
      }
      .popEffect.v17-great .v17ComboWord{
        color:#c08aff;-webkit-text-stroke-color:#52328b;
        text-shadow:0 3px 0 #fff2ff,0 7px 0 #7647cc,0 10px 0 #442870,0 15px 19px rgba(32,19,73,.7);
      }
      .popEffect.v17-amazing .v17ComboWord{
        color:#ff7aa7;font-size:clamp(49px,12.4vw,72px);
        -webkit-text-stroke-color:#8c235e;
        text-shadow:0 3px 0 #fff2c4,0 7px 0 #f34498,0 11px 0 #7b245e,0 17px 20px rgba(36,11,55,.75);
        filter:drop-shadow(0 0 9px rgba(255,213,78,.9));
      }
      .popEffect .v17ComboScore{
        margin-top:6px;font-size:clamp(25px,7vw,38px);line-height:1.05;
        font-weight:1000;color:#fff;
        -webkit-text-stroke:1.2px rgba(60,34,85,.8);
        paint-order:stroke fill;
        text-shadow:0 3px 0 #b36b18,0 5px 12px rgba(26,12,39,.78);
      }
      @keyframes v18ComboPunch{
        0%{opacity:0;transform:translateY(18px) scale(.46) rotate(-5deg)}
        17%{opacity:1;transform:translateY(-5px) scale(1.22) rotate(2deg)}
        29%{transform:translateY(0) scale(.96) rotate(-1deg)}
        41%{transform:translateY(0) scale(1.04)}
        70%{opacity:1;transform:translateY(0) scale(1)}
        100%{opacity:0;transform:translateY(-30px) scale(1.12)}
      }
      /* Special tiles are independent full-size PNG sprites, not small icon badges. */
      #boardWrap .die .specialTileArt{position:relative;width:100%;height:100%;object-fit:contain;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(68,42,31,.16))}
      /* V20: compact effects stay inside each tile, without obscuring the theme art. */
      #boardWrap .die .v20Special{position:absolute;right:1px;top:1px;z-index:6;width:27%;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font-size:clamp(10px,3vw,17px);font-weight:1000;color:white;pointer-events:none;border:1.5px solid #fff;box-shadow:0 2px 5px rgba(44,20,65,.35);text-shadow:0 1px 2px rgba(23,18,40,.3)}
      #boardWrap .die .v20-rainbow{background:conic-gradient(#ff79a4,#ffd35d,#8fe790,#66c8ff,#b18bff,#ff79a4);box-shadow:0 0 8px rgba(150,126,250,.5),0 2px 4px rgba(40,20,60,.2)}
      #boardWrap .die .v20-bomb{background:radial-gradient(circle at 35% 25%,#ffdd6a,#ff702d 48%,#a63231 100%);box-shadow:0 0 8px rgba(255,109,45,.35),0 2px 5px rgba(48,20,20,.25)}
      @keyframes v17ComboIn{0%{opacity:0;transform:scale(.65) translateY(16px)}19%{opacity:1;transform:scale(1.12) translateY(0)}37%{transform:scale(1)}73%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.1) translateY(-13px)}}
      @media(prefers-reduced-motion:reduce){#boardWrap .chickChainTip.impact{animation:none}.popEffect.v17-nice,.popEffect.v17-great,.popEffect.v17-amazing{animation:v17ComboFade .78s ease-out both}@keyframes v17ComboFade{0%{opacity:0}15%,75%{opacity:1}100%{opacity:0}}}
    `;
    document.head.appendChild(style);
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

  function fillRandomBoard(){
    const b = [];
    for(let r=0;r<ROWS;r++){
      const row=[];
      for(let c=0;c<COLS;c++) row.push(randSymbolIdx());
      b.push(row);
    }
    return b;
  }


  // V20: stage-local special tiles; no Fever mechanics.
  const specials=new Map();
  const skey=(r,c)=>r+','+c;
  const SPECIAL_TYPES = ['stone','bomb','star','ice','gift','rainbow'];
  const SPECIAL_WEIGHTS = [30,22,14,18,10,6];
  function isBlocked(r,c){return ['stone','ice'].includes(specialAt(r,c));}
  function chooseSpecialType(stageNo){
    // Unlock mechanics gradually, rather than overwhelming early stages.
    const unlocked=stageNo>=25 ? SPECIAL_TYPES : stageNo>=17 ? SPECIAL_TYPES.slice(0,5) : stageNo>=9 ? SPECIAL_TYPES.slice(0,4) : ['stone','bomb'];
    const weights=unlocked.map(type=>SPECIAL_WEIGHTS[SPECIAL_TYPES.indexOf(type)]);
    let roll=Math.random()*weights.reduce((a,b)=>a+b,0);
    for(let i=0;i<unlocked.length;i++){roll-=weights[i];if(roll<0)return unlocked[i];}
    return unlocked[unlocked.length-1];
  }
  function hasOpenPair(){
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      if(isBlocked(r,c))continue;
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
        if(!dr&&!dc)continue;
        const nr=r+dr,nc=c+dc;
        if(nr<0||nr>=ROWS||nc<0||nc>=COLS||isBlocked(nr,nc))continue;
        if(board[r][c]===board[nr][nc]||specialAt(r,c)==='rainbow'||specialAt(nr,nc)==='rainbow')return true;
      }
    }
    return false;
  }
  // V46: a guaranteed reachable bomb/stone pair for obstacle objectives.
  // Rebuilds only the mission pair; normal stages retain V41 placement balance.
  function ensureStoneBombMissionPair(){
    const m=v42Mission();
    if(!m || m.kind!=='bombStone' || v42MissionDone())return;
    const stone={r:3,c:2}, bomb={r:3,c:3}, helper={r:3,c:4};
    // Clear stray specials in the reserved mission lane, preserving other tiles.
    for(const p of [stone,bomb,helper])specials.delete(skey(p.r,p.c));
    // If the player already has a stone and an adjacent bomb, keep that pair.
    let existing=false;
    for(const [key,type] of specials){
      if(type!=='stone')continue;
      const [r,c]=key.split(',').map(Number);
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
        if(!dr&&!dc)continue;
        if(specialAt(r+dr,c+dc)==='bomb')existing=true;
      }
    }
    if(existing)return;
    const symbol=board[bomb.r][bomb.c]===null?0:board[bomb.r][bomb.c];
    for(const p of [stone,bomb,helper])if(board[p.r][p.c]===null)board[p.r][p.c]=symbol;
    board[bomb.r][bomb.c]=symbol;
    board[helper.r][helper.c]=symbol;
    specials.set(skey(stone.r,stone.c),'stone');
    specials.set(skey(bomb.r,bomb.c),'bomb');
  }
  function createSpecials(){
    specials.clear();
    const stage=currentStage();
    if(stage.type!=='chick' && stageSlot()<50)return;
    const requested=v41AllowedSpecials(stageSlot());
    if(!requested || !requested.length)return;
    const cells=[];
    for(let r=1;r<ROWS-1;r++)for(let c=0;c<COLS;c++)if(board[r][c]!==null)cells.push({r,c});
    for(let i=cells.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
    const occupied=new Set();
    for(const type of requested){
      let placed=false;
      for(let k=0;k<cells.length;k++){
        const p=cells[k];
        if(occupied.has(skey(p.r,p.c)))continue;
        if([...specials.keys()].some(key=>{const [r,c]=key.split(',').map(Number);return Math.abs(r-p.r)<=1&&Math.abs(c-p.c)<=1;}))continue;
        specials.set(skey(p.r,p.c),type);
        if(!hasOpenPair()){specials.delete(skey(p.r,p.c));continue;}
        // Enable a reachable match beside activatable power tiles.
        if(['star','bomb','gift'].includes(type)){
          const nc=p.c>0?p.c-1:p.c+1;
          if(!specialAt(p.r,nc))board[p.r][nc]=board[p.r][p.c];
        }
        occupied.add(skey(p.r,p.c));
        placed=true;break;
      }
      if(!placed)console.warn('[Dalmpang V43] Could not place special',type);
    }
    ensureStoneBombMissionPair();
    if(v42Mission() && v42Mission().kind==='ice' && ![...specials.values()].includes('ice')){
      specials.set(skey(3,2),'ice');
    }
  }
  function specialAt(r,c){return specials.get(skey(r,c));}
  function chainColor(){
    const ordinary=chain.find(p=>specialAt(p.r,p.c)!=='rainbow');
    return ordinary ? board[ordinary.r][ordinary.c] : null;
  }
  function specialEffects(chainCells){
    const removed=new Map(chainCells.map(p=>[skey(p.r,p.c),p]));
    const bombs=chainCells.filter(p=>specialAt(p.r,p.c)==='bomb');
    bombs.forEach(p=>{
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
        const r=p.r+dr,c=p.c+dc;
        if(r>=0&&r<ROWS&&c>=0&&c<COLS&&board[r][c]!==null)removed.set(skey(r,c),{r,c});
      }
    });
    const stonesRemoved=[...removed.keys()].filter(key=>specials.get(key)==='stone').length;
    const giftTriggered=new Set();
    const thawed=new Set();
    // Adjacent successful connections break ice; gifts open for coin rewards.
    for(const p of [...removed.values()]){
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
        const r=p.r+dr,c=p.c+dc;
        if(r<0||r>=ROWS||c<0||c>=COLS||(!dr&&!dc))continue;
        const type=specialAt(r,c),key=skey(r,c);
        if(type==='ice'&&!removed.has(key))thawed.add(key);
        if(type==='gift'&&!removed.has(key)){giftTriggered.add(key);removed.set(key,{r,c});}
      }
    }
    for(const key of thawed)specials.delete(key); // Ice melts into an ordinary playable tile.
    return {
      cells:[...removed.values()],bonus:removed.size-chainCells.length,exploded:bombs.length,
      star:chainCells.some(p=>specialAt(p.r,p.c)==='star'),giftCount:giftTriggered.size+chainCells.filter(p=>specialAt(p.r,p.c)==='gift').length,
      thawed:thawed.size,stonesRemoved
    };
  }
  function newStageBoard(){
    v42MissionCount=0;
    stageScore = 0;
    movesLeft = movesBudget();
    board = fillRandomBoard();
    createSpecials();
    startNewStageTimer();
    updateHud();
    v42MissionUpdate();
    render();
    checkNoMoves();
  }

  function formatTime(sec){
    const m = Math.floor(sec/60), s = sec%60;
    return m+':'+String(s).padStart(2,'0');
  }

  function updateHud(previewBonus){
    const st = currentStage();
    v42MissionUpdate();
    const bonus = previewBonus || 0;
    const shownScore = stageScore;
    stageNumEl.textContent = String(stageSlot()+1).padStart(2,'0');
    stageNameLblEl.textContent = st.name;
    targetValEl.textContent = fmt(st.target);
    const pct = Math.min(100, (shownScore/st.target)*100);
    progressFillEl.style.width = pct+'%';
    barStarEl.style.left = pct+'%';
    movesValEl.textContent = movesLeft;
    const ratio = shownScore / st.target;
    const liveStars = ratio>=2 ? 3 : (ratio>=1.4 ? 2 : (ratio>=1 ? 1 : 0));
    movesStarsEl.textContent = '⭐'.repeat(liveStars) + '☆'.repeat(3-liveStars);
    movesScoreEchoEl.textContent = fmt(shownScore);
    movesScoreEchoEl.classList.toggle('previewing', bonus>0);
    progressFillEl.classList.toggle('previewing', bonus>0);
    barStarEl.classList.toggle('previewing', bonus>0);
    renderHeartsVal();
    updateHeartTimerDisplay();
    document.getElementById('cntCandy').textContent = powerCounts.candy;
    document.getElementById('cntBomb').textContent = powerCounts.bomb;
    document.getElementById('cntShuffle').textContent = powerCounts.shuffle;
    document.getElementById('cntRainbow').textContent = powerCounts.rainbow;
    const timerEl = document.getElementById('stageTimerVal');
    if(st.timeLimit){
      timerEl.style.display = '';
      timerEl.textContent = '⏱ '+formatTime(stageTimeLeft);
      timerEl.classList.toggle('warn', stageTimeLeft<=10);
    } else {
      timerEl.style.display = 'none';
    }
  }

  function render(){
    const stage = currentStage();
    document.getElementById('boardWrap').classList.toggle('chickBoard', stage.type==='chick');
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        const v = board[r][c];
        const el = cellEls[r][c];
        if(v===null){ el.style.visibility='hidden'; }
        else {
          el.style.visibility='visible'; el.dataset.v=v;
          const special=specialAt(r,c);
          el.innerHTML=special ? '<img class="chickSymbol specialTileArt" draggable="false" src="assets/images/special_'+special+'.png" alt="특수 타일">' : renderSymbolHTML(stage,v);
        }
        el.classList.remove('selected','popping','chickPopping','chainBump');
        el.style.removeProperty('--pop-delay');
        el.classList.toggle('imgTile', stage.type==='img6' && stage.prefix==='face');
      }
    }
  }

  function cellCenter(r,c){
    const rect = cellEls[r][c].getBoundingClientRect();
    const wrapRect = document.getElementById('boardWrap').getBoundingClientRect();
    return { x: rect.left+rect.width/2-wrapRect.left, y: rect.top+rect.height/2-wrapRect.top };
  }

  // Longer chains are rewarded above the existing square-of-length scoring.
  function chainReward(count){
    const base=count*count*10;
    const multiplier=count>=8 ? 1.6 : count>=5 ? 1.25 : 1;
    return { score:Math.round(base*multiplier), multiplier };
  }
  // Keep the on-drag score as a preview; only commit it when the tiles pop.
  function setChainPreviewBonus(score){
    chainPreviewBonus = score || 0;
    // Preview is shown only beside the selected tile; HUD remains committed score.
  }
  // One persistent floating preview follows the newest selected tile.
  let chainScorePreviewEl=null;
  function hideChainScorePreview(){
    if(chainScorePreviewEl){chainScorePreviewEl.remove();chainScorePreviewEl=null;}
  }
  function updateChainScorePreview(){
    if(chain.length<2){hideChainScorePreview();return;}
    if(!chainScorePreviewEl){
      chainScorePreviewEl=document.createElement('div');
      chainScorePreviewEl.className='chainLiveScore';
      document.getElementById('boardWrap').appendChild(chainScorePreviewEl);
    }
    const p=chain[chain.length-1];
    const center=cellCenter(p.r,p.c);
    const wrap=document.getElementById('boardWrap');
    const x=Math.max(45,Math.min(wrap.clientWidth-45,center.x));
    const y=Math.max(30,center.y-36);
    const reward=chainReward(chain.length);
    chainScorePreviewEl.textContent='+'+fmt(reward.score);
    chainScorePreviewEl.style.left=x+'px';
    chainScorePreviewEl.style.top=y+'px';
    chainScorePreviewEl.classList.toggle('bonus',reward.multiplier>1);
    chainScorePreviewEl.classList.remove('bump');
    void chainScorePreviewEl.offsetWidth;
    chainScorePreviewEl.classList.add('bump');
  }
  let chainTip=null;
  function updateChainTip(){
    const count=chain.length;
    const show=currentStage().type==='chick' && (count===4 || count===7);
    if(!show){
      if(chainTip) chainTip.hidden=true;
    }else{
      if(!chainTip){
        chainTip=document.createElement('div');
        chainTip.className='chickChainTip';
        document.getElementById('boardWrap').appendChild(chainTip);
      }
      const p=chain[count-1];
      const center=cellCenter(p.r,p.c);
      const wrap=document.getElementById('boardWrap');
      chainTip.style.left=Math.max(67,Math.min(wrap.clientWidth-67,center.x))+'px';
      chainTip.style.top=Math.max(8,center.y-87)+'px';
      chainTip.dataset.tier=count===7?'great':'nice';
      chainTip.textContent='✦ 한 개만 더!';
      chainTip.hidden=false;
      chainTip.classList.remove('impact');
      void chainTip.offsetWidth;
      chainTip.classList.add('impact');
    }
    setChainPreviewBonus(count>=2 ? chainReward(count).score : 0);
    updateChainScorePreview();
  }


  // V13: compact candy connection path; keep the working V12 DOM renderer.
  let chainPathEl = null;
  let chainFinishTimer = null;
  function ensureChainPath(){
    if(chainPathEl) return;
    chainPathEl=document.createElement('div');
    chainPathEl.id='dalmpangCandyPath';
    chainPathEl.style.cssText='position:fixed!important;inset:0!important;z-index:2147483600!important;pointer-events:none!important;display:block!important;visibility:visible!important;opacity:1!important;overflow:visible!important;';
    document.body.appendChild(chainPathEl);
  }
  function clearChainPath(){ if(chainPathEl) chainPathEl.replaceChildren(); }
  function renderChainBridges(){
    ensureChainPath();
    clearTimeout(chainFinishTimer);
    clearChainPath();
    if(chain.length<2) return;
    const pts=chain.map(function(p){
      const b=cellEls[p.r][p.c].getBoundingClientRect();
      return {x:b.left+b.width/2,y:b.top+b.height/2};
    });
    if(!pts.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))) return;
    for(let i=1;i<pts.length;i++){
      const a=pts[i-1], b=pts[i];
      const length=Math.hypot(b.x-a.x,b.y-a.y);
      const angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
      const line=document.createElement('div');
      line.className='candyChainSegment';
      // The visible V12 DOM layer remains; only its appearance changes.
      line.style.cssText='position:absolute!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;box-sizing:border-box!important;';
      line.style.left=a.x+'px'; line.style.top=(a.y-3)+'px';
      line.style.width=length+'px'; line.style.height='6px';
      line.style.transformOrigin='0 50%';
      line.style.transform='rotate('+angle+'deg)';
      line.style.background='linear-gradient(180deg,#fff8d8 0%,#ffd56f 46%,#ecaa37 100%)';
      line.style.borderRadius='999px';
      line.style.boxShadow='0 0 9px 2px rgba(255,196,73,.34),0 1px 2px rgba(107,56,15,.12)';
      chainPathEl.appendChild(line);
    }
    // Small join beads soften the corners without covering the art.
    pts.forEach(function(p,i){
      const dot=document.createElement('div');
      const last=i===pts.length-1;
      const size=last?11:8;
      dot.className='candyChainNode'+(last?' active':'');
      dot.style.cssText='position:absolute!important;display:block!important;visibility:visible!important;pointer-events:none!important;box-sizing:border-box!important;';
      dot.style.left=(p.x-size/2)+'px';dot.style.top=(p.y-size/2)+'px';
      dot.style.width=size+'px';dot.style.height=size+'px';
      dot.style.background='radial-gradient(circle at 35% 30%,#fffdf3,#ffd276 55%,#ed9c23 100%)';
      dot.style.borderRadius='50%';
      dot.style.boxShadow=last?'0 0 10px 3px rgba(255,194,69,.44)':'0 0 6px 2px rgba(255,192,61,.26)';
      chainPathEl.appendChild(dot);
    });
  }
  function drawChainLine(){
    const wrap=document.getElementById('boardWrap');
    if(chain.length>=2) wrap.setAttribute('data-chain-count',String(chain.length));
    else wrap.removeAttribute('data-chain-count');
    updateChainTip();
    renderChainBridges();
  }
  function holdFinishedChain(){
    ensureChainPath();
    clearTimeout(chainFinishTimer);
    chainPathEl.classList.remove('finishing');
    void chainPathEl.offsetWidth;
    chainPathEl.classList.add('finishing');
    chainFinishTimer=setTimeout(function(){
      clearChainPath();
      chainPathEl.classList.remove('finishing');
    },400);
  }

  function inChain(r,c){ return chain.some(p=>p.r===r && p.c===c); }
  function isAdjacent(a,b){ return Math.abs(a.r-b.r)<=1 && Math.abs(a.c-b.c)<=1 && !(a.r===b.r && a.c===b.c); }

  function cellFromPoint(x,y){
    // Hit test by actual tile rectangles instead of elementFromPoint: selected
    // tiles and floating FX can cover adjacent elements on mobile Safari.
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        if(board[r][c]===null) continue;
        const bounds=cellEls[r][c].getBoundingClientRect();
        if(x>=bounds.left && x<=bounds.right && y>=bounds.top && y<=bounds.bottom) return {r,c};
      }
    }
    return null;
  }

  function startChain(r,c){
    if(movesLeft<=0 || poppingInProgress) return;
    if(isBlocked(r,c))return;
    chain = [{r,c}];
    setChainPreviewBonus(0);
    document.getElementById('boardWrap').classList.add('is-chaining');
    cellEls[r][c].classList.add('selected');
    drawChainLine();
  }

  function extendChain(r,c){
    if(isBlocked(r,c))return;
    const value=chainColor();
    if(specialAt(r,c)!=='rainbow' && value!==null && board[r][c]!==value) return;
    const last = chain[chain.length-1];
    if(chain.length>=2){
      const prev = chain[chain.length-2];
      if(prev.r===r && prev.c===c){
        cellEls[last.r][last.c].classList.remove('selected','chainBump');
        cellEls[last.r][last.c].style.removeProperty('--chain-order');
        chain.pop();
        drawChainLine();
        return;
      }
    }
    if(inChain(r,c)) return;
    if(!isAdjacent(last,{r,c})) return;
    chain.push({r,c});
    cellEls[r][c].classList.add('selected');
    if(currentStage().type==='chick'){
      const tile=cellEls[r][c];
      tile.classList.remove('chainBump');
      void tile.offsetWidth;
      tile.classList.add('chainBump');
    }
    if(chain.length>=2){
      const reward = chainReward(chain.length);
      // Do not animate the HUD for uncommitted drag score.
    }
    drawChainLine();
  }

  function endChain(){
    const wrap = document.getElementById('boardWrap');
    const completed = chain.length>=2;
    wrap.removeAttribute('data-chain-count');
    wrap.classList.remove('is-chaining');
    if(chainTip) chainTip.hidden=true;
    hideChainScorePreview();
    if(completed){
      holdFinishedChain();
      popChain(chain.slice());
    } else {
      clearChainPath();
      if(chain.length===1) cellEls[chain[0].r][chain[0].c].classList.remove('selected');
      setChainPreviewBonus(0);
    }
    chain=[];
  }

  function awardCoins(n){
    coins += n;
    totalCoinsEarned += n;
    localStorage.setItem('sp_coins', coins);
    localStorage.setItem('sp_total_coins_earned', totalCoinsEarned);
    coinsValEl.textContent = fmt(coins);
  }

  const COMBO_TIERS = [
    { min:30, key:'legendary',  img:'assets/images/combo_legendary.png',  sub:'전설이에요!' },
    { min:25, key:'incredible', img:'assets/images/combo_incredible.png', sub:'믿을 수 없어요!' },
    { min:20, key:'superb',     img:'assets/images/combo_superb.png',     sub:'완벽해요!' },
    { min:15, key:'awesome',    img:'assets/images/combo_awesome.png',    sub:'놀라워요!' },
    { min:9,  key:'amazing',    img:'assets/images/combo_amazing.png',    sub:'대단해요!' },
    { min:5,  key:'great',      img:'assets/images/combo_great.png',      sub:'좋아요!' }
  ];
  const COMBO_TIER_KEYS = COMBO_TIERS.map(t=>'tier-'+t.key);
  function comboTierFor(count){
    for(let i=0;i<COMBO_TIERS.length;i++){ if(count>=COMBO_TIERS[i].min) return COMBO_TIERS[i]; }
    return null;
  }

  function shakeBoard(count){
    const el = document.getElementById('boardWrap');
    let mag = '4px';
    if(count>=30) mag='22px';
    else if(count>=25) mag='19px';
    else if(count>=20) mag='16px';
    else if(count>=15) mag='13px';
    else if(count>=9) mag='10px';
    else if(count>=5) mag='7px';
    el.style.setProperty('--shakeMag', mag);
    el.classList.remove('shaking');
    void el.offsetWidth;
    el.classList.add('shaking');
  }

  // 기존 DOM 셀을 유지하되, 떨어질 원래 행을 기억해 자연스럽게 낙하시킨다.
  function gravityAndAnimateChicks(){
    const stage=currentStage();
    if(stage.type!=='chick' && stageSlot()<50){
      applyGravity(); render(); return Promise.resolve();
    }
    const sourceRows=Array.from({length:ROWS},()=>Array(COLS).fill(-1));
    const fallingSpecials=new Map();
    for(let c=0;c<COLS;c++){
      const kept=[];
      for(let r=0;r<ROWS;r++) if(board[r][c]!==null) kept.push({r,v:board[r][c],special:specialAt(r,c)});
      const missing=ROWS-kept.length;
      for(let r=0;r<missing;r++) board[r][c]=randSymbolIdx();
      kept.forEach((entry,i)=>{const dest=missing+i;board[dest][c]=entry.v;sourceRows[dest][c]=entry.r;if(entry.special)fallingSpecials.set(skey(dest,c),entry.special);});
    }
    specials.clear();
    for(const [key,type] of fallingSpecials)specials.set(key,type);
    render();
    const motions=[];
    for(let c=0;c<COLS;c++) for(let r=0;r<ROWS;r++){
      const el=cellEls[r][c], src=sourceRows[r][c];
      const height=el.getBoundingClientRect().height;
      const gap=parseFloat(getComputedStyle(gridEl).rowGap)||0;
      const offset=(src<0 ? -(r+1) : src-r)*(height+gap);
      if(Math.abs(offset)<1) continue;
      if(typeof el.animate==='function'){
        const motion=el.animate([
          {transform:'translateY('+offset+'px)',opacity:src<0?0.5:1},
          {transform:'translateY(0)',opacity:1}
        ],{duration:src<0?440:330,delay:src<0?80:0,easing:'cubic-bezier(.18,.72,.27,1)',fill:'both'});
        motions.push(motion.finished.catch(()=>{}));
      }
    }
    return Promise.all(motions).then(()=>{});
  }

  function popCells(cells, isBonus){
    if(poppingInProgress) return;
    poppingInProgress=true;
    const originalCount=cells.length;
    const splash=(!isBonus && (currentStage().type==='chick' || stageSlot()>=50)) ? specialEffects(cells) : {cells,bonus:0,exploded:0,star:false,giftCount:0,thawed:0};
    cells=splash.cells;
    if(!isBonus)v42MissionProgress(splash,cells.slice());
    const chickPop=currentStage().type==='chick' || stageSlot()>=50;
    const reward=(!isBonus && chickPop) ? chainReward(originalCount) : null;
    // Score comes from the original chain; bomb splash awards 35 points per extra tile.
    const baseGained=isBonus ? cells.length*15 : (reward ? reward.score+splash.bonus*35 : cells.length*cells.length*10);
    const gained=splash.star?Math.round(baseGained*2):baseGained;
    stageScore+=gained;
    updateHud();
    pulseHudScore(false);
    let coinGain=Math.max(1,Math.floor(gained/20));
    if(cells.length>=9) coinGain+=15;
    else if(cells.length>=5) coinGain+=5;
    if(splash.giftCount)coinGain+=splash.giftCount*40;
    awardCoins(coinGain);
    if(cells.length>maxCombo){maxCombo=cells.length;localStorage.setItem('sp_max_combo',maxCombo);}
    totalTilesRemoved+=cells.length;
    totalPops++;
    localStorage.setItem('sp_total_tiles',totalTilesRemoved);
    localStorage.setItem('sp_total_pops',totalPops);
    triggerPopEffect(originalCount,gained);
    if(splash.exploded)showToast('💥 폭탄! 주변 '+splash.bonus+'개 추가 제거');
    else if(splash.giftCount)showToast('🎁 선물 보너스 +'+(splash.giftCount*40)+' 모이');
    else if(splash.star)showToast('⭐ 황금별 점수 ×2!');
    else if(splash.thawed)showToast('🧊 얼음 해제!');
    shakeBoard(cells.length);
    vibrateForCombo(cells.length);
    const wrap=document.getElementById('boardWrap');
    const mid=cells[Math.floor(cells.length/2)];
    if(chickPop && mid && cells.length<5){
      const center=cellCenter(mid.r,mid.c);
      const burst=document.createElement('div');
      burst.className='chickBurst chainFinalScore';
      burst.style.left=center.x+'px';burst.style.top=center.y+'px';
      burst.textContent=reward && reward.multiplier>1 ? '✨ ×'+reward.multiplier+'  +'+gained : '+'+gained;
      wrap.appendChild(burst);
      setTimeout(()=>burst.remove(),800);
    }
    cells.forEach(({r,c},i)=>{
      specials.delete(skey(r,c));
      const el=cellEls[r][c];
      el.classList.remove('selected','chainBump');
      el.style.setProperty('--pop-delay',chickPop?Math.min(i*34,240)+'ms':'0ms');
      el.classList.add(chickPop?'chickPopping':'popping');
      board[r][c]=null;
    });
    setTimeout(()=>{
      gravityAndAnimateChicks().then(()=>{
        poppingInProgress=false;
        v43RestoreMissionTile();
        updateHud();
        if(stageScore>=currentStage().target && v42MissionDone()) showStageClear();
        else if(movesLeft<=0) showStageFail();
        else checkNoMoves();
      }).catch(()=>{poppingInProgress=false;render();updateHud();});
    },chickPop?530:260);
  }

  function popChain(cells){
    if(poppingInProgress) return;
    chainPreviewBonus = 0;
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
    if(currentStage().type==='chick' || stageSlot()>=50)return hasOpenPair();
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        const v = board[r][c];
        for(let dr=-1;dr<=1;dr++){
          for(let dc=-1;dc<=1;dc++){
            if(dr===0&&dc===0) continue;
            const nr=r+dr, nc=c+dc;
            if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS && (board[nr][nc]===v || specialAt(r,c)==='rainbow' || specialAt(nr,nc)==='rainbow')) return true;
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
    createSpecials();
  }

  function showStageClear(){
    pauseStageTimer();
    const st = currentStage();
    const ratio = stageScore / st.target;
    const stars = ratio>=2 ? 3 : (ratio>=1.4 ? 2 : 1);
    clearStarsRowEl.innerHTML = [1,2,3].map(function(n){
      return '<img src="assets/images/icon_star.png" class="'+(n<=stars?'':'dim')+'" alt="">';
    }).join('');

    const slot = stageSlot();
    const prevBest = stageBests[slot]||0;
    const newBest = Math.max(prevBest, stageScore);
    if(stageScore > prevBest){
      stageBests[slot] = stageScore;
      localStorage.setItem('sp_stage_bests', JSON.stringify(stageBests));
    }
    clearBestValEl.textContent = fmt(newBest);
    clearScoreValEl.textContent = fmt(stageScore);
    clearTargetValEl.textContent = fmt(st.target);

    totalStars += stars;
    localStorage.setItem('sp_stars', totalStars);
    starsValEl.textContent = totalStars;

    const coinGain = 30*stars + Math.floor(stageIndex/20);
    awardCoins(coinGain);
    clearCoinGainEl.textContent = fmt(coinGain);
    clearStarGainEl.textContent = stars;

    totalStagesCleared++;
    localStorage.setItem('sp_total_cleared', totalStagesCleared);
    if(stars>=3){
      perfectClears++;
      localStorage.setItem('sp_perfect_clears', perfectClears);
    }
    const pSlot = poolSlot();
    if(!patternsCleared.includes(pSlot)){
      patternsCleared.push(pSlot);
      localStorage.setItem('sp_patterns_cleared', JSON.stringify(patternsCleared));
    }

    clearOverlay.classList.add('show');
    vibrate([40,40,40,40,80]);
  }

  const CONTINUE_COST = 50;
  function showStageFail(){
    pauseStageTimer();
    const st = currentStage();
    failTargetValEl.textContent = fmt(st.target);
    failStageNumEl.textContent = String(stageSlot()+1).padStart(2,'0');
    failBarFillEl.style.width = Math.min(100, (stageScore/st.target)*100)+'%';
    document.getElementById('continueCostLabel').textContent = CONTINUE_COST;
    document.getElementById('continueLabelSuffix').textContent = st.timeLimit
      ? '5무브 + '+Math.round(st.timeLimit/2)+'초 추가'
      : '5무브 추가';
    failOverlay.classList.add('show');
    vibrate(200);
  }

  document.getElementById('nextStageBtn').addEventListener('click', ()=>{
    clearOverlay.classList.remove('show');
    stageIndex++;
    localStorage.setItem('sp_stage_index', stageIndex);
    newStageBoard();
  });
  document.getElementById('retryClearBtn').addEventListener('click', ()=>{
    if(hearts<=0 && Date.now()>=heartPassUntil){ showToast('하트가 부족해요! 상단 + 버튼으로 충전해보세요'); return; }
    spendHeart();
    updateHud();
    clearOverlay.classList.remove('show');
    newStageBoard();
  });
  document.getElementById('retryBtn').addEventListener('click', ()=>{
    if(hearts<=0 && Date.now()>=heartPassUntil){ showToast('하트가 부족해요! 상단 + 버튼으로 충전해보세요'); return; }
    spendHeart();
    updateHud();
    failOverlay.classList.remove('show');
    newStageBoard();
  });
  document.getElementById('continueBtn').addEventListener('click', ()=>{
    if(coins < CONTINUE_COST){ showToast('모이가 부족해요'); return; }
    coins -= CONTINUE_COST;
    localStorage.setItem('sp_coins', coins);
    coinsValEl.textContent = fmt(coins);
    movesLeft += 5;
    const st = currentStage();
    if(st.timeLimit){ stageTimeLeft += Math.round(st.timeLimit/2); resumeStageTimer(); }
    failOverlay.classList.remove('show');
    updateHud();
    render();
    checkNoMoves();
    showToast('🪙 '+CONTINUE_COST+'으로 5무브 추가!');
  });

  gridEl.addEventListener('pointerdown', (e)=>{
    const cell = cellFromPoint(e.clientX,e.clientY);
    if(!cell || poppingInProgress || movesLeft<=0 || isBlocked(cell.r,cell.c)) return;
    dragging = true;
    startChain(cell.r,cell.c);
    e.preventDefault();
  });
  window.addEventListener('pointermove',(e)=>{
    if(!dragging) return;
    const cell = cellFromPoint(e.clientX,e.clientY);
    if(cell) extendChain(cell.r,cell.c);
  });
  function finishPointerChain(){
    if(!dragging) return;
    dragging=false;
    endChain();
  }
  window.addEventListener('pointerup',finishPointerChain);
  window.addEventListener('pointercancel',finishPointerChain);

  // ---- power-ups ----
  document.getElementById('btnCandy').addEventListener('click', ()=>{
    if(powerCounts.candy<=0){ showToast('사탕 개수가 없어요'); return; }
    powerCounts.candy--;
    savePowerCounts();
    movesLeft += 3;
    updateHud();
    showToast('사탕 사용! 이동 횟수 +3');
  });
  document.getElementById('btnBomb').addEventListener('click', ()=>{
    if(powerCounts.bomb<=0){ showToast('폭탄 개수가 없어요'); return; }
    if(movesLeft<=0){ showToast('이동 횟수가 없어요'); return; }
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
    savePowerCounts();
    movesLeft = Math.max(0, movesLeft-1);
    updateHud();
    popCells(cells, true);
  });
  document.getElementById('btnShuffle').addEventListener('click', ()=>{
    if(powerCounts.shuffle<=0){ showToast('셔플 개수가 없어요'); return; }
    powerCounts.shuffle--;
    savePowerCounts();
    updateHud();
    reshuffleInPlace();
    render();
    checkNoMoves();
    showToast('보드를 섞었습니다');
  });
  document.getElementById('btnRainbow').addEventListener('click', ()=>{
    if(powerCounts.rainbow<=0){ showToast('무지개 개수가 없어요'); return; }
    if(movesLeft<=0){ showToast('이동 횟수가 없어요'); return; }
    const candidates=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r][c]!==null) candidates.push({r,c});
    if(!candidates.length) return;
    const pick = candidates[Math.floor(Math.random()*candidates.length)];
    const value = board[pick.r][pick.c];
    const cells=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(board[r][c]===value) cells.push({r,c});
    powerCounts.rainbow--;
    savePowerCounts();
    movesLeft = Math.max(0, movesLeft-1);
    updateHud();
    popCells(cells, true);
  });

  const SHOP_ITEMS = [
    { key:'starter',   cls:'starter',   icon:'🌟', tag:'첫 구매 한정', name:'스타터팩',
      desc:'모이 1,000 + 사탕2·폭탄2·셔플2·무지개2\n+ 하트 즉시 충전', price:'₩1,200',
      grant:{ coin:1000, candy:2, bomb:2, shuffle:2, rainbow:2, fillHearts:true } },
    { key:'heartpass', cls:'heartpass', icon:'❤️', name:'하트 무제한 패스',
      desc:'7일 동안 하트가 무제한이에요!\n(구매 즉시 적용, 남은 기간 연장)', price:'₩5,500',
      grant:{ heartPassDays:7 } },
    { key:'noads',     cls:'',          icon:'🚫', name:'광고 제거',
      desc:'모든 광고를 영구히 제거하고\n쾌적하게 플레이하세요!', price:'₩5,500',
      grant:{ noAds:true } },
    { key:'power',     cls:'power',     icon:'🎁', name:'파워팩',
      desc:'사탕5 · 폭탄3 · 셔플3 · 무지개2\n한 번에 듬뿍!', price:'₩4,400',
      grant:{ candy:5, bomb:3, shuffle:3, rainbow:2 } },
    { key:'coin_s',    cls:'coin',      icon:'💰', name:'모이 소',
      desc:'모이 1,200개', price:'₩1,200', grant:{ coin:1200 } },
    { key:'coin_m',    cls:'coin',      icon:'💰', name:'모이 중',
      desc:'모이 2,750개 (+10% 보너스)', price:'₩2,500', grant:{ coin:2750 } },
    { key:'coin_l',    cls:'coin',      icon:'💰', name:'모이 대',
      desc:'모이 6,600개 (+20% 보너스)', price:'₩5,500', grant:{ coin:6600 } },
    { key:'coin_xl',   cls:'coin',      icon:'💰', name:'모이 메가',
      desc:'모이 15,400개 (+40% 보너스)', price:'₩11,000', grant:{ coin:15400 } }
  ];

  const STAR_SHOP_ITEMS = [
    { key:'candy',   icon:'🍬', name:'사탕 +1',   desc:'이동 횟수 3회 추가', star:5 },
    { key:'shuffle', icon:'🔀', name:'셔플 +1',   desc:'보드를 다시 섞어요', star:6 },
    { key:'bomb',    icon:'💣', name:'폭탄 +1',   desc:'주변 타일을 한번에 제거', star:8 },
    { key:'rainbow', icon:'🌈', name:'무지개 +1', desc:'같은 심볼 전부 제거', star:10 }
  ];

  const SHOP_TABS = [
    { id:'star',    label:'⭐ 별' },
    { id:'general', label:'🛍️ 모이 상점' }
  ];
  let currentShopTab = 'star';

  function renderShopTabs(){
    const tabsEl = document.getElementById('shopTabs');
    tabsEl.innerHTML = SHOP_TABS.map(function(t){
      return '<button class="achieveTabBtn'+(t.id===currentShopTab?' active':'')+'" data-tab="'+t.id+'">'+t.label+'</button>';
    }).join('');
    tabsEl.querySelectorAll('.achieveTabBtn').forEach(function(btn){
      btn.addEventListener('click', function(){
        currentShopTab = btn.dataset.tab;
        renderShop();
      });
    });
    document.getElementById('starShopSection').classList.toggle('show', currentShopTab==='star');
    document.getElementById('generalShopSection').classList.toggle('show', currentShopTab==='general');
  }

  function renderShop(){
    renderShopTabs();
    const starList = document.getElementById('starShopList');
    starList.innerHTML = STAR_SHOP_ITEMS.map(function(it){
      const affordable = totalStars >= it.star;
      return '<div class="shopRow star'+(affordable?'':' disabled')+'">'
        + '<div class="shopIcon">'+it.icon+'</div>'
        + '<div class="shopBody"><div class="sTitle">'+it.name+'</div><div class="sDesc">'+it.desc+'</div></div>'
        + '<button class="shopBuyBtn star" data-key="'+it.key+'" data-star="'+it.star+'">⭐ '+it.star+'</button>'
        + '</div>';
    }).join('');
    starList.querySelectorAll('.shopBuyBtn.star').forEach(function(btn){
      btn.addEventListener('click', function(){
        const cost = parseInt(btn.dataset.star, 10);
        const key = btn.dataset.key;
        if(totalStars < cost){ showToast('별이 부족해요'); return; }
        totalStars -= cost;
        localStorage.setItem('sp_stars', totalStars);
        starsValEl.textContent = totalStars;
        powerCounts[key] = (powerCounts[key]||0) + 1;
        savePowerCounts();
        updateHud();
        showToast(STAR_SHOP_ITEMS.find(i=>i.key===key).name+' 구매 완료!');
        renderShop();
      });
    });

    const list = document.getElementById('shopList');
    const starterBought = localStorage.getItem('sp_starter_bought') === '1';
    const visibleItems = SHOP_ITEMS.filter(function(it){
      if(it.key==='starter' && starterBought) return false;
      if(it.key==='noads' && noAdsOwned) return false;
      return true;
    });
    list.innerHTML = visibleItems.map(function(it){
      const tagHtml = it.tag ? '<span class="shopTag">'+it.tag+'</span>' : '';
      return '<div class="shopRow'+(it.cls?' '+it.cls:'')+'">'
        + '<div class="shopIcon">'+it.icon+'</div>'
        + '<div class="shopBody"><div class="sTitle">'+it.name+tagHtml+'</div><div class="sDesc">'+it.desc.replace(/\n/g,'<br>')+'</div></div>'
        + '<button class="shopBuyBtn" data-key="'+it.key+'">'+it.price+'</button>'
        + '</div>';
    }).join('');
    list.querySelectorAll('.shopBuyBtn:not(.star)').forEach(function(btn){
      btn.addEventListener('click', function(){ purchaseItem(btn.dataset.key); });
    });
  }

  // 실제 Google Play 결제(Digital Goods API) 연동 전까지의 임시 처리.
  // Play Console에 상품을 등록한 뒤, 이 함수 내부를 실제 결제 요청으로 교체하면 됨.
  function purchaseItem(key){
    const it = SHOP_ITEMS.find(function(i){ return i.key===key; });
    if(!it) return;
    if(!confirm(it.name+' ('+it.price+')을(를) 구매하시겠어요?\n[테스트 모드: 실제 결제는 아직 연동되지 않았어요]')) return;
    if(it.key === 'starter') localStorage.setItem('sp_starter_bought', '1');
    grantShopItem(it.grant);
    updateHud();
    showToast(it.name+' 구매 완료! (테스트)');
    renderShop();
  }

  function grantShopItem(grant){
    if(!grant) return;
    if(grant.coin) awardCoins(grant.coin);
    ['candy','bomb','shuffle','rainbow'].forEach(function(k){
      if(grant[k]){ powerCounts[k] = (powerCounts[k]||0) + grant[k]; }
    });
    if(grant.candy||grant.bomb||grant.shuffle||grant.rainbow) savePowerCounts();
    if(grant.fillHearts){ hearts = HEART_MAX; heartRegenAt = 0; saveHearts(); }
    if(grant.heartPassDays){
      const base = Math.max(Date.now(), heartPassUntil);
      heartPassUntil = base + grant.heartPassDays*24*60*60*1000;
      localStorage.setItem('sp_heart_pass_until', heartPassUntil);
    }
    if(grant.noAds){
      noAdsOwned = true;
      localStorage.setItem('sp_no_ads', '1');
    }
  }

  function hideAllPages(){
    pauseStageTimer();
    document.getElementById('achievePage').classList.remove('show');
    document.getElementById('shopPage').classList.remove('show');
    document.getElementById('mainScreen').style.display = 'none';
  }

  function pauseStageTimer(){ clearInterval(stageTimerHandle); }
  function resumeStageTimer(){
    clearInterval(stageTimerHandle);
    const st = currentStage();
    if(!st.timeLimit || stageTimeLeft<=0) return;
    stageTimerHandle = setInterval(function(){
      stageTimeLeft--;
      updateHud();
      if(stageTimeLeft<=0){ clearInterval(stageTimerHandle); showStageFail(); }
    }, 1000);
  }
  function startNewStageTimer(){
    const st = currentStage();
    stageTimeLeft = st.timeLimit || 0;
    resumeStageTimer();
  }

  // ---- background music ----
  const bgmAudio = new Audio('assets/sounds/bgm.mp3');
  bgmAudio.loop = true;
  bgmAudio.volume = 0.5;
  let bgmOn = localStorage.getItem('sp_bgm_on') !== '0';

  // ---- vibration (haptics) ----
  let vibrateOn = localStorage.getItem('sp_vibrate_on') !== '0';
  function vibrate(pattern){
    if(!vibrateOn) return;
    if(navigator.vibrate) navigator.vibrate(pattern);
  }
  function vibrateForCombo(count){
    if(count>=15) vibrate([30,30,60]);
    else if(count>=9) vibrate([20,20,40]);
    else if(count>=5) vibrate(30);
    else vibrate(15);
  }

  // ---- top bar / bottom nav stubs ----
  const HEART_REFILL_COST = 30;
  document.getElementById('heartPlus').addEventListener('click', ()=>{
    if(hearts >= HEART_MAX){ showToast('하트가 이미 가득 찼어요'); return; }
    if(coins < HEART_REFILL_COST){ showToast('모이가 부족해요'); return; }
    coins -= HEART_REFILL_COST;
    localStorage.setItem('sp_coins', coins);
    coinsValEl.textContent = fmt(coins);
    hearts = HEART_MAX;
    heartRegenAt = 0;
    saveHearts();
    updateHud();
    showToast('🪙 '+HEART_REFILL_COST+'으로 하트를 채웠습니다');
  });
  document.getElementById('coinPlus').addEventListener('click', ()=> showToast('상점은 준비 중이에요'));
  document.getElementById('gearBtn').addEventListener('click', ()=>{
    document.getElementById('settingsOverlay').classList.add('show');
  });
  document.getElementById('settingsCloseBtn').addEventListener('click', ()=>{
    document.getElementById('settingsOverlay').classList.remove('show');
  });
  const bgmToggleBtn = document.querySelector('.sToggle[data-key="bgm"]');
  if(bgmToggleBtn) bgmToggleBtn.classList.toggle('on', bgmOn);
  const vibrateToggleBtn = document.querySelector('.sToggle[data-key="vibrate"]');
  if(vibrateToggleBtn) vibrateToggleBtn.classList.toggle('on', vibrateOn);
  document.querySelectorAll('.sToggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      const isOn = btn.classList.toggle('on');
      if(btn.dataset.key === 'bgm'){
        bgmOn = isOn;
        localStorage.setItem('sp_bgm_on', bgmOn ? '1' : '0');
        if(bgmOn) bgmAudio.play().catch(()=>{});
        else bgmAudio.pause();
      } else if(btn.dataset.key === 'vibrate'){
        vibrateOn = isOn;
        localStorage.setItem('sp_vibrate_on', vibrateOn ? '1' : '0');
        if(vibrateOn) vibrate(20);
      }
    });
  });
  document.querySelectorAll('.sActionBtn, .sFooterBtn').forEach(function(btn){
    if(btn.id === 'resetDataBtn' || btn.id === 'licenseBtn') return;
    btn.addEventListener('click', function(){ showToast('준비 중인 기능이에요'); });
  });
  document.getElementById('licenseBtn').addEventListener('click', function(){
    document.getElementById('licenseOverlay').classList.add('show');
  });
  document.getElementById('licenseCloseBtn').addEventListener('click', function(){
    document.getElementById('licenseOverlay').classList.remove('show');
  });
  document.getElementById('resetDataBtn').addEventListener('click', function(){
    if(!confirm('모든 게임 데이터를 초기화할까요? 되돌릴 수 없어요.')) return;
    Object.keys(localStorage).forEach(function(k){
      if(k.indexOf('sp_') === 0) localStorage.removeItem(k);
    });
    location.reload();
  });
  document.getElementById('navShop').addEventListener('click', ()=>{
    resetInFlightFX();
    renderShop();
    hideAllPages();
    document.getElementById('shopPage').classList.add('show');
    setActiveTab('shop');
  });
  document.getElementById('navHome').addEventListener('click', ()=>{
    resetInFlightFX();
    document.getElementById('achievePage').classList.remove('show');
    document.getElementById('shopPage').classList.remove('show');
    document.getElementById('mainScreen').style.display = '';
    resumeStageTimer();
    setActiveTab('home');
  });

  document.querySelectorAll('.navBtn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const ico = btn.querySelector('.ico');
      ico.classList.remove('tapped');
      void ico.offsetWidth;
      ico.classList.add('tapped');
      setTimeout(()=> ico.classList.remove('tapped'), 260);
    });
  });

  const ACHIEVE_TABS = [
    { id:'stage', label:'스테이지' },
    { id:'tile',  label:'타일' },
    { id:'clear', label:'클리어' },
    { id:'coin',  label:'모이' },
    { id:'login', label:'출석' }
  ];
  let currentAchieveTab = 'stage';

  const ACHIEVEMENTS = [
    { id:'stage10',     tab:'stage', icon:'👣',  img:'assets/images/ach_stage10.png',    name:'첫 발자국',     desc:'스테이지 10개 클리어',                     target:10,     get:()=>totalStagesCleared, reward:{coin:30} },
    { id:'stage50',     tab:'stage', icon:'🔍',  img:'assets/images/ach_stage50.png',    name:'꾸준한 탐정',   desc:'스테이지 50개 클리어',                     target:50,     get:()=>totalStagesCleared, reward:{coin:100} },
    { id:'stage100',    tab:'stage', icon:'🧭',  img:'assets/images/ach_stage100.png',   name:'숙련된 탐험가', desc:'스테이지 100개 클리어',                    target:100,    get:()=>totalStagesCleared, reward:{coin:250} },
    { id:'stage250',    tab:'stage', icon:'🗺️',  img:'assets/images/ach_stage250.png',   name:'대단한 여정',   desc:'스테이지 250개 클리어',                    target:250,    get:()=>totalStagesCleared, reward:{coin:500} },
    { id:'stage500',    tab:'stage', icon:'🏆',  img:'assets/images/ach_stage500.png',   name:'닮팡 마스터',   desc:'스테이지 500개 클리어',                    target:500,    get:()=>totalStagesCleared, reward:{star:30}, special:true },
    { id:'pattern10',   tab:'stage', icon:'🧩',  img:'assets/images/ach_pattern10.png',  name:'패턴 수집가',   desc:'서로 다른 패턴 10개 클리어',              target:10,     get:()=>patternsCleared.length, reward:{coin:100} },
    { id:'pattern27',   tab:'stage', icon:'🧩✨', img:'assets/images/ach_pattern27.png',  name:'패턴 마스터',   desc:'서로 다른 패턴 '+STAGE_POOL.length+'개 모두 클리어', target:STAGE_POOL.length, get:()=>patternsCleared.length, reward:{coin:500,star:20} },

    { id:'combo5',      tab:'tile', icon:'⭐',  img:'assets/images/ach_combo5.png',      name:'콤보 스타터',   desc:'한 번에 타일 5개 연결',                    target:5,      get:()=>maxCombo, reward:{coin:20} },
    { id:'combo9',      tab:'tile', icon:'⚡',  img:'assets/images/ach_combo9.png',      name:'콤보 러너',     desc:'한 번에 타일 9개 연결',                    target:9,      get:()=>maxCombo, reward:{coin:50} },
    { id:'combo15',     tab:'tile', icon:'🔥',  img:'assets/images/ach_combo15.png',     name:'콤보 마스터',   desc:'한 번에 타일 15개 연결',                   target:15,     get:()=>maxCombo, reward:{coin:100} },
    { id:'tilebomb10',  tab:'tile', icon:'💥',  img:'assets/images/ach_tilebomb10.png',  name:'타일 폭격',     desc:'한 번에 타일 10개 이상 제거',               target:10,     get:()=>maxCombo, reward:{coin:150} },
    { id:'tile100',     tab:'tile', icon:'🧱',  img:'assets/images/ach_tile100.png',     name:'타일 수집가',   desc:'타일 100개 제거',                          target:100,    get:()=>totalTilesRemoved, reward:{coin:50} },
    { id:'tile1000',    tab:'tile', icon:'💥',  img:'assets/images/ach_tile1000.png',    name:'타일 파괴자',   desc:'타일 1,000개 제거',                        target:1000,   get:()=>totalTilesRemoved, reward:{coin:200} },
    { id:'chain100',    tab:'tile', icon:'🔗',  img:'assets/images/ach_chain100.png',    name:'연쇄의 달인',   desc:'타일 연쇄 제거 100회',                     target:100,    get:()=>totalPops, reward:{coin:200} },

    { id:'perfect10',   tab:'clear', icon:'💯',  img:'assets/images/ach_perfect10.png',  name:'완벽주의자',    desc:'목표 점수의 200% 이상으로 클리어 10회',      target:10,     get:()=>perfectClears, reward:{coin:50} },
    { id:'perfect50',   tab:'clear', icon:'👑',  img:'assets/images/ach_perfect50.png',  name:'퍼펙트 플레이', desc:'목표 점수의 200% 이상으로 클리어 50회',      target:50,     get:()=>perfectClears, reward:{coin:150} },
    { id:'perfect100',  tab:'clear', icon:'💎',  img:'assets/images/ach_perfect100.png', name:'완벽의 경지',   desc:'목표 점수의 200% 이상으로 클리어 100회',     target:100,    get:()=>perfectClears, reward:{coin:300} },
    { id:'star3_10',    tab:'clear', icon:'⭐⭐⭐', img:'assets/images/ach_star3_10.png', name:'별 세 개!',   desc:'⭐⭐⭐ 10회 달성',                          target:10,     get:()=>perfectClears, reward:{coin:100} },
    { id:'star3_50',    tab:'clear', icon:'🌟',  img:'assets/images/ach_star3_50.png', name:'별빛 수집가',   desc:'⭐⭐⭐ 50회 달성',                          target:50,     get:()=>perfectClears, reward:{coin:300} },

    { id:'coin1000',    tab:'coin', icon:'🪙',  img:'assets/images/ach_coin1000.png',    name:'동전 한 닢',    desc:'누적 모이 1,000개 획득',                   target:1000,   get:()=>totalCoinsEarned, reward:{star:5} },
    { id:'coin10000',   tab:'coin', icon:'💰',  img:'assets/images/ach_coin10000.png',  name:'알뜰 닮팡',     desc:'누적 모이 10,000개 획득',                  target:10000,  get:()=>totalCoinsEarned, reward:{star:15} },
    { id:'coin100000',  tab:'coin', icon:'💎',  img:'assets/images/ach_coin100000.png',  name:'부자 닮팡',     desc:'누적 모이 100,000개 획득',                 target:100000, get:()=>totalCoinsEarned, reward:{star:40} },

    { id:'login3',      tab:'login', icon:'🌱',  img:'assets/images/ach_login3.png',  name:'다시 만나요',   desc:'3일 연속 접속',                            target:3,      get:()=>loginStreak, reward:{coin:30,heart:1} },
    { id:'login7',      tab:'login', icon:'🔥',  img:'assets/images/ach_login7.png',  name:'매일 만나요',   desc:'7일 연속 접속',                            target:7,      get:()=>loginStreak, reward:{coin:100,heart:2} },
    { id:'login30',     tab:'login', icon:'📅',  img:'assets/images/ach_login30.png', name:'한 달 개근',    desc:'30일 연속 접속',                           target:30,     get:()=>loginStreak, reward:{coin:500,heart:5} }
  ];

  function rewardText(reward){
    const parts = [];
    if(reward.coin) parts.push('🪙'+fmt(reward.coin));
    if(reward.star) parts.push('⭐'+reward.star);
    if(reward.heart) parts.push('❤️'+reward.heart);
    return parts.join(' ');
  }

  function claimAchievement(id){
    const a = ACHIEVEMENTS.find(x=>x.id===id);
    if(!a || achievementsClaimed.includes(id)) return;
    if(a.get() < a.target) return;
    if(a.reward.coin) awardCoins(a.reward.coin);
    if(a.reward.star){ totalStars += a.reward.star; localStorage.setItem('sp_stars', totalStars); starsValEl.textContent = totalStars; }
    if(a.reward.heart){ hearts = Math.min(HEART_MAX, hearts + a.reward.heart); saveHearts(); }
    achievementsClaimed.push(id);
    localStorage.setItem('sp_achievements_claimed', JSON.stringify(achievementsClaimed));
    updateHud();
    renderAchievements();
    showToast(a.name+' 보상 수령! '+rewardText(a.reward));
  }

  function renderAchieveTabs(){
    const tabsEl = document.getElementById('achieveTabs');
    tabsEl.innerHTML = ACHIEVE_TABS.map(function(t){
      return '<button class="achieveTabBtn'+(t.id===currentAchieveTab?' active':'')+'" data-tab="'+t.id+'">'+t.label+'</button>';
    }).join('');
    tabsEl.querySelectorAll('.achieveTabBtn').forEach(function(btn){
      btn.addEventListener('click', function(){
        currentAchieveTab = btn.dataset.tab;
        renderAchievements();
      });
    });
  }

  function rewardParts(reward){
    const parts = [];
    if(reward.coin) parts.push('<img class="aRewardIcon" src="assets/images/icon_coin.png" alt="">'+fmt(reward.coin));
    if(reward.star) parts.push('<img class="aRewardIcon" src="assets/images/icon_star.png" alt="">'+reward.star);
    if(reward.heart) parts.push('<img class="aRewardIcon" src="assets/images/icon_heart.png" alt="">'+reward.heart);
    return parts;
  }

  function renderAchievements(){
    renderAchieveTabs();
    const list = document.getElementById('achieveList');
    const doneCount = ACHIEVEMENTS.filter(a=>achievementsClaimed.includes(a.id)).length;
    document.getElementById('achieveSummary').textContent = doneCount+' / '+ACHIEVEMENTS.length+' 달성';

    const tabAchievements = ACHIEVEMENTS.filter(a=>a.tab===currentAchieveTab);

    // 순서는 고정 — 완료된 걸 위로 재정렬하지 않음
    list.innerHTML = tabAchievements.map(function(a){
      const val = Math.min(a.target, a.get());
      const pct = Math.min(100, (val/a.target)*100);
      const claimed = achievementsClaimed.includes(a.id);
      const ready = !claimed && a.get()>=a.target;
      let statusHtml;
      if(claimed){
        statusHtml = '<div class="aStatus done">✓ 완료</div>';
      } else if(ready){
        statusHtml = '<button class="aClaimBtn" data-id="'+a.id+'">보상받기</button>';
      } else {
        statusHtml = '<div class="aStatus">진행 중</div>';
      }
      const rewardHtml = '<div class="aRewardRow">'+rewardParts(a.reward).map(function(p){ return '<span class="aRewardLine">'+p+'</span>'; }).join('')+'</div>';
      const specialTag = a.special ? '<span class="aSpecialTag">SPECIAL</span>' : '';
      return '<div class="achieveRow'+(claimed?' done':'')+(a.special?' special':'')+'">'
        + '<div class="aBadge">'+(a.img ? '<img src="'+a.img+'" alt="">' : a.icon)+'</div>'
        + '<div class="aBody">'
        +   '<div class="aTitleRow"><div class="aTitle">'+a.name+'</div>'+specialTag+'</div>'
        +   '<div class="aDesc">'+a.desc+'</div>'
        +   '<div class="aBarTrack"><div class="aBarFill" style="width:'+pct+'%"></div><div class="aBarLabel">'+val+' / '+a.target+'</div></div>'
        + '</div>'
        + '<div class="aSide">'+rewardHtml+statusHtml+'</div>'
        + '</div>';
    }).join('');

    list.querySelectorAll('.aClaimBtn').forEach(function(btn){
      btn.addEventListener('click', function(){ claimAchievement(btn.dataset.id); });
    });
  }

  function setActiveTab(tab){
    document.querySelectorAll('.navBtn').forEach(function(btn){ btn.classList.remove('selected'); });
    const map = { achieve:'navAchieve', home:'navHome', shop:'navShop' };
    document.getElementById(map[tab]).classList.add('selected');
  }
  setActiveTab('home');

  document.getElementById('navAchieve').addEventListener('click', ()=>{
    resetInFlightFX();
    renderAchievements();
    hideAllPages();
    document.getElementById('achievePage').classList.add('show');
    setActiveTab('achieve');
  });

  injectFunUpgradeStyles();
  buildGrid();
  tickHeartRegen();
  newStageBoard();
  window.addEventListener('resize', drawChainLine);
  setInterval(()=>{ tickHeartRegen(); renderHeartsVal(); }, 1000);

  const splashEl = document.getElementById('splashScreen');
  if(splashEl){
    splashEl.addEventListener('click', ()=>{
      splashEl.classList.add('hide');
      if(bgmOn) bgmAudio.play().catch(()=>{});
    }, { once:true });
  }
})();
