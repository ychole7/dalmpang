/* Dalmpang V41 stage balance - production playtest 1-30.
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
    let n=0;
    for(const type of requested){
      let placed=false;
      for(let k=n;k<cells.length;k++){
        const p=cells[k];
        if([...specials.keys()].some(key=>{const [r,c]=key.split(',').map(Number);return Math.abs(r-p.r)<=1&&Math.abs(c-p.c)<=1;}))continue;
        specials.set(skey(p.r,p.c),type);
        if(!hasOpenPair()){specials.delete(skey(p.r,p.c));continue;}
        // Enable a reachable match beside activatable power tiles.
        if(['star','bomb','gift'].includes(type)){
          const nc=p.c>0?p.c-1:p.c+1;
          if(!specialAt(p.r,nc))board[p.r][nc]=board[p.r][p.c];
        }
        placed=true;break;
      }
      if(placed)n++;
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
    const script=document.createElement('script');script.textContent=code+'\n//# sourceURL=dalmpang-v41-game.js';document.body.appendChild(script);
  }).catch(err=>{console.error('[Dalmpang V41]',err);const box=document.createElement('div');box.style.cssText='position:fixed;z-index:99999;left:10px;right:10px;top:60px;padding:14px;border-radius:9px;color:#fff;background:#a22';box.textContent='V41 로딩 오류: '+err.message;document.body.appendChild(box);});
})();
