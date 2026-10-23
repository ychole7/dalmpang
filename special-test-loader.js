/* Dalmpang V40 - real six-special mechanics test (stage 1 only).
 * Loads the deployed game.js unchanged and injects six real specials in createSpecials.
 * No overlay sprites. After QA, replace the loader script tag with game.js.
 */
(function () {
  'use strict';
  const src = 'game.js';
  const anchor = "const stageNo=stageSlot()+1;";
  const test = `
    // V40 QA mode: six REAL special tiles on first stage, no URL parameters.
    // Only affects stage slot 0. Later stages retain the original rules.
    if (stageSlot() === 0) {
      const fixed = [
        {r:1,c:2,type:'stone'}, {r:1,c:4,type:'bomb'},
        {r:2,c:2,type:'star'},  {r:2,c:4,type:'ice'},
        {r:3,c:2,type:'gift'},  {r:3,c:4,type:'rainbow'}
      ];
      for (const p of fixed) {
        specials.set(skey(p.r,p.c),p.type);
        // A neighboring regular chick always shares the special tile's
        // underlying color, so bomb/star/gift have a reachable match.
        if (p.type==='bomb'||p.type==='star'||p.type==='gift')
          board[p.r][p.c-1] = board[p.r][p.c];
      }
      return;
    }
    `;
  fetch(src, { cache:'no-store' })
    .then(function (res) {
      if (!res.ok) throw Error('game.js HTTP '+res.status);
      return res.text();
    })
    .then(function (code) {
      const hits=code.split(anchor).length-1;
      if (hits!==1 || !code.includes('function createSpecials(){') ||
          !code.includes("specials.clear();")) {
        throw Error('game.js version mismatch: special insertion not safe');
      }
      const patched=code.replace(anchor,test+'\n    '+anchor);
      // Run as an ordinary classic script, preserving the original IIFE.
      const script=document.createElement('script');
      script.textContent=patched+'\n//# sourceURL=dalmpang-v40-game.js';
      document.body.appendChild(script);
    })
    .catch(function(err){
      console.error('[닮팡 V40 특수타일 테스트]',err);
      const note=document.createElement('div');
      note.style.cssText='position:fixed;z-index:99999;left:12px;right:12px;top:70px;background:#972b2b;color:white;padding:14px;border-radius:12px;font:14px sans-serif';
      note.textContent='특수 타일 테스트를 시작하지 못했습니다: '+err.message;
      document.body.appendChild(note);
    });
})();
