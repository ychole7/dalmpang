/* Dalmpang V36.1 - always-on special tile visual preview.
   Visual overlay only; no changes to the underlying game mechanics. */
(() => {
  const types = ['stone','bomb','star','ice','gift','rainbow'];
  const labels = ['돌멩이','폭탄','황금별','얼음','선물상자','무지개 수정'];
  const indices = [8, 10, 14, 16, 20, 22]; // zero based; three pairs across rows 2–4
  function showPreview() {
    const grid = document.getElementById('grid');
    if (!grid || grid.children.length !== 48) return;
    types.forEach((type, i) => {
      const tile = grid.children[indices[i]];
      if (!tile) return;
      let img = tile.querySelector(':scope > .dp-special-preview');
      if (!img) {
        img = document.createElement('img');
        img.className = 'dp-special-preview';
        img.alt = labels[i] + ' (외형 확인용)';
        img.draggable = false;
        img.src = 'assets/images/special_' + type + '.png';
        img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;z-index:3;pointer-events:none;';
        tile.appendChild(img);
      }
    });
  }
  function init() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    const observer = new MutationObserver(records => {
      if (records.some(x => x.type === 'childList' && [...x.removedNodes].some(n => n.nodeType === 1) ||
                     x.type === 'childList' && [...x.addedNodes].some(n => n.nodeType === 1 && !n.classList?.contains('dp-special-preview')))) {
        queueMicrotask(showPreview);
      }
    });
    observer.observe(grid,{childList:true,subtree:true});
    showPreview();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
