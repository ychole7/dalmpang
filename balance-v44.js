/* Dalmpang V44 stage balance + reliable objective missions (based on V42).
 * Rewrites the loaded game source in memory so existing animations stay intact.
 * V40 special-test-loader.js is not loaded; six forced tiles are removed.
 */
(function(){
  'use strict';
  const themePlan=['chick','chick','chick','strawberry','strawberry','rabbit','flower','flower','flower','dog','dog','chick','cat','cat','cat','bear','bear','pig','pig','pig','strawberry','strawberry','rabbit','rabbit','rabbit','flower','flower','cat','cat','chick'];
  const configurations=[
    [],[],[],[],[],['star'],[],[],[],['stone'],['stone'],['star'],['bomb'],['bomb'],['bomb','star'],['stone','bomb'],['stone'],['ice'],['ice'],['stone','ice'],['gift'],['gift','star'],['bomb','gift'],['stone','bomb'],['ice','star'],['rainbow'],['rainbow','star'],['stone','ice','rainbow'],['bomb','gift','rainbow'],['stone','bomb','star','ice','gift','rainbow']
  ];
  const balance = `
    // V41: Stage-specific theme and difficulty; no 8-theme fixed rotation.
    const v41Themes=["chick","chick","chick","strawberry","strawberry","rabbit","flower","flower","flower","dog","dog","chick","cat","cat","cat","bear","bear","pig","pig","pig","strawberry","strawberry","rabbit","rabbit","rabbit","flower","flower","cat","cat","chick"];
    const v41Map={chick:CHICK_STAGE,strawberry:STRAWBERRY_EASY,dog:DOG_EASY,flower:FLOWER_EASY,rabbit:RABBIT_EASY,cat:CAT_EASY,bear:BEAR_EASY,pig:PIG_EASY};
    const v41Specials=[[], [], [], [], [], ["star"], [], [], [], ["stone"], ["stone"], ["star"], ["bomb"], ["bomb"], ["bomb", "star"], ["stone", "bomb"], ["stone"], ["ice"], ["ice"], ["stone", "ice"], ["gift"], ["gift", "star"], ["bomb", "gift"], ["stone", "bomb"], ["ice", "star"], ["rainbow"], ["rainbow", "star"], ["stone", "ice", "rainbow"], ["bomb", "gift", "rainbow"], ["stone", "bomb", "star", "ice", "gift", "rainbow"]];
    // V42 objective missions: zero-based stage slots, score target AND mission required.
    const v42Missions={
      5:{kind:'star',need:1,label:'⭐ 황금별 1회 사용'},
      12:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'},
      17:{kind:'ice',need:1,label:'🧊 얼음 1개 해제'},
      20:{kind:'gift',need:1,label:'🎁 선물상자 1개 열기'},
      25:{kind:'rainbow',need:1,label:'🌈 무지개 1회 연결'},
      29:{kind:'bomb',need:1,label:'💣 폭탄 1회 발동'}
    };
    let v42MissionCount=0;
    function v42Mission(){return v42Missions[stageSlot()]||null;}
    function v42MissionDone(){const m=v42Mission();return !m||v42MissionCount>=m.need;}
    function v42MissionUpdate(){
      let el=document.getElementById('dpV42Mission');
      if(!el){
        el=document.createElement('div');el.id='dpV42Mission';
        el.style.cssText='margin:3px auto 1px;max-width:400px;padding:5px 9px;background:linear-gradient(135deg,#fffaf0,#ffeccc);border:1px solid #dba859;border-radius:12px;color:#724512;font-weight:800;font-size:12px;line-height:1.4;text-align:center;box-shadow:0 2px 5px #86522018;';
        const wrap=document.getElementById('boardWrap');
        if(wrap&&wrap.parentNode)wrap.parentNode.insertBefore(el,wrap);
      }
      const m=v42Mission();
      el.style.display=m?'block':'none';
      if(m)el.textContent='특별 미션 · '+m.label+'  '+Math.min(v42MissionCount,m.need)+'/'+m.need+(v42MissionDone()?' ✓':'');
    }
    function v42MissionProgress(splash,originalCells){
      const m=v42Mission();if(!m||v42MissionDone())return;
      const count=m.kind==='star'?(splash.star?1:0):
        m.kind==='bomb'?splash.exploded:
        m.kind==='ice'?splash.thawed:
        m.kind==='gift'?splash.giftCount:
        m.kind==='rainbow'?(originalCells.some(p=>specialAt(p.r,p.c)==='rainbow')?1:0):0;
      if(count>0){v42MissionCount=Math.min(m.need,v42MissionCount+count);v42MissionUpdate();}
    }
    // Ensure a required mission object remains obtainable until its objective is complete.
    // This operates on the actual board/specials model, never on overlay images.
    function v43RestoreMissionTile(){
      const m=v42Mission();
      if(!m || v42MissionDone() || currentStage().type!=='chick')return;
      const kind=m.kind;
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
      return Math.round((2400+(i-30)*45)/10)*10;
    }
    function v41Moves(i){
      if(i<3)return 18;
      if(i<10)return 17;
      if(i<20)return 17;
      if(i<30)return 18;
      return 18+Math.min(6,Math.floor((i-30)/50));
    }
    function v41AllowedSpecials(i){
      if(i<30)return v41Specials[i];
      const unlocked=i<40?['stone','bomb','star','ice']:i<55?['stone','bomb','star','ice','gift']:SPECIAL_TYPES;
      // Beyond stage 30 progressively allow 1-3 specials, not six at once.
      return Array.from({length:Math.min(3,1+Math.floor((i-30)/15))},(_,n)=>unlocked[(i*3+n*2)%unlocked.length]);
    }
  `;
  const sourcePatterns=[
    {name:'stage builder',from:"if(i < 50) base=TEST_THEME_ROTATION[i % TEST_THEME_ROTATION.length];\n      else base=pool[i % pool.length];",to:"base=v41Stage(i);"},
    {name:'target',from:'const target = Math.round((250 + 300*Math.sqrt(i)) * band.targetMul);',to:'const target = v41StageTarget(i);'},
    {name:'stage push',from:'arr.push(Object.assign({}, base, { target: target, timeLimit: i<50 ? null : band.timeLimit }));',to:'arr.push(Object.assign({}, base, { target: target, timeLimit: i<30 ? null : band.timeLimit }));'},
    {name:'moves',from:'function movesBudget(){ return 16 + Math.min(16, Math.floor(stageIndex/25)); }',to:'function movesBudget(){ return v41Moves(stageIndex); }'}
  ];
  const specialReplacement=`function createSpecials(){
    specials.clear();
    const stage=currentStage();
    if(stage.type!=='chick')return;
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
  }`;
  const marker='  function createSpecials(){';
  const endMarker='  function specialAt(r,c)';
  fetch('game.js',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('game.js '+r.status);return r.text();}).then(code=>{
    if(code.split('function buildStages(total){').length!==2||code.split(marker).length!==2)throw Error('game.js incompatible');
    const insertion='  function bandFor(i){';
    if(code.split(insertion).length!==2)throw Error('balance insertion mismatch');
    code=code.replace(insertion,balance+'\n'+insertion);
    for(const v of sourcePatterns){if(code.split(v.from).length!==2)throw Error('balance '+v.name+' mismatch');code=code.replace(v.from,v.to);}
    const a=code.indexOf(marker),b=code.indexOf(endMarker,a);
    if(a<0||b<a)throw Error('special code mismatch');
    code=code.slice(0,a)+'  '+specialReplacement+'\n'+code.slice(b);
    // V42: patch actual game logic, not visual overlays.
    const patches=[
      ['mission reset',"function newStageBoard(){\n    stageScore = 0;","function newStageBoard(){\n    v42MissionCount=0;\n    stageScore = 0;"],
      ['mission display',"    startNewStageTimer();\n    updateHud();\n    render();\n    checkNoMoves();","    startNewStageTimer();\n    updateHud();\n    v42MissionUpdate();\n    render();\n    checkNoMoves();"],
      ['mission event',"    const chickPop=currentStage().type==='chick';\n    const reward=", "    if(!isBonus)v42MissionProgress(splash,cells.slice());\n    const chickPop=currentStage().type==='chick';\n    const reward="],
      ['mission restore',"poppingInProgress=false;\n        updateHud();","poppingInProgress=false;\n        v43RestoreMissionTile();\n        updateHud();"],
      ['mission clear check',"if(stageScore>=currentStage().target) showStageClear();", "if(stageScore>=currentStage().target && v42MissionDone()) showStageClear();"],
      ['mission hud',"    const st = currentStage();\n    const bonus = previewBonus || 0;", "    const st = currentStage();\n    v42MissionUpdate();\n    const bonus = previewBonus || 0;"]
    ];
    for(const patch of patches){
      const [name,from,to]=patch;
      if(code.split(from).length!==2)throw Error('V42 '+name+' mismatch');
      code=code.replace(from,to);
    }
    // V44: Clear transient combo FX when switching tabs. A hidden game can finish
    // a pop asynchronously; do not spawn a new animation while the game is hidden.
    const fxPatches=[
      ["combo visibility guard",
        "function triggerPopEffect(count, gained){\n    popEffectEl.classList.remove",
        "function triggerPopEffect(count, gained){\n    if(document.getElementById('mainScreen').style.display==='none') return;\n    popEffectEl.classList.remove"],
      ["FX cleanup",
        "function resetInFlightFX(){\n    popEffectEl.classList.remove('show', ...COMBO_TIER_KEYS);\n    const flash = document.getElementById('boardFlash');\n    flash.classList.remove('show');\n    const wrap = document.getElementById('boardWrap');\n    wrap.classList.remove('shaking');\n  }",
        `function resetInFlightFX(){
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
  }`],
      ["return home cleanup",
        "document.getElementById('navHome').addEventListener('click', ()=>{\n    document.getElementById('achievePage')",
        "document.getElementById('navHome').addEventListener('click', ()=>{\n    resetInFlightFX();\n    document.getElementById('achievePage')"]
    ];
    for(const [name,from,to] of fxPatches){
      if(code.split(from).length!==2) throw Error('V44 '+name+' mismatch');
      code=code.replace(from,to);
    }
    const script=document.createElement('script');script.textContent=code+'\n//# sourceURL=dalmpang-v44-game.js';document.body.appendChild(script);
  }).catch(err=>{console.error('[Dalmpang V43]',err);const box=document.createElement('div');box.style.cssText='position:fixed;z-index:99999;left:10px;right:10px;top:60px;padding:14px;border-radius:9px;color:#fff;background:#a22';box.textContent='V43 로딩 오류: '+err.message;document.body.appendChild(box);});
})();
